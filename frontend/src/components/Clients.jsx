import React, { useState, useEffect } from 'react';
import { Mail, Phone, Building, Layers } from 'lucide-react';

export default function Clients({ searchTerm = '' }) {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
  
    fetch('http://127.0.0.1:8000/api/clients', {
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })
      .then((res) => {
        if (!res.ok) throw new Error(`Clients failed with status: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        setClients(Array.isArray(data) ? data : data.clients || []);
        setError(null);
      })
      .catch((err) => {
        console.error('Error fetching customer streams:', err);
        setError(err.message);
      })
      .finally(() => setLoading(false));
  }, []);

  // Extremely safe local text array processing
  const filteredClients = Array.isArray(clients)
    ? clients.filter(client => {
        const query = searchTerm?.toLowerCase() || '';
        return (
          client?.name?.toLowerCase().includes(query) ||
          client?.company?.toLowerCase().includes(query) ||
          client?.email?.toLowerCase().includes(query)
        );
      })
    : [];

  if (loading) {
    return <div className="text-center py-12 font-bold text-slate-400">Querying system database records...</div>;
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-100 bg-red-50 p-6 text-center text-red-700">
        <p className="font-bold">Clients Sync Failed</p>
        <p className="text-xs mt-1 text-red-500">Check endpoint mapping: GET http://127.0.0.1:8000/api/clients</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-black text-sky-950">Client Directory</h2>
        <p className="text-xs text-slate-400 font-medium">Manage corporate profiles and view linked quotes</p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {filteredClients.map((client) => (
          <div key={client.id} className="rounded-2xl border border-sky-100 bg-white p-5 shadow-sm hover:border-sky-300 transition-all duration-200 flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between gap-2 mb-4">
                <div>
                  <h4 className="font-black text-base text-slate-800 tracking-tight">{client.name || 'Anonymous User'}</h4>
                  <p className="text-xs font-bold text-sky-700 flex items-center gap-1 mt-0.5">
                    <Building size={12} />
                    {client.company || 'Individual Account'}
                  </p>
                </div>
                <div className="rounded-xl bg-sky-50 p-2 text-sky-700 shrink-0">
                  <Layers size={18} />
                </div>
              </div>

              <div className="space-y-2 text-xs font-medium text-slate-500 border-t border-sky-50 pt-3">
                <div className="flex items-center gap-2">
                  <Mail size={14} className="text-slate-400" />
                  <span className="truncate">{client.email || 'No email saved'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone size={14} className="text-slate-400" />
                  <span>{client.phone || 'No phone provided'}</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-sky-50 flex items-center justify-between text-xs">
              <span className="text-slate-400 font-bold">Active Quotes</span>
              <span className="rounded-full bg-slate-100 px-2 py-0.5 font-black text-slate-700">
                {client.quotes_count !== undefined ? client.quotes_count : (client.quotes?.length || 0)}
              </span>
            </div>
          </div>
        ))}

        {filteredClients.length === 0 && (
          <div className="col-span-full text-center py-12 font-bold text-slate-400">
            No matching profiles located in database tables.
          </div>
        )}
      </div>
    </div>
  );
}