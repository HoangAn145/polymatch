"""Verify tenant RLS in a rolled-back hosted transaction. Sends no signup emails."""
import json,uuid
from supabase_query import execute
alice,bob=str(uuid.uuid4()),str(uuid.uuid4())
sql="""begin;
insert into auth.users(id,email,raw_user_meta_data) values('ALICE','pm-qa-ALICE@example.invalid','{"role":"ADMIN"}'),('BOB','pm-qa-BOB@example.invalid','{}');
do $$ begin if (select role from public.pm_profiles where id='ALICE') <> 'BUYER' then raise exception 'Metadata privilege escalation';end if;end;$$;
set local role authenticated;
select set_config('request.jwt.claim.sub','ALICE',true),set_config('request.jwt.claims','{"sub":"ALICE","role":"authenticated"}',true);
do $$ declare blocked boolean:=false;attempt integer;begin
 if (select count(*) from public.pm_profiles) <> 1 then raise exception 'Profile isolation failed';end if;
 if (select count(*) from public.pm_reference) <> 0 then raise exception 'Reference isolation failed';end if;
 if exists(select 1 from public.pm_knowledge where not published) then raise exception 'Draft exposure';end if;
 insert into public.pm_records(user_id,kind,input,result) values('ALICE','roi','{}','{}');
 begin insert into public.pm_records(user_id,kind,input,result) values('BOB','roi','{}','{}');exception when insufficient_privilege then blocked:=true;end;
 if not blocked then raise exception 'Cross-owner write allowed';end if;
 update public.pm_profiles set role='ADMIN' where id='ALICE';
 if (select role from public.pm_profiles where id='ALICE') <> 'BUYER' then raise exception 'Role escalation';end if;
 for attempt in 1..30 loop if not public.pm_consume_quota() then raise exception 'Quota rejected early';end if;end loop;
 if public.pm_consume_quota() then raise exception 'Quota not enforced';end if;
end;$$;
select set_config('request.jwt.claim.sub','BOB',true),set_config('request.jwt.claims','{"sub":"BOB","role":"authenticated"}',true);
do $$ begin if exists(select 1 from public.pm_records where user_id='ALICE') then raise exception 'Cross-owner read allowed';end if;end;$$;
rollback;
select 'passed' as hosted_rls_transaction;
""".replace('ALICE',alice).replace('BOB',bob)
print(json.dumps(execute(sql,'cjwnwdzegbdywuhbkavb'),ensure_ascii=False))
