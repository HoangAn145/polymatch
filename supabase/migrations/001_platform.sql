begin;
create table public.profiles (
 id uuid primary key references auth.users on delete cascade,
 email text not null, role text not null check(role in ('BUYER','SELLER','ADMIN')) default 'BUYER',
 status text not null check(status in ('active','pending','locked')) default 'active',
 full_name text not null default '', company_name text not null default '',
 created_at timestamptz not null default now()
);
create function public.is_admin() returns boolean language sql stable security definer set search_path=public as $$
 select exists(select 1 from profiles where id=auth.uid() and role='ADMIN' and status='active'); $$;
create function public.is_active() returns boolean language sql stable security definer set search_path=public as $$
 select exists(select 1 from profiles where id=auth.uid() and status<>'locked'); $$;
create function public.on_signup() returns trigger language plpgsql security definer set search_path=public as $$
begin
 insert into profiles(id,email,role,status,full_name,company_name) values (
 new.id,new.email,case when new.raw_user_meta_data->>'role'='SELLER' then 'SELLER' else 'BUYER' end,
 case when new.raw_user_meta_data->>'role'='SELLER' then 'pending' else 'active' end,
 left(coalesce(new.raw_user_meta_data->>'fullName',''),200),left(coalesce(new.raw_user_meta_data->>'companyName',''),300));
 return new;
end; $$;
create trigger auth_signup after insert on auth.users for each row execute function public.on_signup();
create table public.enterprises (
 user_id uuid primary key references profiles on delete cascade, data jsonb not null,
 updated_at timestamptz not null default now()
);
create table public.assessments (
 id uuid primary key default gen_random_uuid(), user_id uuid not null references profiles,
 result jsonb not null, created_at timestamptz not null default now()
);
create table public.roadmaps (
 id uuid primary key default gen_random_uuid(), user_id uuid not null references profiles,
 assessment_id uuid not null references assessments, data jsonb not null,
 created_at timestamptz not null default now()
);
create table public.kpi_entries (
 id uuid primary key default gen_random_uuid(), user_id uuid not null references profiles,
 name text not null check(length(name) between 1 and 200), unit text not null default '%',
 value numeric not null check(value >= 0 and value < 1e15), target numeric not null check(target>=0 and target<1e15),
 direction text not null check(direction in ('higher','lower')),
 measured_on date not null, created_at timestamptz not null default now()
);
create table public.support_tickets (
 id uuid primary key default gen_random_uuid(), user_id uuid not null references profiles,
 question text not null check(length(question) between 1 and 6000),
 status text not null default 'new' check(status in ('new','assigned','resolved')),
 department text not null default 'CSKH', response text not null default '',
 created_at timestamptz not null default now()
);
create table public.knowledge_documents (
 id text primary key, category text not null, title text not null, content text not null,
 source text not null default '', source_status text not null default '',
 status text not null default 'pending' check(status in ('pending','approved','rejected')),
 reviewed_by uuid references profiles, reviewed_at timestamptz,
 metadata jsonb not null default '{}',
 search_vector tsvector generated always as (to_tsvector('simple',title || ' ' || content)) stored
);
create index knowledge_search on knowledge_documents using gin(search_vector);
create index assessment_owner on assessments(user_id,created_at desc);
create index kpi_owner on kpi_entries(user_id,measured_on desc);
create index ticket_owner on support_tickets(user_id,created_at desc);
create table public.api_quota (user_id uuid primary key references profiles on delete cascade, bucket timestamptz not null, used integer not null);
create function public.consume_api_quota() returns boolean language plpgsql security definer set search_path=public as $$
declare n integer;
begin
 if auth.uid() is null or not public.is_active() then return false; end if;
 insert into api_quota values(auth.uid(),date_trunc('minute',now()),1)
 on conflict(user_id) do update set used=case when api_quota.bucket=date_trunc('minute',now()) then api_quota.used+1 else 1 end,bucket=date_trunc('minute',now())
 returning used into n;
 return n<=20;
end; $$;
revoke all on function public.consume_api_quota() from public;
grant execute on function public.consume_api_quota() to authenticated;
alter table profiles enable row level security;
alter table enterprises enable row level security;
alter table assessments enable row level security;
alter table roadmaps enable row level security;
alter table kpi_entries enable row level security;
alter table support_tickets enable row level security;
alter table knowledge_documents enable row level security;
alter table api_quota enable row level security;
create policy profile_read on profiles for select to authenticated using ((id=auth.uid() and public.is_active()) or public.is_admin());
create policy profile_admin on profiles for update to authenticated using(public.is_admin()) with check(public.is_admin());
create policy enterprise_owner on enterprises for all to authenticated using(user_id=auth.uid() and public.is_active()) with check(user_id=auth.uid() and public.is_active());
create policy assessment_read on assessments for select to authenticated using((user_id=auth.uid() and public.is_active()) or public.is_admin());
-- Assessment results are computed server-side via the narrowly scoped RPC below.
create policy roadmap_owner on roadmaps for all to authenticated using(user_id=auth.uid() and public.is_active()) with check(user_id=auth.uid() and public.is_active() and exists(select 1 from assessments a where a.id=assessment_id and a.user_id=auth.uid()));
create policy kpi_owner on kpi_entries for all to authenticated using(user_id=auth.uid() and public.is_active()) with check(user_id=auth.uid() and public.is_active());
create policy ticket_read on support_tickets for select to authenticated using((user_id=auth.uid() and public.is_active()) or public.is_admin());
create policy ticket_create on support_tickets for insert to authenticated with check(user_id=auth.uid() and public.is_active() and status='new' and response='');
create policy ticket_update on support_tickets for update to authenticated using(public.is_admin()) with check(public.is_admin());
create policy knowledge_read on knowledge_documents for select to authenticated using((status='approved' and public.is_active()) or public.is_admin());
create policy knowledge_admin on knowledge_documents for all to authenticated using(public.is_admin()) with check(public.is_admin());
-- Server writes use service-role only for computed assessment persistence, after validating JWT.
revoke all on all tables in schema public from anon;
grant select on profiles to authenticated;
grant update on profiles to authenticated;
grant select,insert,update,delete on enterprises,roadmaps,kpi_entries to authenticated;
grant select on assessments to authenticated;
grant select,insert,update on support_tickets to authenticated;
grant select,insert,update,delete on knowledge_documents to authenticated;
commit;
