import React, { useState, useEffect, useMemo, useRef } from 'react';
import Login from './components/Login';
import QuoteForm from './components/QuoteForm';
import api from './services/api';
import {
  LayoutGrid, FilePlus2, BarChart3, LogOut, CloudDrizzle,
  ChevronLeft, ChevronRight, Menu, ArrowLeft, Layers, Cpu, Palette,
  Bell, Search, Settings, Users, Download, TrendingUp, TrendingDown,
  ChevronDown, User, X, Check, Mail, Phone, Moon, Sun, Sparkles
} from 'lucide-react';
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip
} from 'recharts';

const REPORT_DATA = {
  Daily: [
    { label: 'Mon', quotes: 3, accepted: 1 }, { label: 'Tue', quotes: 5, accepted: 2 },
    { label: 'Wed', quotes: 2, accepted: 2 }, { label: 'Thu', quotes: 6, accepted: 3 },
    { label: 'Fri', quotes: 4, accepted: 1 }, { label: 'Sat', quotes: 1, accepted: 1 },
    { label: 'Sun', quotes: 2, accepted: 0 },
  ],
  Weekly: [
    { label: 'W1', quotes: 18, accepted: 7 }, { label: 'W2', quotes: 24, accepted: 11 },
    { label: 'W3', quotes: 15, accepted: 6 }, { label: 'W4', quotes: 29, accepted: 14 },
  ],
  Monthly: [
    { label: 'Jan', quotes: 62, accepted: 24 }, { label: 'Feb', quotes: 58, accepted: 22 },
    { label: 'Mar', quotes: 74, accepted: 31 }, { label: 'Apr', quotes: 81, accepted: 40 },
    { label: 'May', quotes: 69, accepted: 27 }, { label: 'Jun', quotes: 90, accepted: 45 },
  ],
  Yearly: [
    { label: '2022', quotes: 410, accepted: 160 }, { label: '2023', quotes: 520, accepted: 210 },
    { label: '2024', quotes: 640, accepted: 290 }, { label: '2025', quotes: 705, accepted: 335 },
    { label: '2026', quotes: 388, accepted: 190 },
  ],
};

const PERIODS = ['Daily', 'Weekly', 'Monthly', 'Yearly'];

const NAV_ITEMS = [
  { key: 'overview', label: 'Overview', icon: LayoutGrid },
  { key: 'quote', label: 'Create Quote', icon: FilePlus2 },
  { key: 'clients', label: 'Clients', icon: Users },
  { key: 'reports', label: 'Reports', icon: BarChart3 },
  { key: 'settings', label: 'Settings', icon: Settings },
];

// Mock data tracking full individual details for the historical project page
const PREVIOUS_PROJECTS = [
  {
    id: 1,
    title: 'Amharic Learning Platform Layout',
    type: 'UI/UX Design Stack',
    icon: Palette,
    accent: 'from-sky-400 via-sky-600 to-sky-800',
    details: 'Developed a comprehensive custom dark-mode interface for interactive language synthesis. Embedded clean high-fidelity interactive component sets, reactive typography arrays, and fluid framer transitions designed for multi-device scalability.'
  },
  {
    id: 2,
    title: 'Land Registry Blockchain System',
    type: 'Smart Contract Architecture',
    icon: Cpu,
    accent: 'from-sky-400 via-sky-600 to-sky-800',
    details: 'Architected structural land asset registration profiles mapping distributed ledger transparency parameters. Built explicit multi-signature approval checkpoints alongside secure immutable node-level contract validation frameworks.'
  },
  {
    id: 3,
    title: 'E-Commerce Branding Suite Assets',
    type: 'Creative Vector Framework',
    icon: Layers,
    accent: 'from-sky-400 via-sky-600 to-sky-800',
    details: 'Engineered high-end aesthetic logo iterations, custom vector asset bundles, and promotional web media configurations targeting professional presentation tiers across regional production platforms.'
  }
];

