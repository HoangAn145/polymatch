begin;
create table public.chat_queries (
 id uuid primary key default gen_random_uuid(),
 user_id uuid not null references public.profiles(id) on delete cascade,
 question text not null check(length(question) between 1 and 2000),
 intent text not null check(intent in ('customer_support','logistics_market','technology','news_policy')),
 strategy text not null check(strategy in ('rag','rag_search','live_search')),
 response jsonb not null check(jsonb_typeof(response)='object' and length(response::text)<=60000),
 created_at timestamptz not null default now(),
 unique(id,user_id),
 check((intent in ('customer_support','technology') and strategy='rag') or (intent='logistics_market' and strategy='rag_search') or (intent='news_policy' and strategy='live_search'))
);
create table public.chat_news_items (
 id uuid primary key default gen_random_uuid(),
 query_id uuid not null,
 user_id uuid not null references public.profiles(id) on delete cascade,
 title text not null check(length(title) between 1 and 500),
 url text not null check(length(url)<=3000 and url ~ '^https?://'),
 summary text not null default '' check(length(summary)<=1200),
 published_on date, adopted_on date, issued_on date, effective_on date,
 source_type text not null check(source_type in ('official','news_media','primary_source','other')),
 retrieved_at timestamptz not null,
 content_kind text not null default 'generated_summary' check(content_kind='generated_summary'),
 foreign key(query_id,user_id) references public.chat_queries(id,user_id) on delete cascade
);
create index chat_query_owner on public.chat_queries(user_id,created_at desc);
create index chat_news_owner on public.chat_news_items(user_id,retrieved_at desc);
alter table public.chat_queries enable row level security;
alter table public.chat_news_items enable row level security;
revoke all on public.chat_queries,public.chat_news_items from anon,authenticated;
grant select,delete on public.chat_queries to authenticated;
grant select on public.chat_news_items to authenticated;
create policy chat_query_read on public.chat_queries for select to authenticated using(user_id=auth.uid() and public.is_active());
create policy chat_query_delete on public.chat_queries for delete to authenticated using(user_id=auth.uid() and public.is_active());
create policy chat_news_read on public.chat_news_items for select to authenticated using(user_id=auth.uid() and public.is_active());
create function public.record_chat_response(p_question text,p_intent text,p_strategy text,p_response jsonb,p_sources jsonb)
 returns uuid language plpgsql security definer set search_path=public,pg_temp as $$
declare owner_id uuid := auth.uid(); query_uuid uuid; item jsonb;
begin
 if owner_id is null or not public.is_active() then raise exception 'Not authorized'; end if;
 if p_sources is null or jsonb_typeof(p_sources)<>'array' or jsonb_array_length(p_sources)>12 then raise exception 'Invalid sources'; end if;
 if jsonb_typeof(p_response)<>'object' or p_response->>'intent' is distinct from p_intent or p_response->>'strategy' is distinct from p_strategy then raise exception 'Invalid response'; end if;
 if jsonb_typeof(p_response->'sources') is distinct from 'array' or jsonb_typeof(p_response->'claims') is distinct from 'array' or jsonb_typeof(p_response->'answer') is distinct from 'string' then raise exception 'Invalid response structure'; end if;
 if exists(select 1 from jsonb_object_keys(p_response) key where key not in ('answer','sources','claims','handoff','mode','intent','strategy','router','retrievedAt','warnings','historySaved','historyId')) then raise exception 'Unexpected response fields'; end if;
 insert into public.chat_queries(user_id,question,intent,strategy,response) values(owner_id,p_question,p_intent,p_strategy,p_response) returning id into query_uuid;
 for item in select value from jsonb_array_elements(p_sources) loop
  if exists(select 1 from jsonb_object_keys(item) key where key not in ('title','url','summary','published_on','adopted_on','issued_on','effective_on','source_type','retrieved_at')) then raise exception 'Only source metadata and generated summary may be stored'; end if;
  insert into public.chat_news_items(query_id,user_id,title,url,summary,published_on,adopted_on,issued_on,effective_on,source_type,retrieved_at)
  values(query_uuid,owner_id,item->>'title',item->>'url',coalesce(item->>'summary',''),(item->>'published_on')::date,(item->>'adopted_on')::date,(item->>'issued_on')::date,(item->>'effective_on')::date,item->>'source_type',(item->>'retrieved_at')::timestamptz);
 end loop;
 return query_uuid;
end;
$$;
revoke all on function public.record_chat_response(text,text,text,jsonb,jsonb) from public;
grant execute on function public.record_chat_response(text,text,text,jsonb,jsonb) to authenticated;
commit;
