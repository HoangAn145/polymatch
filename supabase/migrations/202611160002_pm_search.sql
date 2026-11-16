begin;
create function public.pm_normalize(value text) returns text language sql immutable strict parallel safe set search_path='' as $$ select translate(lower(value),'àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ','aaaaaaaaaaaaaaaaaeeeeeeeeeeeiiiiiooooooooooooooooouuuuuuuuuuuyyyyyd'); $$;
create index pm_knowledge_search on public.pm_knowledge using gin(to_tsvector('simple',public.pm_normalize(title||' '||content))) where published;
create function public.pm_search_knowledge(query_text text,kind_filter text default 'knowledge',result_limit integer default 4)
returns table(id uuid,external_id text,title text,content text,url text,source_references jsonb,updated_at timestamptz)
language sql stable security invoker set search_path='' as $$
with words as(select distinct word from regexp_split_to_table(public.pm_normalize(left(coalesce(query_text,''),1500)),'[^a-z0-9]+') word where length(word)>=2 and word not in ('la','gi','co','va','ve','toi','cho','cua','duoc','khong','nhu','the','nao','mot','nhung','voi','thi')),
terms as(select nullif(string_agg(plainto_tsquery('simple',word)::text,' | '),'')::tsquery q from words)
select d.id,d.external_id,d.title,d.content,d.url,d.source_references,d.updated_at from public.pm_knowledge d cross join terms t
where d.published and d.kind=kind_filter and t.q is not null and to_tsvector('simple',public.pm_normalize(d.title||' '||d.content)) @@ t.q
order by ts_rank_cd(setweight(to_tsvector('simple',public.pm_normalize(d.title)),'A')||setweight(to_tsvector('simple',public.pm_normalize(d.content)),'B'),t.q) desc,d.id
limit greatest(1,least(coalesce(result_limit,4),10));
$$;
revoke all on function public.pm_normalize(text),public.pm_search_knowledge(text,text,integer) from public;
grant execute on function public.pm_normalize(text),public.pm_search_knowledge(text,text,integer) to authenticated;
commit;
