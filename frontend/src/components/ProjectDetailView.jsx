import React from 'react';
import { ArrowLeft } from 'lucide-react';

export default function ProjectDetailView({ project, onBack }) {
    const IconComp = project.icon;
    return (
        <div className="bg-white rounded-3xl border border-sky-100 p-8 lg:p-12 shadow-sm animate-fade-in max-w-4xl mx-auto space-y-8">
            <button onClick={onBack} className="inline-flex items-center gap-2 text-sm font-black text-slate-400 hover:text-sky-700 transition bg-slate-50 hover:bg-sky-50 px-4 py-2 rounded-xl group">
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