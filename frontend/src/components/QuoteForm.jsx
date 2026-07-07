import React, { useState } from 'react';
import api from '../services/api.js';
import {
  X, ChevronDown, Smartphone, Globe2, ShoppingCart, GraduationCap,
  LayoutDashboard, Palette, Server, Wrench, Building2, Briefcase,
  DollarSign, Clock, Phone, Mail, MessageCircle, Link2, Flag
} from 'lucide-react';

const PROJECT_TYPES = [
  { value: 'mobile_app', label: 'Mobile App Development', icon: Smartphone },
  { value: 'full_website', label: 'Full Website System', icon: Globe2 },
  { value: 'ecommerce', label: 'E-commerce Platform', icon: ShoppingCart },
  { value: 'lms', label: 'Educational / Learning Platform', icon: GraduationCap },
  { value: 'custom_app', label: 'Custom Web Application', icon: LayoutDashboard },
  { value: 'ui_ux', label: 'UI/UX Design Only', icon: Palette },
  { value: 'api_backend', label: 'API / Backend Integration', icon: Server },
  { value: 'maintenance', label: 'Maintenance & Support', icon: Wrench },
];

const BUSINESS_PROFILES = [
  { value: 'startup', label: 'Startup / Solo Founder', desc: 'Early-stage, lean budget' },
  { value: 'small_business', label: 'Small Business (1–10)', desc: 'Local shop or small team' },
  { value: 'growing', label: 'Growing Company (11–50)', desc: 'Scaling operations' },
  { value: 'enterprise', label: 'Enterprise (50+)', desc: 'Large org, complex needs' },
  { value: 'nonprofit', label: 'Non-profit / NGO', desc: 'Mission-driven org' },
  { value: 'agency', label: 'Agency / Freelancer', desc: 'Reselling or white-label' },
];

const INDUSTRIES = [
  'Technology', 'Retail & E-commerce', 'Healthcare', 'Education',
  'Finance', 'Real Estate', 'Hospitality', 'Manufacturing', 'Other',
];

const BUDGET_RANGES = [
  'Under $1,000', '$1,000 – $5,000', '$5,000 – $15,000',
  '$15,000 – $50,000', '$50,000+', 'Not sure yet',
];

const TIMELINES = [
  'ASAP (1–2 weeks)', '1 month', '2–3 months', '3–6 months', 'Flexible',
];

const PRIORITIES = ['Low', 'Normal', 'High', 'Urgent'];

const CONTACT_METHODS = [
  { value: 'email', label: 'Email', icon: Mail },
  { value: 'phone', label: 'Phone', icon: Phone },
  { value: 'whatsapp', label: 'WhatsApp', icon: MessageCircle },
];

