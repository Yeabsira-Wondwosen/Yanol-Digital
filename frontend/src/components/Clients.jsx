import React, { useEffect, useMemo, useState } from 'react';
import api from '../services/api.js';
import DeleteConfirmModal from './DeleteConfirmModal';
import {
  Mail, Phone, Building, Layers, Loader2, AlertCircle, Users,
  ChevronDown, Clock3, CheckCircle2, Trash2, RotateCcw, Calendar,
  DollarSign, Globe2, Flag, Briefcase,
} from 'lucide-react';

const STATUS_TABS = [
  { value: 'all', label: 'All' },
  { value: 'pending', label: 'Pending' },
  { value: 'approved', label: 'Approved' },
  { value: 'deleted', label: 'Deleted' },
];

const STATUS_STYLES = {
  pending: {
    badge: 'bg-amber-50 text-amber-700 border-amber-200',
    dot: 'bg-amber-500',
    icon: Clock3,
  },
  approved: {
    badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    dot: 'bg-emerald-500',
    icon: CheckCircle2,
  },
  deleted: {
    badge: 'bg-red-50 text-red-600 border-red-200',
    dot: 'bg-red-500',
    icon: Trash2,
  },
};

function StatusBadge({ status }) {
  const s = STATUS_STYLES[status] || STATUS_STYLES.pending;
  const Icon = s.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide ${s.badge}`}>
      <Icon size={12} />
      {status || 'pending'}
    </span>
  );
}

export default function Clients({ clients = [], setClients, searchTerm = '', refreshTrigger, newQuoteId, clearNewQuoteId }) {
  // --- CUSTOM STATE FOR DELETE CONFIRMATION MODAL ---
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [quoteToDelete, setQuoteToDelete] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [expandedClient, setExpandedClient] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  const loadDatabaseQuotes = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/quotes');
      const quotes = Array.isArray(response.data) ? response.data : (response.data?.data || []);

      const clientMap = new Map();
      quotes.forEach((q, index) => {
        // Build a strict unique key for grouping
        const key = q.email || q.client_name || q.name || `anonymous-${index}`;

        if (!clientMap.has(key)) {
          clientMap.set(key, {
            // Assign a guaranteed unique ID for state tracking
            id: q.client_id || `client-${index}-${q.id}`,
            name: q.client_name || q.name || 'Anonymous User',
            company: q.company_name || q.company || '',
            email: q.email || '',
            phone: q.phone || '',
            quotes: [],
          });
        }
        clientMap.get(key).quotes.push({
          id: q.id,
          status: (q.status || 'pending').toLowerCase(),
          project_type: q.project_type,
          budget: q.budget,
          timeline: q.timeline,
          priority: q.priority,
          industry: q.industry,
          business_profile: q.business_profile,
          contact_method: q.contact_method,
          existing_url: q.existing_url,
          referral_source: q.referral_source,
          requirement: q.requirement,
          project_details: q.project_details,
          created_at: q.created_at,
          client_name: q.client_name || q.name || 'Anonymous User'
        });
      });

      const grouped = Array.from(clientMap.values()).map((c) => ({
        ...c,
        quotes_count: c.quotes.length,
      }));

      if (setClients) {
        setClients(grouped);
      }

      if (newQuoteId) {
        const clientWithNewQuote = grouped.find(c => c.quotes.some(q => q.id === newQuoteId));
        if (clientWithNewQuote) {
          setExpandedClient(clientWithNewQuote.id);
          setTimeout(() => {
            const el = document.getElementById(`quote-card-${newQuoteId}`);
            if (el) {
              el.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
          }, 300);

          setTimeout(() => {
            if (clearNewQuoteId) clearNewQuoteId();
          }, 5000);
        }
      }
    } catch (err) {
      console.error("Failed to load records from MySQL:", err);
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDatabaseQuotes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshTrigger]);

  const updateQuoteStatus = async (quoteId, newStatus) => {
    setUpdatingId(quoteId);
    try {
      await api.patch(`/quotes/${quoteId}`, { status: newStatus });
      if (setClients) {
        setClients((prev) =>
          (prev || []).map((client) => ({
            ...client,
            quotes: (client.quotes || []).map((q) =>
              q.id === quoteId ? { ...q, status: newStatus } : q
            ),
          }))
        );
      }
    } catch (err) {
      console.error('Failed to update quote status:', err);
      alert(err.response?.data?.message || 'Could not update status.');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleConfirmDelete = async () => {
    if (!quoteToDelete) return;
    const targetId = quoteToDelete.id;

    setUpdatingId(targetId);
    setDeleteModalOpen(false);

    try {
      await api.delete(`/quotes/${targetId}`);
      if (setClients) {
        setClients((prev) =>
          (prev || [])
            .map((client) => ({
              ...client,
              quotes: (client.quotes || []).filter((q) => q.id !== targetId),
            }))
            .filter((client) => (client.quotes || []).length > 0)
        );
      }
    } catch (err) {
      console.error('Failed to delete quote:', err);
      alert(err.response?.data?.message || 'Could not delete quote.');
    } finally {
      setUpdatingId(null);
      setQuoteToDelete(null);
    }
  };

  const safeClientsState = Array.isArray(clients) ? clients : [];

  const filteredClients = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return safeClientsState
      .map((client) => {
        const quotes = statusFilter === 'all'
          ? (client.quotes || [])
          : (client.quotes || []).filter((q) => q.status === statusFilter);
        return { ...client, visibleQuotes: quotes };
      })
      .filter((client) => {
        const matchesSearch =
          (client.name?.toLowerCase() || '').includes(term) ||
          (client.company?.toLowerCase() || '').includes(term) ||
          (client.email?.toLowerCase() || '').includes(term);
        const matchesStatus = statusFilter === 'all' || client.visibleQuotes.length > 0;
        return matchesSearch && matchesStatus;
      });
  }, [safeClientsState, searchTerm, statusFilter]);

  const statusCounts = useMemo(() => {
    const counts = { all: 0, pending: 0, approved: 0, deleted: 0 };
    safeClientsState.forEach((c) => {
      (c.quotes || []).forEach((q) => {
        counts.all += 1;
        if (q.status in counts) {
          counts[q.status] += 1;
        }
      });
    });
    return counts;
  }, [safeClientsState]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4 animate-pulse">
        <Loader2 className="w-8 h-8 text-sky-600 animate-spin" />
        <p className="text-sm font-semibold text-slate-500 tracking-wide">
          Querying system database records...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-100 bg-red-50/50 p-6 max-w-xl mx-auto text-center shadow-sm backdrop-blur-sm">
        <div className="flex justify-center mb-3">
          <AlertCircle className="w-10 h-10 text-red-500" />
        </div>
        <h3 className="font-bold text-slate-800 text-lg">Clients Sync Failed</h3>
        <p className="text-sm text-red-600 mt-1">
          Check endpoint mapping: <code className="bg-red-100/80 px-1.5 py-0.5 rounded font-mono text-xs text-red-700">GET /api/quotes</code>
        </p>
        <p className="text-xs text-slate-400 mt-3 font-medium">Error details: {error}</p>
        <button
          onClick={loadDatabaseQuotes}
          className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-red-600 px-4 py-2 text-xs font-bold text-white hover:bg-red-700 transition"
        >
          <RotateCcw size={13} /> Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Directory Header */}
      <div className="flex flex-col gap-4 border-b border-slate-100 pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Users className="w-6 h-6 text-sky-600" />
            Client Directory
          </h2>
          <p className="text-xs text-slate-400 font-medium mt-0.5">
            Manage corporate profiles and review linked quotes
          </p>
        </div>
        <span className="text-xs font-bold text-sky-700 bg-sky-50 px-2.5 py-1 rounded-lg border border-sky-100 w-fit">
          Total Clients: {filteredClients.length}
        </span>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {STATUS_TABS.map((tab) => {
          const active = statusFilter === tab.value;
          const style = STATUS_STYLES[tab.value];
          return (
            <button
              key={tab.value}
              onClick={() => setStatusFilter(tab.value)}
              className={`flex items-center gap-2 rounded-xl border px-4 py-2 text-xs font-bold transition ${active
                ? 'border-sky-500 bg-sky-600 text-white shadow-sm'
                : 'border-slate-200 bg-white text-slate-500 hover:border-sky-200 hover:text-sky-700'
                }`}
            >
              {style && <span className={`h-1.5 w-1.5 rounded-full ${active ? 'bg-white' : style.dot}`} />}
              {tab.label}
              <span className={`rounded-full px-1.5 py-0.5 text-[10px] ${active ? 'bg-white/20' : 'bg-slate-100 text-slate-500'}`}>
                {statusCounts[tab.value] || 0}
              </span>
            </button>
          );
        })}
      </div>

      {/* Grid Layout */}
      <div className="grid gap-5 lg:grid-cols-2">
        {filteredClients.map((client, index) => {
          // Use index fallback to ensure matching state elements do not share keys
          const cleanId = client.id || `client-row-${index}`;
          const isExpanded = expandedClient === cleanId;

          return (
            <div
              key={cleanId}
              className="group rounded-2xl border border-slate-100 bg-white p-5 shadow-sm hover:shadow-md hover:border-sky-200 transition-all duration-300 relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-[3px] bg-sky-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />

              <button
                onClick={() => setExpandedClient(isExpanded ? null : cleanId)}
                className="w-full text-left"
              >
                <div className="flex items-start justify-between gap-2 mb-4">
                  <div>
                    <h4 className="font-bold text-base text-slate-800 tracking-tight group-hover:text-sky-950 transition-colors">
                      {client.name || 'Anonymous User'}
                    </h4>
                    <p className="text-xs font-bold text-sky-700 flex items-center gap-1 mt-1">
                      <Building size={12} />
                      {client.company || 'Individual Account'}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <div className="rounded-xl bg-slate-50 p-2 text-slate-400 group-hover:bg-sky-50 group-hover:text-sky-600 transition-colors">
                      <Layers size={18} />
                    </div>
                    <ChevronDown
                      size={18}
                      className={`text-slate-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                    />
                  </div>
                </div>

                <div className="space-y-2 text-xs font-medium text-slate-500 border-t border-slate-50 pt-3">
                  <div className="flex items-center gap-2.5">
                    <Mail size={14} className="text-slate-400" />
                    <span className="truncate" title={client.email}>
                      {client.email || 'No email saved'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Phone size={14} className="text-slate-400" />
                    <span>{client.phone || 'No phone provided'}</span>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-50 flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-bold tracking-wide uppercase text-[10px]">
                    {statusFilter === 'all' ? 'Total Quotes' : `${statusFilter} Quotes`}
                  </span>
                  <span className="rounded-full bg-slate-100 px-2.5 py-0.5 font-extrabold text-slate-700 group-hover:bg-sky-600 group-hover:text-white transition-all">
                    {client.visibleQuotes.length}
                  </span>
                </div>
              </button>

              {/* Expanded quote list */}
              {isExpanded && (
                <div className="mt-4 space-y-3 border-t border-slate-100 pt-4">
                  {client.visibleQuotes.length === 0 && (
                    <p className="text-xs text-slate-400 italic">No quotes match this filter.</p>
                  )}
                  {client.visibleQuotes.map((q) => (
                    <QuoteCard
                      key={q.id}
                      quote={q}
                      updating={updatingId === q.id}
                      onUpdateStatus={(status) => updateQuoteStatus(q.id, status)}
                      onDelete={() => {
                        setQuoteToDelete(q);
                        setDeleteModalOpen(true);
                      }}
                      newQuoteId={newQuoteId}
                    />
                  ))}
                </div>
              )}
            </div>
          );
        })}

        {filteredClients.length === 0 && (
          <div className="col-span-full text-center py-16 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
            <Users className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="font-semibold text-slate-500 text-sm">No matching profiles located.</p>
            <p className="text-xs text-slate-400 mt-0.5">Try refining your search or status filter.</p>
          </div>
        )}
      </div>

      {/* --- REUSABLE DELETE CONFIRMATION MODAL COMPONENT --- */}
      <DeleteConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setQuoteToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        clientName={quoteToDelete?.client_name}
      />
    </div>
  );
}