const MOCK_CLIENTS = [
  { id: 1, name: 'Selam Bekele', company: 'Abyssinia Retail Group', email: 'selam.bekele@abyssinia-retail.com', phone: '+251 91 234 5678', status: 'Active', quotes: 4 },
  { id: 2, name: 'Dawit Alemu', company: 'Nile Freight Logistics', email: 'dawit.alemu@nilefreight.com', phone: '+251 92 345 6789', status: 'Active', quotes: 2 },
  { id: 3, name: 'Marta Tesfaye', company: 'Highland Coffee Exports', email: 'marta.tesfaye@highlandcoffee.com', phone: '+251 93 456 7890', status: 'Pending', quotes: 1 },
  { id: 4, name: 'Yonatan Girma', company: 'Addis Build Materials', email: 'yonatan.girma@addisbuild.com', phone: '+251 94 567 8901', status: 'Active', quotes: 6 },
  { id: 5, name: 'Ruth Haile', company: 'Blue Nile Textiles', email: 'ruth.haile@bluenile-textiles.com', phone: '+251 95 678 9012', status: 'Inactive', quotes: 3 },
];

const MOCK_NOTIFICATIONS = [
  { id: 1, title: 'New quote request', body: 'Ruth Haile submitted a request for Blue Nile Textiles.', time: '12m ago', unread: true },
  { id: 2, title: 'Quote accepted', body: 'Yonatan Girma approved specs for Addis Build Materials.', time: '1h ago', unread: true },
  { id: 3, title: 'Reminder', body: 'Follow up with Highland Coffee Exports — pending 3 days.', time: '4h ago', unread: true },
  { id: 4, title: 'System update', body: 'Monthly reports have finished generating.', time: 'Yesterday', unread: false },
];

function pctChange(curr, prev) {
  if (!prev) return null;
  return Math.round(((curr - prev) / prev) * 100);
}

function toCSV(rows) {
  const header = Object.keys(rows[0]).join(',');
  const body = rows.map((r) => Object.values(r).join(',')).join('\n');
  return `${header}\n${body}`;
}

