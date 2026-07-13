import React, { useState, useMemo } from 'react';
import { Download } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { useTheme } from '../Context/ThemeContext';

const PERIODS = ['Daily', 'Weekly', 'Monthly', 'Yearly'];

function toCSV(rows) {
    if (!rows || rows.length === 0) return '';
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
        <div className="rounded-2xl border border-sky-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 text-center flex flex-col items-center justify-center group border-b-4 hover:border-b-sky-500 relative transition-all duration-300 shadow-sm">
            <span className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">{label}</span>
            <span className="mt-2 block text-5xl font-black tracking-tighter text-sky-950 dark:text-white font-sans">{value}</span>
            <span className="text-xs font-bold text-slate-400 dark:text-slate-400 mt-2 bg-slate-50 dark:bg-slate-950 px-2.5 py-1 rounded-md">{sub}</span>
        </div>
    );
}

export default function Reports({ clients = [] }) {
    const [period, setPeriod] = useState('Monthly');
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    const dynamicReportData = useMemo(() => {
        const now = new Date();
        const safeClients = Array.isArray(clients) ? clients : [];

        const dailyMap = { Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0, Sun: 0 };
        const dailyAcc = { Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0, Sun: 0 };
        const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

        const weeklyMap = { W1: 0, W2: 0, W3: 0, W4: 0 };
        const weeklyAcc = { W1: 0, W2: 0, W3: 0, W4: 0 };

        const monthlyMap = { Jan: 0, Feb: 0, Mar: 0, Apr: 0, May: 0, Jun: 0, Jul: 0, Aug: 0, Sep: 0, Oct: 0, Nov: 0, Dec: 0 };
        const monthlyAcc = { Jan: 0, Feb: 0, Mar: 0, Apr: 0, May: 0, Jun: 0, Jul: 0, Aug: 0, Sep: 0, Oct: 0, Nov: 0, Dec: 0 };
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

        const yearlyMap = {};
        const yearlyAcc = {};

        // Parse through grouped structures cleanly
        safeClients.forEach(client => {
            const quotesList = Array.isArray(client.quotes) ? client.quotes : [];

            quotesList.forEach(quote => {
                const rawDate = quote.created_at || quote.createdAt || quote.date;
                if (!rawDate) return;

                const date = new Date(rawDate);
                const isApproved = quote.status === 'approved' || quote.status === 'accepted';

                // Daily Metrics
                const itemWeek = getWeekNumber(date);
                const currentWeek = getWeekNumber(now);
                if (date.getFullYear() === now.getFullYear() && itemWeek === currentWeek) {
                    const dayName = daysOfWeek[date.getDay()];
                    if (dayName in dailyMap) {
                        dailyMap[dayName] += 1;
                        if (isApproved) dailyAcc[dayName] += 1;
                    }
                }

                // Weekly Metrics
                if (date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth()) {
                    const dom = date.getDate();
                    const weekIndex = Math.min(Math.ceil(dom / 7), 4);
                    const wKey = `W${weekIndex}`;
                    weeklyMap[wKey] += 1;
                    if (isApproved) weeklyAcc[wKey] += 1;
                }

                // Monthly Metrics
                if (date.getFullYear() === now.getFullYear()) {
                    const monthName = months[date.getMonth()];
                    monthlyMap[monthName] += 1;
                    if (isApproved) monthlyAcc[monthName] += 1;
                }

                // Yearly Metrics
                const yearStr = date.getFullYear().toString();
                yearlyMap[yearStr] = (yearlyMap[yearStr] || 0) + 1;
                if (isApproved) yearlyAcc[yearStr] = (yearlyAcc[yearStr] || 0) + 1;
            });
        });

        function getWeekNumber(d) {
            const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
            date.setUTCDate(date.getUTCDate() + 4 - (date.getUTCDay() || 7));
            const startOfYear = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
            return Math.ceil((((date - startOfYear) / 86400000) + 1) / 7);
        }

        return {
            Daily: Object.keys(dailyMap).map(k => ({ label: k, quotes: dailyMap[k], accepted: dailyAcc[k] })),
            Weekly: Object.keys(weeklyMap).map(k => ({ label: k, quotes: weeklyMap[k], accepted: weeklyAcc[k] })),
            Monthly: Object.keys(monthlyMap).map(k => ({ label: k, quotes: monthlyMap[k], accepted: monthlyAcc[k] })),
            Yearly: Object.keys(yearlyMap).sort().map(k => ({ label: k, quotes: yearlyMap[k], accepted: yearlyAcc[k] }))
        };
    }, [clients]);

    const chartData = dynamicReportData[period] || [];

    const totalQuotes = chartData.reduce((s, d) => s + d.quotes, 0);
    const totalAccepted = chartData.reduce((s, d) => s + d.accepted, 0);
    const rate = totalQuotes ? Math.round((totalAccepted / totalQuotes) * 100) : 0;

    return (
        <div className="max-w-6xl mx-auto p-4 space-y-8 w-full block clear-both">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 dark:border-slate-800/60 pb-5">
                <div>
                    <h2 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">Reports</h2>
                    <p className="text-base text-slate-500 dark:text-slate-400 font-medium">Real-time quote volume and metrics integration.</p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <div className="flex rounded-xl border border-sky-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-1 shadow-sm">
                        {PERIODS.map((p) => (
                            <button
                                key={p}
                                onClick={() => setPeriod(p)}
                                className={`rounded-lg px-3.5 py-2 text-xs sm:text-sm font-bold transition-all ${p === period ? 'bg-sky-700 text-white shadow-sm' : 'text-slate-400'
                                    }`}
                            >
                                {p}
                            </button>
                        ))}
                    </div>
                    <button
                        onClick={() => downloadCSV(`report-${period.toLowerCase()}.csv`, chartData)}
                        className="flex items-center gap-2 rounded-xl border border-sky-100 bg-white px-4 py-2.5 text-sm font-black text-sky-700 shadow-sm transition hover:bg-slate-50"
                    >
                        <Download size={16} />
                        Export CSV
                    </button>
                </div>
            </div>

            <div className="grid gap-6 grid-cols-1 sm:grid-cols-3">
                <StatCard label={`Total quotes (${period.toLowerCase()})`} value={totalQuotes} sub="Live Database Requests" />
                <StatCard label="Accepted" value={totalAccepted} sub="Approved transactions" />
                <StatCard label="Acceptance rate" value={`${rate}%`} sub="Performance score" />
            </div>

            <div className="rounded-2xl border border-sky-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 pt-8 shadow-sm h-[340px]">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
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
                        <CartesianGrid stroke={isDark ? '#334155' : '#e6f2fb'} strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="label" stroke="#7c93ab" fontSize={12} fontWeight="bold" />
                        <YAxis stroke="#7c93ab" fontSize={12} fontWeight="bold" />
                        <Tooltip />
                        <Area type="monotone" dataKey="quotes" stroke="#38bdf8" strokeWidth={3} fill="url(#quotesFill)" name="Quotes" />
                        <Area type="monotone" dataKey="accepted" stroke="#0369a1" strokeWidth={3} fill="url(#acceptedFill)" name="Accepted" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}