function QuoteCard({ quote, updating, onUpdateStatus, onDelete, newQuoteId }) {
  const createdLabel = quote.created_at
    ? new Date(quote.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
    : null;

  const isNew = quote.id === newQuoteId;

  return (
    <div
      id={`quote-card-${quote.id}`}
      className={`rounded-xl border p-4 space-y-3 transition-all duration-500 ${isNew
        ? 'bg-sky-50/80 border-sky-400 ring-2 ring-sky-400/50'
        : 'border-slate-100 bg-slate-50/60'
        }`}
    >
      <div className="flex items-center justify-between gap-2">
        <StatusBadge status={quote.status} />
        {createdLabel && (
          <span className="flex items-center gap-1 text-[11px] font-medium text-slate-400">
            <Calendar size={11} /> {createdLabel}
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-[11px] text-slate-600">
        <DetailRow icon={Briefcase} label="Project type" value={quote.project_type} />
        <DetailRow icon={DollarSign} label="Budget" value={quote.budget} />
        <DetailRow icon={Clock3} label="Timeline" value={quote.timeline} />
        <DetailRow icon={Flag} label="Priority" value={quote.priority} />
        <DetailRow icon={Building} label="Industry" value={quote.industry} />
        <DetailRow icon={Users} label="Business type" value={quote.business_profile} />
        {quote.existing_url && (
          <DetailRow icon={Globe2} label="Website" value={quote.existing_url} />
        )}
        {quote.referral_source && (
          <DetailRow icon={Mail} label="Referral" value={quote.referral_source} />
        )}
      </div>

      {quote.requirement && (
        <div className="rounded-lg bg-white border border-slate-100 px-3 py-2">
          <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400 mb-1">Requirements</p>
          <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line">{quote.requirement}</p>
        </div>
      )}

      <div className="flex flex-wrap gap-2 pt-1">
        <ActionButton
          label="Pending"
          active={quote.status === 'pending'}
          disabled={updating}
          onClick={() => onUpdateStatus('pending')}
          colorClass="border-amber-200 text-amber-700 hover:bg-amber-50"
          activeClass="bg-amber-500 text-white border-amber-500"
        />
        <ActionButton
          label="Approve"
          active={quote.status === 'approved'}
          disabled={updating}
          onClick={() => onUpdateStatus('approved')}
          colorClass="border-emerald-200 text-emerald-700 hover:bg-emerald-50"
          activeClass="bg-emerald-500 text-white border-emerald-500"
        />
        <ActionButton
          label="Delete"
          active={false}
          disabled={updating}
          onClick={onDelete}
          colorClass="border-red-200 text-red-600 hover:bg-red-50"
          activeClass="bg-red-500 text-white border-red-500"
        />
        {updating && <Loader2 className="w-4 h-4 text-slate-400 animate-spin self-center" />}
      </div>
    </div>
  );
}

function DetailRow({ icon: Icon, label, value }) {
  if (!value) return null;
  return (
    <div className="flex items-start gap-1.5">
      <Icon size={12} className="text-slate-400 mt-0.5 shrink-0" />
      <span>
        <span className="text-slate-400">{label}: </span>
        <span className="font-semibold text-slate-700">{value}</span>
      </span>
    </div>
  );
}

function ActionButton({ label, active, disabled, onClick, colorClass, activeClass }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`rounded-lg border px-3 py-1.5 text-[11px] font-bold transition disabled:cursor-not-allowed disabled:opacity-50 ${active ? activeClass : `bg-white ${colorClass}`
        }`}
    >
      {label}
    </button>
  );
}