begin;
-- SECURITY INVOKER keeps owner RLS. Report and baseline KPIs commit together or not at all.
create function public.pm_save_assessment(payload_input jsonb,payload_result jsonb,payload_kpis jsonb) returns jsonb language plpgsql security invoker set search_path='' as $$
declare record_id uuid;created timestamptz;k jsonb;
begin
 insert into public.pm_records(user_id,kind,input,result) values(auth.uid(),'assessment',payload_input,payload_result) returning id,created_at into record_id,created;
 for k in select * from jsonb_array_elements(payload_kpis) loop
  insert into public.pm_kpis(user_id,code,value,target,period,source) values(auth.uid(),k->>'code',(k->>'value')::numeric,(k->>'target')::numeric,k->>'period',k->>'source')
  on conflict(user_id,code,period) do update set value=excluded.value,target=excluded.target,source=excluded.source,updated_at=now();
 end loop;
 return jsonb_build_object('id',record_id,'created_at',created);
end; $$;
revoke all on function public.pm_save_assessment(jsonb,jsonb,jsonb) from public;
grant execute on function public.pm_save_assessment(jsonb,jsonb,jsonb) to authenticated;
commit;
