import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { catalog } from '../fixtures';
import { retrieve } from '../../src/platform/domain';
export async function fakeSupabase() {
  const docs = JSON.parse(
    await readFile(
      new URL('../../data/chatbot/knowledge-drafts.json', import.meta.url),
      'utf8',
    ),
  ).map((d: any, i: number) => ({ ...d, id: 'kb-' + i }));
  const buyer = '00000000-0000-4000-8000-000000000001',
    admin = '00000000-0000-4000-8000-000000000002';
  const state = {
    quota: true,
    locked: false,
    records: [] as any[],
    kpis: [] as any[],
    tickets: [] as any[],
    docs,
  };
  const profiles = [
    {
      id: buyer,
      full_name: 'Doanh nghiệp thử nghiệm',
      company: 'Logistics Test',
      role: 'BUYER',
      status: 'active',
    },
    {
      id: admin,
      full_name: 'Quản trị thử nghiệm',
      company: 'POLYMATCH',
      role: 'ADMIN',
      status: 'active',
    },
  ];
  const server = createServer(async (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PATCH,OPTIONS');
    if (req.method === 'OPTIONS') {
      res.end();
      return;
    }
    const url = new URL(req.url || '/', 'http://fake');
    let raw = '';
    for await (const c of req) raw += c;
    const body = raw ? JSON.parse(raw) : {};
    const isAdmin = req.headers.authorization === 'Bearer admin-token',
      owner = isAdmin ? admin : buyer;
    const authUser = (id: string) => ({
      id,
      email: id === admin ? 'admin@example.test' : 'buyer@example.test',
      aud: 'authenticated',
      role: 'authenticated',
      app_metadata: { provider: 'email' },
      user_metadata: {},
      created_at: new Date().toISOString(),
    });
    let output: any = [];
    const single = String(req.headers.accept).includes('vnd.pgrst.object');
    const filter = (rows: any[]) => {
      let result = rows.filter((r) => {
        for (const [key, value] of url.searchParams) {
          if (
            value.startsWith('eq.') &&
            r[key] !==
              (value.slice(3) === 'false'
                ? false
                : value.slice(3) === 'true'
                  ? true
                  : value.slice(3))
          )
            return false;
        }
        return true;
      });
      const offset = Number(url.searchParams.get('offset') || 0),
        limit = Number(url.searchParams.get('limit') || 1000);
      result = result.slice(offset, offset + limit);
      return single ? (result[0] ?? null) : result;
    };
    try {
      if (url.pathname === '/auth/v1/token') {
        const id = body.email?.startsWith('admin') ? admin : buyer;
        output = {
          access_token: id === admin ? 'admin-token' : 'buyer-token',
          refresh_token: 'test-refresh',
          token_type: 'bearer',
          expires_in: 3600,
          user: authUser(id),
        };
      } else if (url.pathname === '/auth/v1/user') {
        if (
          !['Bearer buyer-token', 'Bearer admin-token'].includes(
            req.headers.authorization || '',
          )
        ) {
          res.statusCode = 401;
          output = { message: 'Invalid JWT' };
        } else output = authUser(owner);
      } else if (url.pathname === '/auth/v1/logout') output = {};
      else if (url.pathname === '/rest/v1/pm_profiles') {
        output = filter(
          profiles.map((p) => ({
            ...p,
            status: state.locked && p.id === buyer ? 'locked' : p.status,
          })),
        );
      } else if (url.pathname === '/rest/v1/rpc/pm_consume_quota')
        output = state.quota;
      else if (url.pathname === '/rest/v1/pm_solutions')
        output = filter(catalog);
      else if (url.pathname === '/rest/v1/rpc/pm_save_assessment') {
        const r = {
          id: 'assessment-' + state.records.length,
          user_id: owner,
          kind: 'assessment',
          input: body.payload_input,
          result: body.payload_result,
          created_at: new Date().toISOString(),
        };
        state.records.unshift(r);
        for (const k of body.payload_kpis) {
          const idx = state.kpis.findIndex(
            (x) =>
              x.code === k.code && x.period === k.period && x.user_id === owner,
          );
          const row = { ...k, user_id: owner };
          if (idx < 0) state.kpis.push(row);
          else state.kpis[idx] = row;
        }
        output = { id: r.id, created_at: r.created_at };
      } else if (url.pathname === '/rest/v1/pm_records') {
        if (req.method === 'POST') {
          const r = {
            ...body,
            id: body.kind + '-' + state.records.length,
            created_at: new Date().toISOString(),
          };
          state.records.unshift(r);
          output = single ? r : [r];
        } else output = filter(state.records);
      } else if (url.pathname === '/rest/v1/pm_kpis') {
        if (req.method === 'POST') {
          const idx = state.kpis.findIndex(
            (k) =>
              k.code === body.code &&
              k.period === body.period &&
              k.user_id === owner,
          );
          if (idx < 0) state.kpis.push(body);
          else state.kpis[idx] = body;
          output = [];
        } else output = filter(state.kpis);
      } else if (url.pathname === '/rest/v1/pm_tickets') {
        if (req.method === 'POST') {
          const exists = state.tickets.find(
            (t) => t.user_id === owner && t.request_id === body.request_id,
          );
          if (exists) output = [];
          else {
            const t = {
              ...body,
              id: 'ticket-' + state.tickets.length,
              status: 'open',
              created_at: new Date().toISOString(),
            };
            state.tickets.unshift(t);
            output = [t];
          }
        } else output = filter(state.tickets);
      } else if (url.pathname === '/rest/v1/rpc/pm_search_knowledge')
        output = retrieve(
          body.query_text,
          state.docs.filter(
            (d: any) => d.published && d.kind === body.kind_filter,
          ),
        );
      else if (url.pathname === '/rest/v1/pm_knowledge') {
        if (req.method === 'PATCH') {
          const id = url.searchParams.get('id')?.slice(3);
          Object.assign(
            state.docs.find((d: any) => d.id === id),
            body,
          );
          output = [];
        } else if (req.method === 'POST') {
          state.docs.push({ ...body, id: 'manual-' + state.docs.length });
          output = [];
        } else output = filter(state.docs);
      } else if (url.pathname === '/rest/v1/pm_reference') output = [];
      else {
        res.statusCode = 404;
        output = { message: 'Unknown test endpoint ' + url.pathname };
      }
      res.end(JSON.stringify(output));
    } catch (e) {
      res.statusCode = 500;
      res.end(JSON.stringify({ message: (e as Error).message }));
    }
  });
  await new Promise<void>((r) => server.listen(0, '127.0.0.1', r));
  const address = server.address();
  if (!address || typeof address === 'string') throw Error('No mock port');
  return {
    url: `http://127.0.0.1:${address.port}`,
    server,
    state,
    buyer,
    admin,
  };
}
