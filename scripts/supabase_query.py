"""Execute a reviewed SQL file/query on the user's configured Supabase project.

Uses the management HTTP secret through curl's configured HTTPS proxy. No token is logged.
Does not create credentials, disable TLS verification, or publish environment changes.
"""
import argparse,json,os,re,subprocess,tempfile
from pathlib import Path

def execute(sql,project):
 if not re.fullmatch('[a-z0-9]{20}',project):raise ValueError('Invalid project reference')
 token=os.environ.get('SUPABASE_ACCESS_TOKEN','')
 if not token:raise RuntimeError('SUPABASE_ACCESS_TOKEN missing; enter through secure environment settings')
 if any(c in token for c in '\r\n'):raise ValueError('Invalid token format')
 with tempfile.TemporaryDirectory(prefix='pm-supabase-') as directory:
  request=Path(directory)/'request.json';response=Path(directory)/'response.json'
  request.write_text(json.dumps({'query':sql}),encoding='utf8')
  header=('Authorization: Bearer '+token).replace('\\','\\\\').replace('"','\\"')
  config='header = "'+header+'"\n'
  result=subprocess.run(['curl','--silent','--show-error','--max-time','60','--request','POST','https://api.supabase.com/v1/projects/'+project+'/database/query','--config','-','--header','Content-Type: application/json','--data-binary','@'+str(request),'--output',str(response),'--write-out','%{http_code}'],input=config,text=True,capture_output=True)
  if result.returncode:raise RuntimeError('Management request failed (curl code '+str(result.returncode)+')')
  try:data=json.loads(response.read_text())
  except Exception:raise RuntimeError('Management API returned non-JSON, HTTP '+result.stdout)
  if not result.stdout.startswith('2'):raise RuntimeError('Supabase HTTP '+result.stdout+': '+str(data.get('message','Request rejected'))[:300])
  return data
if __name__=='__main__':
 parser=argparse.ArgumentParser(description=__doc__);parser.add_argument('--project',default='cjwnwdzegbdywuhbkavb');group=parser.add_mutually_exclusive_group(required=True);group.add_argument('--file',type=Path);group.add_argument('--query');args=parser.parse_args();print(json.dumps(execute(args.file.read_text(encoding='utf8') if args.file else args.query,args.project),ensure_ascii=False))