function downloadCSV(filename, rows) {
  const csv = toCSV(rows);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function WeatherHero({ name }) {
  const drops = Array.from({ length: 30 }, (_, i) => ({
    left: (i * 3.3) % 100,
    delay: (i * 0.21) % 3,
    duration: 1.4 + ((i * 0.11) % 1.2),
  }));

  return (
    <div className="relative min-h-[260px] overflow-hidden rounded-3xl border border-sky-100 bg-gradient-to-b from-sky-100/70 via-sky-50/40 to-white px-8 py-14 flex flex-col items-center justify-center text-center">
      <div className="absolute inset-0 pointer-events-none">
        {drops.map((d, i) => (
          <span
            key={i}
            className="animate-fall absolute top-0 h-4 w-0.5 rounded-full bg-gradient-to-b from-transparent to-sky-400/70"
            style={{ left: `${d.left}%`, animationDelay: `${d.delay}s`, animationDuration: `${d.duration}s` }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-2xl transform transition duration-500">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white px-4 py-1.5 text-xs font-black uppercase tracking-widest text-sky-700 shadow-sm border border-sky-100/80">
          <CloudDrizzle size={15} className="animate-pulse text-sky-500" />
          Studio Weather Station
        </div>
        <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-sky-950 lg:text-6xl drop-shadow-sm bg-gradient-to-b from-sky-950 to-slate-800 bg-clip-text text-transparent">
          Welcome back, {name}
        </h1>
        <p className="mt-4 text-base sm:text-lg text-slate-600 font-medium max-w-xl mx-auto leading-relaxed">
          It's a steady drizzle of new requests today — here is what has landed on your administration desk.
        </p>
      </div>
    </div>
  );
}

// Full page view rendering isolated details cleanly upon selection
function ProjectDetailView({ project, onBack }) {
  const IconComp = project.icon;
  return (
    <div className="bg-white rounded-3xl border border-sky-100 p-8 lg:p-12 shadow-sm animate-fade-in max-w-4xl mx-auto space-y-8">
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 text-sm font-black text-slate-400 hover:text-sky-700 transition bg-slate-50 hover:bg-sky-50 px-4 py-2 rounded-xl group"
      >
        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
        Return to Overview
      </button>

      <div className="flex flex-col md:flex-row gap-8 items-start md:items-center border-b border-slate-100 pb-8">
        <div className={`h-24 w-24 shrink-0 rounded-full bg-gradient-to-tr ${project.accent} flex items-center justify-center text-white shadow-lg`}>
          <IconComp size={40} />
        </div>
        <div>
          <span className="text-xs font-black tracking-widest text-sky-600 uppercase bg-sky-50 px-3 py-1 rounded-md">{project.type}</span>
          <h2 className="text-3xl md:text-4xl font-black text-sky-950 tracking-tight mt-2">{project.title}</h2>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-black text-slate-800">Operational Summary & Specifications</h3>
        <p className="text-slate-600 leading-relaxed text-base font-medium bg-slate-50/50 p-6 rounded-2xl border border-slate-100">
          {project.details}
        </p>
      </div>
    </div>
  );
}

function Overview({ userName, quoteCount, acceptedCount, prevQuoteCount, prevAcceptedCount, onNewQuote, onSelectProject }) {
  const quoteTrend = pctChange(quoteCount, prevQuoteCount);
  const acceptedTrend = pctChange(acceptedCount, prevAcceptedCount);

  return (
    <div className="space-y-12 animate-fade-in duration-500 transition-all">
      <WeatherHero name={userName} />

      {/* Metrics Section */}
      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Pending forms" value={quoteCount} sub="awaiting review" trend={quoteTrend} />
        <StatCard label="Accepted specs" value={acceptedCount} sub="moved to production" trend={acceptedTrend} />
        <StatCard label="Avg. response time" value="4h" sub="first reply to client" />
        <button
          onClick={onNewQuote}
          className="flex cursor-pointer flex-col items-center justify-center text-center gap-3 rounded-2xl border border-dashed border-sky-300 bg-gradient-to-br from-sky-50/60 to-white p-8 text-sky-700 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:border-sky-500 hover:bg-sky-50"
        >
          <div className="p-3 bg-sky-100/80 rounded-full text-sky-700">
            <FilePlus2 size={28} />
          </div>
          <span className="text-lg font-black tracking-tight">Start a new quote</span>
        </button>
      </div>

      {/* Circle Circle 3 Projects Container */}
      <div className="space-y-6">
        <div className="text-center">
          <h3 className="text-2xl font-black text-sky-950 tracking-tight sm:text-3xl">
            What We Worked Previously
          </h3>
          <p className="text-sm text-slate-400 font-bold mt-1">Select an active node portfolio element to drill down into logs.</p>
        </div>

        {/* Symmetric 3-Circle Circle Layout */}
        <div className="grid gap-8 md:grid-cols-3 max-w-5xl mx-auto pt-4">
          {PREVIOUS_PROJECTS.map((project) => {
            const ProjIcon = project.icon;
            return (
              <button
                key={project.id}
                onClick={() => onSelectProject(project)}
                className={`relative group overflow-hidden aspect-square rounded-full bg-gradient-to-br ${project.accent} p-8 flex flex-col items-center justify-center text-center shadow-xl transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:scale-102`}
              >
                {/* Premium Frosted White Hover Glare Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/25 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out pointer-events-none" />
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                {/* Pure text/icon displaying inside the container */}
                <div className="relative z-10 text-white flex flex-col items-center gap-4 px-4">
                  <div className="p-3 bg-white/15 backdrop-blur-md rounded-full group-hover:scale-110 transition-transform duration-300">
                    <ProjIcon size={28} />
                  </div>
                  <h4 className="text-base md:text-lg font-black leading-snug drop-shadow-md">
                    {project.title}
                  </h4>
                  <span className="text-[10px] font-black uppercase tracking-widest bg-white/20 px-2.5 py-0.5 rounded-full backdrop-blur-sm">
                    Review Case
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, sub, trend }) {
  const hasTrend = typeof trend === 'number';
  const isUp = hasTrend && trend >= 0;
  return (
    <div className="rounded-2xl border border-sky-100 bg-white p-8 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl text-center flex flex-col items-center justify-center group border-b-4 hover:border-b-sky-500 relative">
      {hasTrend && (
        <span className={`absolute top-4 right-4 inline-flex items-center gap-1 text-[11px] font-black px-2 py-1 rounded-full ${isUp ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
          {isUp ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
          {Math.abs(trend)}%
        </span>
      )}
      <span className="text-xs font-black text-slate-400 uppercase tracking-widest">{label}</span>
      <span className="mt-2 block text-5xl font-black tracking-tighter text-sky-950 font-sans group-hover:scale-105 transition-transform duration-300">{value}</span>
      <span className="text-xs font-bold text-slate-400 mt-2 bg-slate-50 px-2.5 py-1 rounded-md">{sub}</span>
    </div>
  );
}

function Reports() {
  const [period, setPeriod] = useState('Monthly');
  const data = REPORT_DATA[period];
  const totalQuotes = data.reduce((s, d) => s + d.quotes, 0);
  const totalAccepted = data.reduce((s, d) => s + d.accepted, 0);
  const rate = totalQuotes ? Math.round((totalAccepted / totalQuotes) * 100) : 0;

  const handleExport = () => {
    downloadCSV(`report-${period.toLowerCase()}.csv`, data);
  };

  return (
    <div className="text-center sm:text-left space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="w-full sm:w-auto">
          <h2 className="text-3xl font-black tracking-tight text-sky-950">Reports</h2>
          <p className="text-base text-slate-500 font-medium">Quote volume and acceptance metrics analysis.</p>
        </div>
        <div className="flex items-center gap-3 mx-auto sm:mx-0">
          <div className="flex rounded-xl border border-sky-100 bg-white p-1 shadow-sm">
            {PERIODS.map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`rounded-lg px-4 py-2.5 text-sm font-bold transition ${p === period ? 'bg-sky-700 text-white shadow-sm' : 'text-slate-400 hover:text-sky-700'}`}
              >
                {p}
              </button>
            ))}
          </div>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 rounded-xl border border-sky-100 bg-white px-4 py-2.5 text-sm font-black text-sky-700 shadow-sm transition hover:bg-sky-50 hover:-translate-y-0.5"
          >
            <Download size={16} />
            Export CSV
          </button>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-3">
        <StatCard label={`Total quotes (${period.toLowerCase()})`} value={totalQuotes} sub="Aggregated requests" />
        <StatCard label="Accepted" value={totalAccepted} sub="Approved transactions" />
        <StatCard label="Acceptance rate" value={`${rate}%`} sub="Performance score" />
      </div>

      <div className="rounded-2xl border border-sky-100 bg-white p-6 pt-8 shadow-sm">
        <ResponsiveContainer width="100%" height={320}>
          <AreaChart data={data} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
            <defs>
              <linearGradient id="quotesFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#38bdf8" stopOpacity={0.35} />
                <stop offset="100%" stopColor="#38bdf8" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="acceptedFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#0369a1" stopOpacity={0.5} />
                <stop offset="100%" stopColor="#0369a1" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="#e6f2fb" vertical={false} />
            <XAxis dataKey="label" stroke="#7c93ab" tickLine={false} axisLine={false} fontSize={13} fontWeight="bold" />
            <YAxis stroke="#7c93ab" tickLine={false} axisLine={false} fontSize={13} fontWeight="bold" />
            <Tooltip contentStyle={{ borderRadius: 16, border: '1px solid #dbeafe', fontSize: 14, boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05)' }} />
            <Area type="monotone" dataKey="quotes" stroke="#38bdf8" strokeWidth={3} fill="url(#quotesFill)" name="Quotes" />
            <Area type="monotone" dataKey="accepted" stroke="#0369a1" strokeWidth={3} fill="url(#acceptedFill)" name="Accepted" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

const STATUS_STYLES = {
  Active: 'bg-emerald-50 text-emerald-600',
  Pending: 'bg-amber-50 text-amber-600',
  Inactive: 'bg-slate-100 text-slate-400',
};

function Clients({ searchTerm }) {
  const [localSearch, setLocalSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const filtered = useMemo(() => {
    const q = (searchTerm || localSearch).trim().toLowerCase();
    return MOCK_CLIENTS.filter((c) => {
      const matchesQuery = !q || c.name.toLowerCase().includes(q) || c.company.toLowerCase().includes(q);
      const matchesStatus = statusFilter === 'All' || c.status === statusFilter;
      return matchesQuery && matchesStatus;
    });
  }, [searchTerm, localSearch, statusFilter]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black tracking-tight text-sky-950">Clients</h2>
          <p className="text-base text-slate-500 font-medium">Everyone who has requested a quote from the desk.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" />
            <input
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              placeholder="Search clients..."
              className="rounded-xl border border-sky-100 bg-white py-2.5 pl-9 pr-4 text-sm font-medium text-slate-700 shadow-sm outline-none focus:border-sky-400 w-52"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-xl border border-sky-100 bg-white py-2.5 px-3 text-sm font-bold text-slate-600 shadow-sm outline-none focus:border-sky-400"
          >
            {['All', 'Active', 'Pending', 'Inactive'].map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="rounded-2xl border border-sky-100 bg-white shadow-sm overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-sky-50 bg-sky-50/40 text-slate-400 uppercase text-[11px] tracking-widest font-black">
              <th className="px-6 py-4">Client</th>
              <th className="px-6 py-4 hidden md:table-cell">Contact</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Quotes</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((c) => (
              <tr key={c.id} className="border-b border-slate-50 last:border-0 hover:bg-sky-50/30 transition">
                <td className="px-6 py-4">
                  <p className="font-black text-slate-800">{c.name}</p>
                  <p className="text-xs text-slate-400 font-bold">{c.company}</p>
                </td>
                <td className="px-6 py-4 hidden md:table-cell text-slate-500">
                  <div className="flex items-center gap-1.5 text-xs font-bold"><Mail size={12} /> {c.email}</div>
                  <div className="flex items-center gap-1.5 text-xs font-bold mt-1"><Phone size={12} /> {c.phone}</div>
                </td>
                <td className="px-6 py-4">
                  <span className={`text-[11px] font-black px-2.5 py-1 rounded-full ${STATUS_STYLES[c.status]}`}>{c.status}</span>
                </td>
                <td className="px-6 py-4 text-right font-black text-sky-950">{c.quotes}</td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-slate-400 font-bold">
                  No clients match that search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function SettingsView({ userName, setUserName, notifPrefs, setNotifPrefs, showToast }) {
  const [nameDraft, setNameDraft] = useState(userName);

  const handleSave = (e) => {
    e.preventDefault();
    setUserName(nameDraft);
    const stored = localStorage.getItem('user');
    const parsed = stored ? JSON.parse(stored) : {};
    localStorage.setItem('user', JSON.stringify({ ...parsed, name: nameDraft }));
    showToast('Profile updated.');
  };

  const togglePref = (key) => {
    setNotifPrefs((p) => ({ ...p, [key]: !p[key] }));
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h2 className="text-3xl font-black tracking-tight text-sky-950">Settings</h2>
        <p className="text-base text-slate-500 font-medium">Manage your profile and notification preferences.</p>
      </div>

      <form onSubmit={handleSave} className="rounded-2xl border border-sky-100 bg-white p-8 shadow-sm space-y-5">
        <h3 className="text-lg font-black text-slate-800">Profile</h3>
        <div className="space-y-2">
          <label className="text-xs font-black uppercase tracking-widest text-slate-400">Display name</label>
          <input
            value={nameDraft}
            onChange={(e) => setNameDraft(e.target.value)}
            className="w-full rounded-xl border border-sky-100 bg-slate-50/50 px-4 py-3 text-base font-bold text-slate-700 outline-none focus:border-sky-400 focus:bg-white"
          />
        </div>
        <button
          type="submit"
          className="inline-flex items-center gap-2 rounded-xl bg-sky-700 px-5 py-2.5 text-sm font-black text-white shadow-sm transition hover:bg-sky-800"
        >
          <Check size={16} /> Save changes
        </button>
      </form>

      <div className="rounded-2xl border border-sky-100 bg-white p-8 shadow-sm space-y-5">
        <h3 className="text-lg font-black text-slate-800">Notifications</h3>
        {[
          { key: 'newQuote', label: 'New quote requests', desc: 'Get notified whenever a client submits a request.' },
          { key: 'accepted', label: 'Accepted specs', desc: 'Get notified when a client accepts a quote.' },
          { key: 'reminders', label: 'Follow-up reminders', desc: 'Get nudged about quotes pending review.' },
        ].map((row) => (
          <div key={row.key} className="flex items-center justify-between gap-4 py-2">
            <div>
              <p className="font-black text-slate-700 text-sm">{row.label}</p>
              <p className="text-xs text-slate-400 font-bold">{row.desc}</p>
            </div>
            <button
              onClick={() => togglePref(row.key)}
              className={`relative h-7 w-12 shrink-0 rounded-full transition ${notifPrefs[row.key] ? 'bg-sky-600' : 'bg-slate-200'}`}
              aria-label={`Toggle ${row.label}`}
            >
              <span className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-transform ${notifPrefs[row.key] ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function Toast({ message }) {
  if (!message) return null;
  return (
    <div className="fixed bottom-6 right-6 z-50 rounded-xl bg-sky-950 px-6 py-3.5 text-base font-bold text-white shadow-2xl animate-fade-in">
      {message}
    </div>
  );
}

function NotificationsPanel({ notifications, onClose, onMarkAllRead }) {
  return (
    <div className="absolute right-0 top-14 z-40 w-80 rounded-2xl border border-sky-100 bg-white shadow-2xl overflow-hidden animate-fade-in">
      <div className="flex items-center justify-between px-5 py-4 border-b border-sky-50">
        <h4 className="font-black text-slate-800 text-sm">Notifications</h4>
        <button onClick={onMarkAllRead} className="text-[11px] font-black text-sky-600 hover:text-sky-800">
          Mark all read
        </button>
      </div>
      <div className="max-h-80 overflow-y-auto divide-y divide-slate-50">
        {notifications.map((n) => (
          <div key={n.id} className={`px-5 py-3.5 flex gap-3 ${n.unread ? 'bg-sky-50/40' : ''}`}>
            <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${n.unread ? 'bg-sky-500' : 'bg-transparent'}`} />
            <div className="min-w-0">
              <p className="text-sm font-black text-slate-700 truncate">{n.title}</p>
              <p className="text-xs text-slate-500 font-medium leading-snug mt-0.5">{n.body}</p>
              <p className="text-[10px] text-slate-300 font-black uppercase tracking-wider mt-1">{n.time}</p>
            </div>
          </div>
        ))}
      </div>
      <button
        onClick={onClose}
        className="w-full py-3 text-xs font-black text-slate-400 hover:text-sky-700 hover:bg-sky-50 transition"
      >
        Close
      </button>
    </div>
  );
}

function Sidebar({ expanded, onToggle, view, setView, userName, onSignOut }) {
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <aside
      className={`flex shrink-0 flex-col border-r border-sky-100 bg-white transition-all duration-300 ease-in-out ${expanded ? 'w-64' : 'w-[74px]'}`}
    >
      <div className="flex items-center justify-between border-b border-sky-50 px-3 py-5">
        {expanded && (
          <div className="flex items-center gap-3 overflow-hidden pl-1 w-full justify-center">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-sky-400 to-sky-700 text-base font-black text-white shadow-sm shadow-sky-200">Y</div>
            <div className="min-w-0 text-center">
              <p className="truncate text-lg font-black font-sans text-sky-950 tracking-tight">Yanol UI</p>
              <p className="truncate text-[10px] text-slate-400 font-bold uppercase tracking-widest">Reception desk</p>
            </div>
          </div>
        )}
        {!expanded && (
          <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-sky-400 to-sky-700 text-base font-black text-white">Y</div>
        )}
      </div>

      <nav className="flex flex-1 flex-col gap-2 px-3 py-6">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.key}
            onClick={() => setView(item.key)}
            title={!expanded ? item.label : undefined}
            className={`flex items-center gap-3 rounded-xl px-4 py-3.5 text-base font-black transition duration-200 ${view === item.key ? 'bg-sky-600 text-white shadow-md shadow-sky-200' : 'text-slate-500 hover:bg-sky-50 hover:text-sky-700'} ${!expanded ? 'justify-center' : ''}`}
          >
            <item.icon size={22} className="shrink-0" />
            {expanded && <span className="truncate">{item.label}</span>}
          </button>
        ))}
      </nav>

      <div className="relative border-t border-sky-50 p-3">
        {profileOpen && expanded && (
          <div className="absolute bottom-full left-3 right-3 mb-2 rounded-xl border border-sky-100 bg-white shadow-xl overflow-hidden animate-fade-in">
            <button
              onClick={() => { setView('settings'); setProfileOpen(false); }}
              className="flex w-full items-center gap-2 px-4 py-3 text-sm font-bold text-slate-600 hover:bg-sky-50 hover:text-sky-700 transition"
            >
              <Settings size={15} /> Account settings
            </button>
            <button
              onClick={onSignOut}
              className="flex w-full items-center gap-2 px-4 py-3 text-sm font-bold text-red-500 hover:bg-red-50 transition"
            >
              <LogOut size={15} /> Sign out
            </button>
          </div>
        )}

        {expanded ? (
          <button
            onClick={() => setProfileOpen((v) => !v)}
            className="mb-3 flex w-full items-center gap-2 rounded-xl px-2 py-2 hover:bg-sky-50 transition"
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-sky-400 to-sky-700 text-white">
              <User size={15} />
            </div>
            <span className="truncate text-sm font-black text-slate-700 flex-1 text-left">{userName}</span>
            <ChevronDown size={14} className={`text-slate-400 transition-transform ${profileOpen ? 'rotate-180' : ''}`} />
          </button>
        ) : (
          <button
            onClick={onSignOut}
            title="Sign out"
            className="mb-3 flex w-full items-center justify-center rounded-xl py-2 text-slate-400 hover:bg-red-50 hover:text-red-500 transition"
          >
            <LogOut size={18} />
          </button>
        )}

        <button
          onClick={onToggle}
          className="flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-slate-400 transition hover:bg-sky-50 hover:text-sky-700"
          aria-label={expanded ? 'Collapse sidebar' : 'Expand sidebar'}
        >
          {expanded ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
          {expanded && <span className="text-xs font-black uppercase tracking-wider">Collapse</span>}
        </button>
      </div>
    </aside>
  );
}

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState('Yeabsira W.');
  const [view, setView] = useState('overview');
  const [selectedProject, setSelectedProject] = useState(null); // Tracks the individual sub-page logic
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [quoteCount, setQuoteCount] = useState(6);
  const [acceptedCount, setAcceptedCount] = useState(2);
  const [prevQuoteCount] = useState(5);
  const [prevAcceptedCount] = useState(3);
  const [toast, setToast] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const [notifPrefs, setNotifPrefs] = useState({ newQuote: true, accepted: true, reminders: false });
  const searchInputRef = useRef(null);

  const unreadCount = notifications.filter((n) => n.unread).length;

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    const user = localStorage.getItem('user');
    if (token) {
      setIsAuthenticated(true);
      if (user) {
        const parsedUser = JSON.parse(user);
        setUserName(parsedUser.name || 'Admin User');
      }
    }
  }, []);

  // Keyboard shortcut: "/" focuses the global search
  useEffect(() => {
    const handler = (e) => {
      if (e.key === '/' && document.activeElement.tagName !== 'INPUT') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2600);
  };

  const handleLoginSuccess = () => {
    const user = localStorage.getItem('user');
    if (user) setUserName(JSON.parse(user).name);
    setIsAuthenticated(true);
    setView('overview');
    showToast('Welcome to dashboard panel.');
  };

  const handleSignOut = async (e) => {
    if (e) e.preventDefault();
    try {
      await api.post('/logout');
    } catch (error) {
      console.error('Token termination on backend skipped or failed', error);
    } finally {
      localStorage.removeItem('admin_token');
      localStorage.removeItem('user');
      setIsAuthenticated(false);
      setView('overview');
      setSelectedProject(null);
      showToast('Logged out successfully.');
    }
  };

  const handleQuoteSubmitted = (clientName) => {
    // 1. Increment your dashboard metrics counter
    setQuoteCount((c) => c + 1);
    
    // 2. Trigger your custom beautiful toast message!
    showToast(`✨ Success! Quote layout for "${clientName}" saved to database.`); 
    
    // 3. Take the user back to the main view or close the modal
    setView('overview'); 
  };
  // Safe view reset handler toggling project pages off
  const handleNavChange = (targetView) => {
    setSelectedProject(null);
    setView(targetView);
  };

  const handleMarkAllRead = () => {
    setNotifications((list) => list.map((n) => ({ ...n, unread: false })));
  };

  if (!isAuthenticated) {
    return (
      <>
        <Login onLoginSuccess={handleLoginSuccess} />
        <Toast message={toast} />
      </>
    );
  }

  const isQuoteView = view === 'quote';

  return (
    <div className="flex h-svh w-full overflow-hidden bg-gradient-to-b from-white to-sky-50/50 font-sans text-slate-900 selection:bg-sky-100">
      <Sidebar
        expanded={sidebarExpanded}
        onToggle={() => setSidebarExpanded((v) => !v)}
        view={view}
        setView={handleNavChange}
        userName={userName}
        onSignOut={handleSignOut}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Top bar */}
        <header className="relative flex shrink-0 items-center gap-4 border-b border-sky-100 bg-white/80 px-4 py-4 backdrop-blur-sm lg:px-6">
          <button
            onClick={() => setSidebarExpanded((v) => !v)}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-slate-400 transition hover:bg-sky-50 hover:text-sky-700 lg:hidden shadow-sm border border-slate-100"
            aria-label="Toggle menu"
          >
            <Menu size={22} />
          </button>

          <div className="hidden sm:flex items-center gap-1.5 shrink-0">
            <Sparkles size={20} className="text-sky-500" />
            <h1 className="text-xl font-black tracking-tighter text-sky-950 lg:text-2xl">
              Yanol Digital
            </h1>
          </div>

          <div className="relative flex-1 max-w-md mx-auto">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300" />
            <input
              ref={searchInputRef}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search clients, quotes... (press /)"
              className="w-full rounded-xl border border-sky-100 bg-slate-50/60 py-2.5 pl-10 pr-4 text-sm font-medium text-slate-700 outline-none transition focus:border-sky-400 focus:bg-white"
            />
          </div>

          <div className="relative flex items-center gap-2 shrink-0">
            <button
              onClick={() => setNotifOpen((v) => !v)}
              className="relative flex h-10 w-10 items-center justify-center rounded-xl text-slate-400 transition hover:bg-sky-50 hover:text-sky-700"
              aria-label="Notifications"
            >
              <Bell size={20} />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[9px] font-black text-white">
                  {unreadCount}
                </span>
              )}
            </button>
            {notifOpen && (
              <NotificationsPanel
                notifications={notifications}
                onClose={() => setNotifOpen(false)}
                onMarkAllRead={handleMarkAllRead}
              />
            )}
          </div>
        </header>

        {/* Main content — full remaining height */}
        <main className={`min-h-0 flex-1 ${isQuoteView ? 'overflow-hidden' : 'overflow-y-auto p-6 lg:p-10'}`}>
          {isQuoteView ? (
            <div className="flex h-full flex-col bg-white rounded-2xl shadow-sm border border-sky-50">
              <QuoteForm onClose={() => setView('overview')} onSubmitted={handleQuoteSubmitted} />
            </div>
          ) : selectedProject ? (
            /* Dedicated Dynamic Inner Page when an active node gets selected */
            <ProjectDetailView project={selectedProject} onBack={() => setSelectedProject(null)} />
          ) : (
            <>
              {view === 'overview' && (
                <Overview
                  userName={userName}
                  quoteCount={quoteCount}
                  acceptedCount={acceptedCount}
                  prevQuoteCount={prevQuoteCount}
                  prevAcceptedCount={prevAcceptedCount}
                  onNewQuote={() => setView('quote')}
                  onSelectProject={(proj) => setSelectedProject(proj)}
                />
              )}
              {view === 'reports' && <Reports />}
              {view === 'clients' && <Clients searchTerm={searchTerm} />}
              {view === 'settings' && (
                <SettingsView
                  userName={userName}
                  setUserName={setUserName}
                  notifPrefs={notifPrefs}
                  setNotifPrefs={setNotifPrefs}
                  showToast={showToast}
                />
              )}
            </>
          )}
        </main>
      </div>

      <Toast message={toast} />
    </div>
  );
}