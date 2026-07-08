import React, { useState, useEffect } from 'react';
import { FileText, CheckCircle, Clock, Plus, ArrowUpRight, ArrowDownRight } from 'lucide-react';

export default function Overview({ userName, onNewQuote, onSelectProject }) {
  const [stats, setStats] = useState({
    totalQuotes: 0,
    acceptedQuotes: 0,
    pendingAmount: 0
  });
  const [recentProjects, setRecentProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
  
    Promise.all([
      fetch('http://127.0.0.1:8000/api/dashboard-stats', {
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      }).then(async res => {
        if (!res.ok) {
          const text = await res.text();
          throw new Error(`Stats endpoint failed with status ${res.status}. Server says: ${text.substring(0, 50)}`);
        }
        return res.json();
      }),
      fetch('http://127.0.0.1:8000/api/quotes/recent', {
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      }).then(async res => {
        if (!res.ok) {
          const text = await res.text();
          throw new Error(`Recent Quotes endpoint failed with status ${res.status}.`);
        }
        return res.json();
      })
    ])
      .then(([statsData, projectsData]) => {
        if (statsData) setStats(statsData);
        setRecentProjects(Array.isArray(projectsData) ? projectsData : projectsData?.quotes || []);
        setError(null);
      })
      .catch((err) => {
        console.error('Detailed Error Context:', err);
        setError(err.message); // This will print the status code right into the red box
      })
      .finally(() => setLoading(false));
  }, []);
  if (loading) {
    return <div className="text-center py-12 font-bold text-slate-400">Loading dashboard data...</div>;
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-100 bg-red-50 p-6 text-center text-red-700">
        <p className="font-bold">Backend Connection Failed</p>
        <p className="text-xs mt-1 text-red-500">Make sure your Laravel server is running on port 8000</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-sky-700 via-sky-600 to-sky-50 p-8 text-white shadow-lg shadow-sky-700/10 relative overflow-hidden">
        <div className="relative z-10 max-w-md">
          <span className="text-xs font-black uppercase tracking-widest text-sky-100 bg-sky-800/30 px-3 py-1 rounded-full">System Active</span>
          <h2 className="text-3xl font-black tracking-tight mt-3 mb-2">Welcome back, {userName || 'Admin'}</h2>
          <p className="text-sky-100 text-sm font-medium">Your native terminal MySQL connection is successfully bound.</p>
        </div>
      </div>

      {/* Analytics Card Grid */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-2xl border border-sky-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-black uppercase tracking-wider text-slate-400">Total Quotes</span>
            <div className="rounded-xl bg-sky-50 p-2.5 text-sky-700"><FileText size={20} /></div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-800">{stats?.totalQuotes || 0}</span>
            <span className="text-xs font-bold text-emerald-500 flex items-center gap-0.5"><ArrowUpRight size={14}/> 20%</span>
          </div>
          <p className="text-xs text-slate-400 mt-1 font-medium">Quotes currently inside database</p>
        </div>

        <div className="rounded-2xl border border-sky-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-black uppercase tracking-wider text-slate-400">Accepted Specs</span>
            <div className="rounded-xl bg-emerald-50 p-2.5 text-emerald-600"><CheckCircle size={20} /></div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-800">{stats?.acceptedQuotes || 0}</span>
            <span className="text-xs font-bold text-rose-500 flex items-center gap-0.5"><ArrowDownRight size={14}/> 33%</span>
          </div>
          <p className="text-xs text-slate-400 mt-1 font-medium">Approved production records</p>
        </div>

        <div className="rounded-2xl border border-sky-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-black uppercase tracking-wider text-slate-400">Pipeline Value</span>
            <div className="rounded-xl bg-amber-50 p-2.5 text-amber-600"><Clock size={20} /></div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-800">
              ${stats?.pendingAmount ? Number(stats.pendingAmount).toLocaleString() : '0'}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1 font-medium">Cumulative gross quote value</p>
        </div>
      </div>

      {/* Table Data Listing */}
      <div className="rounded-2xl border border-sky-100 bg-white p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h3 className="text-lg font-black text-sky-950">Recent Project Streams</h3>
            <p className="text-xs text-slate-400 font-medium">Live query outputs from local tables</p>
          </div>
          <button
            onClick={onNewQuote}
            className="flex items-center justify-center gap-2 rounded-xl bg-sky-700 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-sky-700/10 hover:bg-sky-800 transition cursor-pointer self-start"
          >
            <Plus size={16} />
            Generate Statement
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-sky-50 text-xs font-black uppercase tracking-wider text-slate-400">
                <th className="pb-3">Project Specs</th>
                <th className="pb-3">Client Handle</th>
                <th className="pb-3">Amount</th>
                <th className="pb-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sky-50 text-sm font-medium text-slate-700">
              {Array.isArray(recentProjects) && recentProjects.map((project) => (
                <tr 
                  key={project.id} 
                  onClick={() => onSelectProject && onSelectProject(project)}
                  className="hover:bg-slate-50/50 cursor-pointer transition-colors group"
                >
                  <td className="py-3.5 pr-3 font-bold text-sky-950 group-hover:text-sky-700">{project.title}</td>
                  <td className="py-3.5 text-slate-500">{project.client?.name || 'No Client Model'}</td>
                  <td className="py-3.5">${project.estimated_amount ? Number(project.estimated_amount).toLocaleString() : '0'}</td>
                  <td className="py-3.5">
                    <span className={`inline-flex rounded-lg px-2 py-1 text-xs font-bold ${
                      project.status === 'accepted' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                    }`}>
                      {project.status || 'pending'}
                    </span>
                  </td>
                </tr>
              ))}
              {(!recentProjects || recentProjects.length === 0) && (
                <tr>
                  <td colSpan="4" className="text-center py-6 text-sm font-medium text-slate-400">No recent records detected in database.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}