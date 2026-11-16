import React, { useEffect, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import { supabase, query } from './client';
import Auth from './Auth';
import Diagnostic from './Diagnostic';
import Planning from './Planning';
import Support from './Support';
import Kpi from './Kpi';
import Admin from './Admin';
import RecordView, { type Stored } from './RecordView';
import type { Measurement } from './domain';
import { card, button, Notice } from './ui';
type Profile = {
  id: string;
  full_name: string;
  company: string;
  role: string;
  status: string;
};
type Ticket = {
  id: string;
  subject: string;
  status: string;
  department: string;
  created_at: string;
};
export default function Platform() {
  const [session, setSession] = useState<Session | null>(null),
    [profile, setProfile] = useState<Profile | null>(null),
    [loading, setLoading] = useState(true),
    [recovery, setRecovery] = useState(false),
    [tab, setTab] = useState('assessment'),
    [revision, setRevision] = useState(0),
    [error, setError] = useState(''),
    [records, setRecords] = useState<Stored[]>([]),
    [kpis, setKpis] = useState<Measurement[]>([]),
    [tickets, setTickets] = useState<Ticket[]>([]);
  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, s) => {
      setSession(s);
      if (event === 'PASSWORD_RECOVERY') setRecovery(true);
      setLoading(false);
    });
    void supabase.auth.getSession().then(({ data, error }) => {
      if (error) setError(error.message);
      setSession(data.session);
      setLoading(false);
    });
    return () => subscription.unsubscribe();
  }, []);
  useEffect(() => {
    if (!session || !supabase) {
      setProfile(null);
      setRecords([]);
      setKpis([]);
      setTickets([]);
      return;
    }
    let active = true;
    void (async () => {
      try {
        const p = await query(
          supabase
            .from('pm_profiles')
            .select('*')
            .eq('id', session.user.id)
            .single(),
        );
        if (!active) return;
        setProfile(p);
        if (p.status === 'locked') return;
        const [r, k, t] = await Promise.all([
          query(
            supabase
              .from('pm_records')
              .select('id,kind,input,result,created_at')
              .eq('user_id', session.user.id)
              .order('created_at', { ascending: false })
              .limit(50),
          ),
          query(
            supabase
              .from('pm_kpis')
              .select('code,value,target,period,source')
              .eq('user_id', session.user.id)
              .order('period', { ascending: false })
              .limit(200),
          ),
          query(
            supabase
              .from('pm_tickets')
              .select('id,subject,status,department,created_at')
              .eq('user_id', session.user.id)
              .order('created_at', { ascending: false })
              .limit(50),
          ),
        ]);
        if (active) {
          setRecords(r || []);
          setKpis(
            (k || []).map((row) => ({
              ...row,
              value: Number(row.value),
              target: Number(row.target),
            })),
          );
          setTickets(t || []);
          setError('');
        }
      } catch (e) {
        if (active) setError((e as Error).message);
      }
    })();
    return () => {
      active = false;
    };
  }, [session?.user.id, revision]);
  const refresh = () => setRevision((n) => n + 1);
  async function logout() {
    const r = await supabase!.auth.signOut();
    if (r.error) setError(r.error.message);
    else {
      setSession(null);
      setProfile(null);
      setTab('assessment');
    }
  }
  return (
    <div className="min-h-screen bg-[#f5f8fc] text-slate-800">
      <header className="border-b bg-white px-5 py-4">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3">
          <a className="text-xl font-extrabold text-[#1769aa]" href="/platform">
            POLYMATCH{' '}
            <span className="text-xs font-medium text-slate-500">
              Cổng làm việc
            </span>
          </a>
          {session && (
            <button
              className="text-sm text-blue-700 underline"
              onClick={logout}
            >
              Đăng xuất
            </button>
          )}
        </div>
      </header>
      <main className="mx-auto max-w-6xl space-y-5 px-4 py-8">
        {!supabase ? (
          <section className={card}>
            <h1 className="text-2xl font-bold">Kết nối nền tảng</h1>
            <p className="mt-3">
              Cổng làm việc cần kết nối dịch vụ xác thực và dữ liệu. Vui lòng
              liên hệ quản trị viên để hoàn tất cấu hình.
            </p>
          </section>
        ) : loading ? (
          <p role="status">Đang kiểm tra phiên…</p>
        ) : !session || recovery ? (
          <Auth recovery={recovery} onDone={() => setRecovery(false)} />
        ) : (
          <>
            <Notice error={error} />
            {!profile || profile.id !== session.user.id ? (
              <section className={card}>
                <p>Đang tải hồ sơ…</p>
                <button className={button + ' mt-3'} onClick={refresh}>
                  Tải lại
                </button>
              </section>
            ) : profile.status === 'locked' ? (
              <p role="alert" className={card}>
                Tài khoản đã bị khóa. Liên hệ quản trị viên.
              </p>
            ) : (
              <>
                <section>
                  <h1 className="text-2xl font-bold">
                    Xin chào, {profile.full_name || session.user.email}
                  </h1>
                  <p className="text-sm text-slate-500">
                    {profile.company} · {profile.role}
                    {profile.status === 'pending'
                      ? ' · Nhà cung cấp chờ duyệt'
                      : ''}
                  </p>
                </section>
                <nav
                  aria-label="Cổng làm việc"
                  className="flex flex-wrap gap-2"
                >
                  {[
                    ['assessment', 'Diagnostic & Matching'],
                    ['support', 'Chatbot CSKH'],
                    ['planning', 'Roadmap & ROI'],
                    ['kpi', 'KPI & cảnh báo'],
                    ['history', 'Lịch sử & yêu cầu'],
                    ...(profile.role === 'ADMIN'
                      ? [['admin', 'Quản trị']]
                      : []),
                  ].map(([key, label]) => (
                    <button
                      key={key}
                      aria-current={tab === key ? 'page' : undefined}
                      className={
                        tab === key
                          ? button
                          : 'rounded-lg border bg-white px-4 py-2 text-sm'
                      }
                      onClick={() => setTab(key)}
                    >
                      {label}
                    </button>
                  ))}
                </nav>
                {['assessment', 'planning', 'kpi'].includes(tab) &&
                profile.role !== 'BUYER' ? (
                  <p className={card}>
                    Chức năng dành cho doanh nghiệp. Bạn có thể sử dụng hỗ trợ
                    và theo dõi yêu cầu.
                  </p>
                ) : tab === 'assessment' ? (
                  <Diagnostic onSaved={refresh} />
                ) : tab === 'planning' ? (
                  <Planning records={records} onSaved={refresh} />
                ) : tab === 'kpi' ? (
                  <Kpi rows={kpis} onSaved={refresh} />
                ) : null}
                {tab === 'support' && <Support onSaved={refresh} />}{' '}
                {tab === 'history' && (
                  <section className="space-y-4">
                    <h2 className="text-2xl font-bold">Lịch sử & yêu cầu</h2>
                    <div className={card}>
                      <h3 className="font-bold">50 báo cáo gần nhất</h3>
                      {!records.length && <p>Chưa có báo cáo.</p>}
                      {records.map((r) => (
                        <details className="mt-4" key={r.id}>
                          <summary className="cursor-pointer text-sm">
                            {r.kind === 'assessment'
                              ? 'Đánh giá'
                              : r.kind === 'roi'
                                ? 'ROI'
                                : 'Lộ trình'}{' '}
                            · {new Date(r.created_at).toLocaleString('vi-VN')} ·{' '}
                            {r.id}
                          </summary>
                          <RecordView record={r} />
                        </details>
                      ))}
                    </div>
                    <div className={card}>
                      <h3 className="font-bold">50 yêu cầu hỗ trợ gần nhất</h3>
                      {!tickets.length && <p>Chưa có yêu cầu.</p>}
                      {tickets.map((t) => (
                        <p className="mt-3 text-sm" key={t.id}>
                          {t.id} · {t.department} · {t.status} · {t.subject}
                        </p>
                      ))}
                    </div>
                  </section>
                )}
                {tab === 'admin' && profile.role === 'ADMIN' && (
                  <Admin userId={profile.id} />
                )}
              </>
            )}
          </>
        )}
      </main>
      <footer className="mx-auto max-w-6xl px-4 py-6 text-xs text-slate-500">
        Dữ liệu tự khai cần được đối soát. Mô phỏng và đề xuất không phải cam
        kết hiệu quả đầu tư.
      </footer>
    </div>
  );
}
