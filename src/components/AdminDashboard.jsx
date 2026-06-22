import { useState, useEffect } from 'react';
import { getAdminStats } from '../firebase.js';
import { isAdmin } from '../firebase.js';

function StatCard({ icon, label, value, color = 'text-primary' }) {
  return (
    <div className="bg-surface-container-low rounded-xl border border-outline-variant p-lg flex flex-col gap-sm">
      <span className={`material-symbols-outlined ${color} text-3xl`} style={{ fontVariationSettings: "'FILL' 1" }}>{icon}</span>
      <div className={`font-headline-xl text-headline-xl ${color}`} style={{ fontSize: 36, lineHeight: 1 }}>{value ?? '—'}</div>
      <p className="font-label-md text-label-md text-on-surface-variant uppercase tracking-widest">{label}</p>
    </div>
  );
}

function formatDate(ts) {
  if (!ts) return '—';
  const d = ts.toDate ? ts.toDate() : new Date(ts);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function scoreColor(score) {
  if (!score) return 'text-on-surface-variant';
  if (score >= 75) return 'text-green-400';
  if (score >= 50) return 'text-yellow-400';
  return 'text-red-400';
}

export default function AdminDashboard({ user, onBack }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAdmin(user)) return;
    getAdminStats().then(d => { setData(d); setLoading(false); }).catch(() => setLoading(false));
  }, [user]);

  if (!isAdmin(user)) {
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-md">
        <span className="material-symbols-outlined text-error text-5xl">lock</span>
        <h2 className="font-headline-lg text-headline-lg text-on-surface">Access Denied</h2>
        <button onClick={onBack} className="font-label-md text-label-md text-primary hover:opacity-80 flex items-center gap-xs">
          <span className="material-symbols-outlined" style={{ fontSize: 16 }}>arrow_back</span> Back
        </button>
      </div>
    );
  }

  // Today's resumes
  const today = new Date().toDateString();
  const todayCount = data?.recentResumes?.filter(r => {
    const d = r.createdAt?.toDate ? r.createdAt.toDate() : new Date(r.createdAt || 0);
    return d.toDateString() === today;
  }).length ?? 0;

  // Bar chart — last 7 days
  const last7 = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const label = d.toLocaleDateString('en-US', { weekday: 'short' });
    const count = data?.recentResumes?.filter(r => {
      const rd = r.createdAt?.toDate ? r.createdAt.toDate() : new Date(r.createdAt || 0);
      return rd.toDateString() === d.toDateString();
    }).length ?? 0;
    last7.push({ label, count });
  }
  const maxCount = Math.max(...last7.map(d => d.count), 1);

  return (
    <main className="py-xl px-margin-mobile md:px-margin-desktop max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-xl">
        <div>
          <div className="flex items-center gap-sm mb-xs">
            <h1 className="font-headline-xl text-headline-xl text-on-surface" style={{ fontSize: 32 }}>Admin Dashboard</h1>
            <span className="bg-primary-container text-on-primary-container font-label-sm text-label-sm px-sm py-base rounded-full">ADMIN</span>
          </div>
          <p className="font-body-sm text-body-sm text-on-surface-variant">Signed in as {user.email}</p>
        </div>
        <button onClick={onBack} className="flex items-center gap-xs font-label-md text-label-md text-on-surface-variant border border-outline-variant px-md py-xs rounded hover:bg-surface-container-high transition-colors">
          <span className="material-symbols-outlined" style={{ fontSize: 16 }}>arrow_back</span>
          Back
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <span className="material-symbols-outlined text-primary animate-spin text-4xl">sync</span>
        </div>
      ) : (
        <div className="space-y-xl">
          {/* Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-md">
            <StatCard icon="description" label="Total Resumes Built" value={data?.stats?.totalResumes ?? 0} color="text-primary" />
            <StatCard icon="group" label="Total Users" value={data?.stats?.totalUsers ?? 0} color="text-green-400" />
            <StatCard icon="today" label="Resumes Today" value={todayCount} color="text-purple-400" />
          </div>

          {/* Bar Chart */}
          <div className="bg-surface-container border border-outline-variant rounded-xl p-lg">
            <h3 className="font-label-md text-label-md text-on-surface-variant uppercase tracking-widest mb-lg">Resumes Built — Last 7 Days</h3>
            <div className="flex items-end gap-md h-32">
              {last7.map((d, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-xs">
                  <span className="font-label-sm text-label-sm text-on-surface-variant">{d.count || ''}</span>
                  <div
                    className="w-full rounded-t bg-primary/40 border-t-2 border-primary transition-all hover:bg-primary/60"
                    style={{ height: `${(d.count / maxCount) * 100}%`, minHeight: d.count ? 8 : 2 }}
                  ></div>
                  <span className="font-label-sm text-label-sm text-on-surface-variant">{d.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Resumes */}
          <div className="bg-surface-container border border-outline-variant rounded-xl overflow-hidden">
            <div className="p-md border-b border-outline-variant">
              <h3 className="font-label-md text-label-md text-on-surface-variant uppercase tracking-widest">Recent Resumes</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-outline-variant">
                    {['User','Company','Role','ATS Score','Flow','Date'].map(h => (
                      <th key={h} className="text-left px-md py-sm font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {(data?.recentResumes || []).slice(0, 20).map((r, i) => (
                    <tr key={i} className="border-b border-outline-variant/30 hover:bg-surface-container-high transition-colors">
                      <td className="px-md py-sm font-body-sm text-body-sm text-on-surface">{r.userName || r.userEmail}</td>
                      <td className="px-md py-sm font-body-sm text-body-sm text-on-surface">{r.targetCompany || '—'}</td>
                      <td className="px-md py-sm font-body-sm text-body-sm text-on-surface-variant">{r.targetRole || '—'}</td>
                      <td className="px-md py-sm">
                        <span className={`font-label-md text-label-md font-mono ${scoreColor(r.atsScore)}`}>{r.atsScore ?? '—'}</span>
                      </td>
                      <td className="px-md py-sm">
                        <span className="font-label-sm text-label-sm bg-secondary-container/30 text-secondary px-xs py-0.5 rounded">{r.flow || '—'}</span>
                      </td>
                      <td className="px-md py-sm font-label-sm text-label-sm text-on-surface-variant">{formatDate(r.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {!data?.recentResumes?.length && (
                <div className="text-center py-xl text-on-surface-variant font-body-sm text-body-sm">No resumes yet</div>
              )}
            </div>
          </div>

          {/* All Users */}
          <div className="bg-surface-container border border-outline-variant rounded-xl overflow-hidden">
            <div className="p-md border-b border-outline-variant flex items-center justify-between">
              <h3 className="font-label-md text-label-md text-on-surface-variant uppercase tracking-widest">All Users</h3>
              <span className="font-label-sm text-label-sm text-primary">{data?.topUsers?.length ?? 0} total</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-outline-variant">
                    {['#','Email','Resumes Generated','Sign-ins','First Seen','Last Active'].map(h => (
                      <th key={h} className="text-left px-md py-sm font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {(data?.topUsers || []).map((u, i) => (
                    <tr key={i} className="border-b border-outline-variant/30 hover:bg-surface-container-high transition-colors">
                      <td className="px-md py-sm font-label-sm text-label-sm text-on-surface-variant">{i + 1}</td>
                      <td className="px-md py-sm font-body-sm text-body-sm text-on-surface max-w-[200px] truncate">{u.email}</td>
                      <td className="px-md py-sm">
                        <span className={`font-label-md text-label-md font-mono ${u.resumeCount > 0 ? 'text-primary' : 'text-on-surface-variant'}`}>
                          {u.resumeCount ?? 0}
                        </span>
                      </td>
                      <td className="px-md py-sm font-label-sm text-label-sm text-on-surface-variant font-mono">{u.signInCount ?? 1}</td>
                      <td className="px-md py-sm font-label-sm text-label-sm text-on-surface-variant">{formatDate(u.firstSeen)}</td>
                      <td className="px-md py-sm font-label-sm text-label-sm text-on-surface-variant">{formatDate(u.lastActiveAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {!data?.topUsers?.length && (
                <div className="text-center py-xl text-on-surface-variant font-body-sm text-body-sm">No users yet — share your app to get started!</div>
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
