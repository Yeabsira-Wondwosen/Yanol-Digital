import React, { useState, useEffect, useMemo } from 'react';
import api from '../services/api';
import { 
  Search, SlidersHorizontal, Edit3, Trash2, Clock, CheckCircle, 
  AlertTriangle, Loader2, X, Save, RefreshCw, Mail, Phone, 
  Building, Briefcase, Calendar, DollarSign, Globe2, Flag
} from 'lucide-react';

const PRIORITY_STYLES = {
  low: 'bg-slate-50 text-slate-600 border-slate-200',
  medium: 'bg-blue-50 text-blue-700 border-blue-200',
  high: 'bg-rose-50 text-rose-700 border-rose-200',
};

const STATUS_STYLES = {
  pending: 'bg-amber-50 text-amber-700 border-amber-200',
  approved: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  deleted: 'bg-red-50 text-red-700 border-red-200',
};

const PROJECT_TYPES = {
  mobile_app: 'Mobile App',
  full_website: 'Full Website',
  ecommerce: 'E-commerce Platform',
  lms: 'Learning Platform',
  custom_app: 'Custom App',
  ui_ux: 'UI/UX Design',
  api_backend: 'Backend API',
  maintenance: 'Maintenance',
};

export default function ManageQuotes({ refreshTrigger, setRefreshTrigger }) {
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Search & Filter State
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');

  // Edit Modal State
  const [editingQuote, setEditingQuote] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  const fetchQuotes = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/quotes');
      const data = Array.isArray(response.data) ? response.data : (response.data?.data || []);
      setQuotes(data);
    } catch (err) {
      console.error('Failed to fetch quotes:', err);
      setError(err.response?.data?.message || err.message || 'Failed to connect to backend.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuotes();
  }, [refreshTrigger]);

  // Memoized Filtered Quotes
  const filteredQuotes = useMemo(() => {
    return quotes.filter(q => {
      const matchesSearch = 
        (q.client_name || '').toLowerCase().includes(search.toLowerCase()) ||
        (q.company_name || '').toLowerCase().includes(search.toLowerCase()) ||
        (q.email || '').toLowerCase().includes(search.toLowerCase()) ||
        (q.phone || '').toLowerCase().includes(search.toLowerCase()) ||
        (q.project_type || '').toLowerCase().includes(search.toLowerCase());

      const matchesStatus = statusFilter === 'all' || (q.status || 'pending').toLowerCase() === statusFilter;
      const matchesPriority = priorityFilter === 'all' || (q.priority || 'medium').toLowerCase() === priorityFilter;

      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [quotes, search, statusFilter, priorityFilter]);

  const handleEditClick = (quote) => {
    setEditingQuote(quote);
    setSaveError(null);
    setSuccessMessage('');
    // Pre-populate Form State
    setEditForm({
      client_name: quote.client_name || '',
      company_name: quote.company_name || '',
      email: quote.email || '',
      phone: quote.phone || '',
      project_type: quote.project_type || 'custom_app',
      budget: quote.budget || '',
      timeline: quote.timeline || '',
      priority: quote.priority || 'medium',
      industry: quote.industry || '',
      business_profile: quote.business_profile || '',
      contact_method: quote.contact_method || 'email',
      existing_url: quote.existing_url || '',
      referral_source: quote.referral_source || '',
      requirement: quote.requirement || '',
      project_details: quote.project_details || '',
      status: quote.status || 'pending',
      estimated_amount: quote.estimated_amount || 0.00
    });
  };

  const handleFormFieldChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSaveError(null);
    setSuccessMessage('');

    if (!editForm.email) {
      setSaveError("The client email address is required.");
      setSaving(false);
      return;
    }

    try {
      const response = await api.patch(`/quotes/${editingQuote.id}`, editForm);
      if (response.data?.success) {
        setSuccessMessage('Quote updated successfully!');
        
        // Update local state item
        setQuotes(prev => prev.map(q => q.id === editingQuote.id ? response.data.data : q));
        
        // Trigger global state sync in parents
        if (setRefreshTrigger) {
          setRefreshTrigger(prev => prev + 1);
        }

        setTimeout(() => {
          setEditingQuote(null);
        }, 1000);
      }
    } catch (err) {
      console.error('Failed to update quote:', err);
      setSaveError(err.response?.data?.message || err.message || 'An error occurred while saving.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteQuote = async (id) => {
    if (!window.confirm('Are you sure you want to permanently delete this quote record from MySQL?')) return;
    try {
      await api.delete(`/quotes/${id}`);
      setQuotes(prev => prev.filter(q => q.id !== id));
      if (setRefreshTrigger) {
        setRefreshTrigger(prev => prev + 1);
      }
    } catch (err) {
      console.error('Delete failed:', err);
      alert('Failed to delete quote: ' + (err.response?.data?.message || err.message));
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <Loader2 className="w-8 h-8 text-sky-600 animate-spin" />
        <p className="text-sm font-semibold text-slate-500 tracking-wide">Loading quotes repository from MySQL...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-100 bg-red-50 p-6 text-center max-w-xl mx-auto">
        <AlertTriangle className="w-10 h-10 text-red-500 mx-auto mb-3" />
        <h3 className="font-bold text-slate-800 text-lg">Failed to Connect to Database</h3>
        <p className="text-xs text-red-600 mt-1">{error}</p>
        <button 
          onClick={fetchQuotes}
          className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-red-600 px-4 py-2 text-xs font-bold text-white hover:bg-red-700 transition"
        >
          <RefreshCw size={13} /> Retry Connection
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col gap-4 border-b border-slate-100 pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <SlidersHorizontal className="w-6 h-6 text-sky-600" />
            Manage Quotes
          </h2>
          <p className="text-xs text-slate-400 font-medium mt-0.5">
            Review detailed requests, edit erroneous submissions, and synchronize updates to clients.
          </p>
        </div>
        <span className="text-xs font-bold text-sky-700 bg-sky-50 px-2.5 py-1 rounded-lg border border-sky-100 w-fit">
          Found: {filteredQuotes.length} Quotes
        </span>
      </div>

      {/* Filters Box */}
      <div className="grid gap-4 md:grid-cols-4 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
        {/* Search */}
        <div className="md:col-span-2 relative">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search by client, company, email, phone..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50/50 focus:bg-white focus:border-sky-400 outline-none transition font-medium"
          />
        </div>

        {/* Status */}
        <div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50/50 focus:bg-white focus:border-sky-400 outline-none transition font-semibold text-slate-600"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="deleted">Deleted</option>
          </select>
        </div>

        {/* Priority */}
        <div>
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50/50 focus:bg-white focus:border-sky-400 outline-none transition font-semibold text-slate-600"
          >
            <option value="all">All Priorities</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
      </div>

      {/* Main Quote Table Grid */}
      <div className="rounded-2xl border border-slate-100 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/30 text-[10px] font-black uppercase tracking-wider text-slate-400">
                <th className="px-6 py-4">Client Detail</th>
                <th className="px-6 py-4">Project Type</th>
                <th className="px-6 py-4">Estimated Budget</th>
                <th className="px-6 py-4">Timeline / Priority</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs font-semibold text-slate-700">
              {filteredQuotes.map((quote) => {
                const priority = (quote.priority || 'medium').toLowerCase();
                const status = (quote.status || 'pending').toLowerCase();
                const createdDate = quote.created_at 
                  ? new Date(quote.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
                  : 'N/A';

                return (
                  <tr key={quote.id} className="hover:bg-slate-50/50 transition-colors">
                    {/* Client Detail */}
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <span className="font-extrabold text-sm text-slate-800 tracking-tight block">
                          {quote.client_name || 'Anonymous Client'}
                        </span>
                        {quote.company_name && (
                          <span className="text-[10px] font-bold text-sky-700 bg-sky-50 border border-sky-100 px-1.5 py-0.5 rounded inline-flex items-center gap-1">
                            <Building size={10} /> {quote.company_name}
                          </span>
                        )}
                        <div className="flex flex-col gap-0.5 text-[10px] font-semibold text-slate-400 pt-1">
                          <span className="flex items-center gap-1"><Mail size={10} /> {quote.email}</span>
                          {quote.phone && <span className="flex items-center gap-1"><Phone size={10} /> {quote.phone}</span>}
                        </div>
                      </div>
                    </td>

                    {/* Project Type */}
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <span className="font-bold text-slate-800 flex items-center gap-1">
                          <Briefcase size={12} className="text-slate-400" />
                          {PROJECT_TYPES[quote.project_type] || quote.project_type || 'Custom App'}
                        </span>
                        {quote.industry && (
                          <span className="text-[10px] text-slate-400 block font-medium">Industry: {quote.industry}</span>
                        )}
                      </div>
                    </td>

                    {/* Budget */}
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <span className="text-sm font-black text-slate-900 flex items-center">
                          <DollarSign size={13} className="text-slate-400" />
                          {quote.estimated_amount ? Number(quote.estimated_amount).toLocaleString() : (quote.budget || '0')}
                        </span>
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tight block">EST. VALUE</span>
                      </div>
                    </td>

                    {/* Timeline & Priority */}
                    <td className="px-6 py-4">
                      <div className="space-y-1.5">
                        <span className="text-[10px] font-medium text-slate-500 flex items-center gap-1">
                          <Calendar size={12} className="text-slate-400" /> {quote.timeline || 'No timeline'}
                        </span>
                        <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wider ${PRIORITY_STYLES[priority] || PRIORITY_STYLES.medium}`}>
                          <Flag size={8} className="mr-1" />
                          {priority}
                        </span>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[9px] font-black uppercase tracking-widest ${STATUS_STYLES[status] || STATUS_STYLES.pending}`}>
                        <span className="h-1.5 w-1.5 rounded-full bg-current" />
                        {status}
                      </span>
                      <span className="text-[9px] font-semibold text-slate-400 block mt-1.5">{createdDate}</span>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleEditClick(quote)}
                          className="rounded-xl border border-slate-200 bg-white p-2 text-slate-500 hover:border-sky-300 hover:text-sky-700 hover:bg-sky-50/50 transition cursor-pointer"
                          title="Edit Quote"
                        >
                          <Edit3 size={14} />
                        </button>
                        <button
                          onClick={() => handleDeleteQuote(quote.id)}
                          className="rounded-xl border border-slate-200 bg-white p-2 text-slate-500 hover:border-rose-300 hover:text-rose-600 hover:bg-rose-50/50 transition cursor-pointer"
                          title="Delete Quote"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filteredQuotes.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center py-12 text-slate-400 font-semibold italic">
                    No quotes match the filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Overlay Modal */}
      {editingQuote && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-slate-900/40 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-2xl h-full bg-white shadow-2xl flex flex-col animate-slide-in-right border-l border-slate-100">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5 shrink-0 bg-slate-50/55">
              <div>
                <h3 className="text-lg font-black text-slate-950 flex items-center gap-1.5">
                  <Edit3 size={18} className="text-sky-600" />
                  Edit Quote Specs
                </h3>
                <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Quote ID: #{editingQuote.id}</p>
              </div>
              <button 
                onClick={() => setEditingQuote(null)}
                className="rounded-xl border border-slate-200 p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
              >
                <X size={16} />
              </button>
            </div>

            {/* Modal Body Forms */}
            <form onSubmit={handleSaveSubmit} className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
              {saveError && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-xs font-bold text-red-700 flex items-start gap-2">
                  <AlertTriangle size={16} className="shrink-0 mt-0.5" />
                  <span>{saveError}</span>
                </div>
              )}

              {successMessage && (
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-xs font-bold text-emerald-700 flex items-center gap-2">
                  <CheckCircle size={16} className="shrink-0" />
                  <span>{successMessage}</span>
                </div>
              )}

              {/* Group 1: Client Information */}
              <div className="space-y-4">
                <h4 className="text-[10px] font-black uppercase tracking-wider text-sky-700 border-b border-slate-100 pb-1.5">Client Profile Data</h4>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wide text-slate-400 block mb-1">Client Full Name</label>
                    <input 
                      type="text" 
                      name="client_name"
                      value={editForm.client_name}
                      onChange={handleFormFieldChange}
                      required
                      className="w-full border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-medium focus:border-sky-400 outline-none transition"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wide text-slate-400 block mb-1">Company / Organization</label>
                    <input 
                      type="text" 
                      name="company_name"
                      value={editForm.company_name}
                      onChange={handleFormFieldChange}
                      className="w-full border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-medium focus:border-sky-400 outline-none transition"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wide text-slate-400 block mb-1">Email Address</label>
                    <input 
                      type="email" 
                      name="email"
                      value={editForm.email}
                      onChange={handleFormFieldChange}
                      required
                      className="w-full border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-medium focus:border-sky-400 outline-none transition"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wide text-slate-400 block mb-1">Phone Number</label>
                    <input 
                      type="text" 
                      name="phone"
                      value={editForm.phone}
                      onChange={handleFormFieldChange}
                      className="w-full border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-medium focus:border-sky-400 outline-none transition"
                    />
                  </div>
                </div>
              </div>

              {/* Group 2: Project Specifications */}
              <div className="space-y-4 pt-2">
                <h4 className="text-[10px] font-black uppercase tracking-wider text-sky-700 border-b border-slate-100 pb-1.5">Project Specifications</h4>
                
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wide text-slate-400 block mb-1">Project Type</label>
                    <select
                      name="project_type"
                      value={editForm.project_type}
                      onChange={handleFormFieldChange}
                      className="w-full border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-semibold text-slate-700 focus:border-sky-400 outline-none transition"
                    >
                      <option value="mobile_app">Mobile App Development</option>
                      <option value="full_website">Full Website</option>
                      <option value="ecommerce">E-commerce Platform</option>
                      <option value="lms">Learning Platform (LMS)</option>
                      <option value="custom_app">Custom Web Application</option>
                      <option value="ui_ux">UI/UX Design</option>
                      <option value="api_backend">API / Backend Integration</option>
                      <option value="maintenance">Maintenance Contract</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wide text-slate-400 block mb-1">Project Budget Option</label>
                    <input 
                      type="text" 
                      name="budget"
                      value={editForm.budget}
                      onChange={handleFormFieldChange}
                      className="w-full border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-medium focus:border-sky-400 outline-none transition"
                      placeholder="e.g. $5,000 - $10,000"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wide text-slate-400 block mb-1">Numeric Estimated Value ($)</label>
                    <input 
                      type="number" 
                      step="0.01"
                      name="estimated_amount"
                      value={editForm.estimated_amount}
                      onChange={handleFormFieldChange}
                      className="w-full border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-medium focus:border-sky-400 outline-none transition"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wide text-slate-400 block mb-1">Development Timeline</label>
                    <input 
                      type="text" 
                      name="timeline"
                      value={editForm.timeline}
                      onChange={handleFormFieldChange}
                      className="w-full border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-medium focus:border-sky-400 outline-none transition"
                      placeholder="e.g. 2 - 3 Months"
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wide text-slate-400 block mb-1">Priority Level</label>
                    <select
                      name="priority"
                      value={editForm.priority}
                      onChange={handleFormFieldChange}
                      className="w-full border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-semibold text-slate-700 focus:border-sky-400 outline-none transition"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wide text-slate-400 block mb-1">Client Industry</label>
                    <input 
                      type="text" 
                      name="industry"
                      value={editForm.industry}
                      onChange={handleFormFieldChange}
                      className="w-full border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-medium focus:border-sky-400 outline-none transition"
                      placeholder="Retail, Tech, LMS"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wide text-slate-400 block mb-1">Business Profile</label>
                    <input 
                      type="text" 
                      name="business_profile"
                      value={editForm.business_profile}
                      onChange={handleFormFieldChange}
                      className="w-full border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-medium focus:border-sky-400 outline-none transition"
                      placeholder="e.g. Established Startup"
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wide text-slate-400 block mb-1">Contact Method</label>
                    <select
                      name="contact_method"
                      value={editForm.contact_method}
                      onChange={handleFormFieldChange}
                      className="w-full border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-semibold text-slate-700 focus:border-sky-400 outline-none transition"
                    >
                      <option value="email">Email</option>
                      <option value="phone">Phone</option>
                      <option value="whatsapp">WhatsApp</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-[10px] font-bold uppercase tracking-wide text-slate-400 block mb-1">Existing Website URL</label>
                    <input 
                      type="url" 
                      name="existing_url"
                      value={editForm.existing_url}
                      onChange={handleFormFieldChange}
                      className="w-full border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-medium focus:border-sky-400 outline-none transition"
                      placeholder="https://example.com"
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wide text-slate-400 block mb-1">Referral Source</label>
                    <input 
                      type="text" 
                      name="referral_source"
                      value={editForm.referral_source}
                      onChange={handleFormFieldChange}
                      className="w-full border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-medium focus:border-sky-400 outline-none transition"
                      placeholder="Google Search, Friend, Linkedin"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wide text-slate-400 block mb-1">Admin Pipeline Status</label>
                    <select
                      name="status"
                      value={editForm.status}
                      onChange={handleFormFieldChange}
                      className="w-full border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-semibold text-slate-700 focus:border-sky-400 outline-none transition"
                    >
                      <option value="pending">Pending Review</option>
                      <option value="approved">Approved / Project Active</option>
                      <option value="deleted">Soft Deleted</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wide text-slate-400 block mb-1">Project Details / Summary</label>
                  <textarea 
                    name="project_details"
                    value={editForm.project_details}
                    onChange={handleFormFieldChange}
                    rows="2"
                    className="w-full border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-medium focus:border-sky-400 outline-none transition resize-none font-sans"
                    placeholder="Short visual description of project targets..."
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wide text-slate-400 block mb-1">Detailed Requirements</label>
                  <textarea 
                    name="requirement"
                    value={editForm.requirement}
                    onChange={handleFormFieldChange}
                    rows="4"
                    className="w-full border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-medium focus:border-sky-400 outline-none transition font-sans"
                    placeholder="Copy/paste the exact text client provided or customized details..."
                  />
                </div>
              </div>

              {/* Modal Footer actions */}
              <div className="flex gap-3 justify-end pt-4 border-t border-slate-100 shrink-0">
                <button
                  type="button"
                  onClick={() => setEditingQuote(null)}
                  className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-xs font-bold text-slate-500 hover:bg-slate-50 transition"
                >
                  Discard
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-xl bg-sky-700 px-6 py-2.5 text-xs font-bold text-white hover:bg-sky-800 transition shadow-md shadow-sky-700/10 flex items-center gap-1.5 disabled:opacity-60"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" /> Saving...
                    </>
                  ) : (
                    <>
                      <Save size={14} /> Save Changes
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
