import React, { useState } from 'react';
import { Download, TrendingUp, TrendingDown } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

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

function StatCard({ label, value, sub }) {
    return (
        <div className="rounded-2xl border border-sky-100 bg-white p-8 text-center flex flex-col items-center justify-center group border-b-4 hover:border-b-sky-500 relative transition-all duration-300">
            <span className="text-xs font-black text-slate-400 uppercase tracking-widest">{label}</span>
            <span className="mt-2 block text-5xl font-black tracking-tighter text-sky-950 font-sans transition-transform duration-300">{value}</span>
            <span className="text-xs font-bold text-slate-400 mt-2 bg-slate-50 px-2.5 py-1 rounded-md">{sub}</span>
        </div>
    );
}

export default function Reports() {
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