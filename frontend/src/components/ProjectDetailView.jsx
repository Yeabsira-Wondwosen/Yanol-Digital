import React from 'react';
import { 
  ArrowLeft, CheckCircle2, Smartphone, Globe2, ShoppingCart, 
  GraduationCap, LayoutDashboard, Palette, Server, Wrench, FileText
} from 'lucide-react';

const PROJECT_TYPE_METADATA = {
  mobile_app: { icon: Smartphone, accent: 'from-blue-500 to-indigo-600', label: 'Mobile App' },
  full_website: { icon: Globe2, accent: 'from-sky-400 to-sky-600', label: 'Full Website' },
  ecommerce: { icon: ShoppingCart, accent: 'from-amber-400 to-orange-600', label: 'E-commerce Platform' },
  lms: { icon: GraduationCap, accent: 'from-emerald-400 to-teal-600', label: 'Learning Platform' },
  custom_app: { icon: LayoutDashboard, accent: 'from-purple-400 to-violet-600', label: 'Custom App' },
  ui_ux: { icon: Palette, accent: 'from-pink-400 to-rose-600', label: 'UI/UX Design' },
  api_backend: { icon: Server, accent: 'from-slate-600 to-slate-800', label: 'Backend API' },
  maintenance: { icon: Wrench, accent: 'from-teal-400 to-emerald-600', label: 'Maintenance' },
};

export default function ProjectDetailView({ project, onBack, onDone }) {
    const meta = PROJECT_TYPE_METADATA[project.project_type] || { 
      icon: FileText, 
      accent: 'from-sky-500 to-sky-700', 
      label: project.project_type || 'Custom Project' 
    };
    const IconComp = meta.icon;
    const accent = meta.accent;
    const label = meta.label;
    const title = project.company_name 
      ? `${project.company_name} - ${label}` 
      : `${project.client_name || 'Client'} - ${label}`;
    const details = project.project_details || project.requirement || 'No details provided.';

    return (
        <div className="bg-white rounded-3xl border border-sky-100 p-8 lg:p-12 shadow-sm animate-fade-in max-w-4xl mx-auto space-y-8">
            <div className="flex justify-between items-center gap-4 flex-wrap">
                <button onClick={onBack} className="inline-flex items-center gap-2 text-sm font-black text-slate-400 hover:text-sky-700 transition bg-slate-50 hover:bg-sky-50 px-4 py-2 rounded-xl group cursor-pointer">
                    <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                    Return to Overview
                </button>
                {project.status !== 'approved' && project.status !== 'accepted' && (
                    <button 
                        onClick={() => onDone && onDone(project)} 
                        className="inline-flex items-center gap-2 text-sm font-black text-white hover:opacity-90 transition bg-emerald-600 hover:bg-emerald-700 px-5 py-2.5 rounded-xl shadow-md cursor-pointer"
                    >
                        <CheckCircle2 size={16} />
                        Mark as Done
                    </button>
                )}
            </div>

            <div className="flex flex-col md:flex-row gap-8 items-start md:items-center border-b border-slate-100 pb-8">
                <div className={`h-24 w-24 shrink-0 rounded-full bg-gradient-to-tr ${accent} flex items-center justify-center text-white shadow-lg`}>
                    <IconComp size={40} />
                </div>
                <div>
                    <span className="text-xs font-black tracking-widest text-sky-600 uppercase bg-sky-50 px-3 py-1 rounded-md">{label}</span>
                    <h2 className="text-3xl md:text-4xl font-black text-sky-950 tracking-tight mt-2">{title}</h2>
                </div>
            </div>

            <div className="space-y-4">
                <h3 className="text-lg font-black text-slate-800">Operational Summary & Specifications</h3>
                <p className="text-slate-600 leading-relaxed text-base font-medium bg-slate-50/50 p-6 rounded-2xl border border-slate-100 whitespace-pre-line">
                    {details}
                </p>
            </div>
        </div>
    );
}