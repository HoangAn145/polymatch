begin;
create table public.admin_audit (
 id bigint generated always as identity primary key,
 actor_id uuid references profiles,
 table_name text not null, record_id text not null, action text not null,
 before jsonb, after jsonb, created_at timestamptz not null default now()
);
alter table public.admin_audit enable row level security;
create policy audit_admin_read on admin_audit for select to authenticated using(public.is_admin());
grant select on admin_audit to authenticated;
revoke all on admin_audit from anon;
create function public.audit_admin_change() returns trigger language plpgsql security definer set search_path=public as $$
begin
 insert into admin_audit(actor_id,table_name,record_id,action,before,after)
 values(auth.uid(),TG_TABLE_NAME,coalesce(to_jsonb(new)->>'id',to_jsonb(old)->>'id'),TG_OP,
 case when TG_OP='INSERT' then null else to_jsonb(old) end,
 case when TG_OP='DELETE' then null else to_jsonb(new) end);
 return coalesce(new,old);
end; $$;
create trigger audit_knowledge after insert or update or delete on knowledge_documents for each row execute function public.audit_admin_change();
create trigger audit_profiles after update on profiles for each row execute function public.audit_admin_change();
create trigger audit_tickets after update on support_tickets for each row execute function public.audit_admin_change();
commit;