function Dropdown({ label, icon: Icon, value, options, onChange, renderOption }) {
  const [open, setOpen] = useState(false);
  const selected = options.find((o) => o.value === value) || options[0];

  return (
    <div className="relative flex flex-col gap-1.5">
      <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-slate-500">
        {Icon && <Icon size={13} />}
        {label}
      </label>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between rounded-xl border border-sky-100 bg-sky-50/50 px-4 py-3 text-left text-sm text-slate-800 transition hover:border-sky-200 hover:bg-sky-50"
      >
        <span className="flex items-center gap-2 truncate">
          {renderOption ? renderOption(selected) : selected?.label}
        </span>
        <ChevronDown size={16} className={`shrink-0 text-slate-400 transition ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="absolute top-full z-20 mt-1 max-h-56 w-full overflow-y-auto rounded-xl border border-sky-100 bg-white py-1 shadow-xl">
          {options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => { onChange(opt.value); setOpen(false); }}
              className={`flex w-full items-start gap-2 px-4 py-2.5 text-left text-sm transition hover:bg-sky-50 ${opt.value === value ? 'bg-sky-50 font-semibold text-sky-700' : 'text-slate-700'}`}
            >
              {renderOption ? renderOption(opt) : opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function QuoteForm({ onClose, onSubmitted }) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [businessProfile, setBusinessProfile] = useState(BUSINESS_PROFILES[0].value);
  const [industry, setIndustry] = useState(INDUSTRIES[0]);
  const [projectType, setProjectType] = useState(PROJECT_TYPES[0].value);
  const [budget, setBudget] = useState(BUDGET_RANGES[1]);
  const [timeline, setTimeline] = useState(TIMELINES[2]);
  const [priority, setPriority] = useState(PRIORITIES[1]);
  const [contactMethod, setContactMethod] = useState(CONTACT_METHODS[0].value);
  const [existingUrl, setExistingUrl] = useState('');
  const [referralSource, setReferralSource] = useState('');
  const [requirement, setRequirement] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Mapping your explicit local state values straight to your Laravel expected payload fields
    const payload = {
      client_name: fullName,
      company_name: companyName,
      email: email,
      phone: phone,
      project_details: requirement
    };

    try {
      const response = await api.post('/quotes', payload);
      
      if (response.data.success) {
        onSubmitted(fullName); 
      }
    } catch (error) {
      console.error("Database submission failed:", error.response?.data || error.message);
      alert("Failed to save to database. Check terminal logs.");
    }
  };

  const selectedProject = PROJECT_TYPES.find((p) => p.value === projectType);

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex shrink-0 items-center justify-between border-b border-sky-100 bg-white px-6 py-4 lg:px-10">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">Create Quote</h2>
          <p className="mt-0.5 text-sm text-slate-500">Capture every detail for a precise project estimate.</p>
        </div>
        <button
          onClick={onClose}
          className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-500 transition hover:bg-sky-50 hover:text-sky-700"
          aria-label="Close form"
        >
          <X size={18} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-1 flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto px-6 py-6 lg:px-10">
          <div className="mx-auto max-w-5xl space-y-8">
            {/* Client info */}
            <section>
              <h3 className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-sky-700">
                <Briefcase size={15} /> Client Information
              </h3>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <Field label="Full name" required>
                  <input type="text" required value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="e.g., Abel Tesfaye" className={inputCls} />
                </Field>
                <Field label="Email address" required>
                  <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@example.com" className={inputCls} />
                </Field>
                <Field label="Phone number" required>
                  <input type="tel" required value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+251 9xx xxx xxx" className={inputCls} />
                </Field>
                <Field label="Company name">
                  <input type="text" value={companyName} onChange={(e) => setCompanyName(e.target.value)} placeholder="Company or brand name" className={inputCls} />
                </Field>
                <Field label="Existing website">
                  <div className="relative">
                    <Link2 size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input type="url" value={existingUrl} onChange={(e) => setExistingUrl(e.target.value)} placeholder="https://..." className={`${inputCls} pl-9`} />
                  </div>
                </Field>
                <Field label="How did they find us?">
                  <input type="text" value={referralSource} onChange={(e) => setReferralSource(e.target.value)} placeholder="Google, referral, social..." className={inputCls} />
                </Field>
              </div>
            </section>

            {/* Business profile */}
            <section>
              <h3 className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-sky-700">
                <Building2 size={15} /> Business Profile
              </h3>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <Dropdown
                  label="Business profile"
                  icon={Building2}
                  value={businessProfile}
                  options={BUSINESS_PROFILES}
                  onChange={setBusinessProfile}
                  renderOption={(opt) => (
                    <span>
                      <span className="block font-medium">{opt.label}</span>
                      <span className="block text-xs text-slate-400">{opt.desc}</span>
                    </span>
                  )}
                />
                <Field label="Industry sector">
                  <select value={industry} onChange={(e) => setIndustry(e.target.value)} className={inputCls}>
                    {INDUSTRIES.map((ind) => <option key={ind} value={ind}>{ind}</option>)}
                  </select>
                </Field>
                <Dropdown
                  label="Project type"
                  icon={selectedProject?.icon}
                  value={projectType}
                  options={PROJECT_TYPES}
                  onChange={setProjectType}
                  renderOption={(opt) => (
                    <span className="flex items-center gap-2">
                      <opt.icon size={15} className="text-sky-600" />
                      {opt.label}
                    </span>
                  )}
                />
              </div>
            </section>

            {/* Project scope */}
            <section>
              <h3 className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-sky-700">
                <DollarSign size={15} /> Scope & Timeline
              </h3>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <Field label="Budget range">
                  <select value={budget} onChange={(e) => setBudget(e.target.value)} className={inputCls}>
                    {BUDGET_RANGES.map((b) => <option key={b} value={b}>{b}</option>)}
                  </select>
                </Field>
                <Field label="Timeline">
                  <select value={timeline} onChange={(e) => setTimeline(e.target.value)} className={inputCls}>
                    {TIMELINES.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </Field>
                <Field label="Priority">
                  <select value={priority} onChange={(e) => setPriority(e.target.value)} className={inputCls}>
                    {PRIORITIES.map((p) => <option key={p} value={p}>{p}</option>)}
                  </select>
                </Field>
                <Field label="Preferred contact">
                  <div className="flex gap-2">
                    {CONTACT_METHODS.map((m) => (
                      <button
                        key={m.value}
                        type="button"
                        onClick={() => setContactMethod(m.value)}
                        className={`flex flex-1 items-center justify-center gap-1.5 rounded-xl border px-2 py-3 text-xs font-semibold transition ${contactMethod === m.value ? 'border-sky-500 bg-sky-50 text-sky-700' : 'border-sky-100 bg-white text-slate-500 hover:border-sky-200'}`}
                      >
                        <m.icon size={14} />
                        {m.label}
                      </button>
                    ))}
                  </div>
                </Field>
              </div>
            </section>

            {/* Requirements */}
            <section>
              <h3 className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-sky-700">
                <Flag size={15} /> Detailed Requirements
              </h3>
              <textarea
                rows={6}
                required
                value={requirement}
                onChange={(e) => setRequirement(e.target.value)}
                placeholder="Describe animations, page count, color themes, integrations, must-have features..."
                className={`${inputCls} resize-y`}
              />
            </section>
          </div>
        </div>

        <div className="shrink-0 border-t border-sky-100 bg-white px-6 py-4 lg:px-10">
          <div className="mx-auto flex max-w-5xl items-center justify-between gap-4">
            <p className="text-xs text-slate-400">
              <Clock size={12} className="mr-1 inline" />
              Quotes are reviewed within 4 business hours.
            </p>
            <div className="flex gap-3">
              <button type="button" onClick={onClose} className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50">
                Cancel
              </button>
              <button type="submit" className="rounded-xl bg-gradient-to-r from-sky-400 to-sky-700 px-6 py-2.5 text-sm font-bold text-white shadow-md transition hover:opacity-90">
                Save Quote
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

function Field({ label, required, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold text-slate-500">
        {label}{required && <span className="text-red-400"> *</span>}
      </label>
      {children}
    </div>
  );
}

const inputCls = 'w-full rounded-xl border border-sky-100 bg-sky-50/40 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-sky-400 focus:bg-white focus:ring-2 focus:ring-sky-100';