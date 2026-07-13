import React, { useState, useEffect, useRef } from 'react';
import { 
  Terminal, Server, Database, Cpu, Activity, ShieldCheck, 
  RefreshCw, Radio, HardDrive, Wifi, Sparkles, Layers,
  ChevronRight, Play, Square, Settings, Send
} from 'lucide-react';

const TECH_NODES = [
  {
    id: 'client',
    label: 'Client Browser',
    category: 'Frontend',
    tech: 'React 18 / Tailwind v4',
    description: 'Renders the interactive dashboard UI, manages local session states, and handles web audio notification assets.',
    icon: Layers,
    color: 'from-sky-400 to-blue-500 hover:shadow-sky-500/20'
  },
  {
    id: 'cdn',
    label: 'Cloudflare Edge CDN',
    category: 'Network',
    tech: 'SSL & Edge Caching',
    description: 'Serves static assets, manages DNS, and acts as the first line of defence against network threats.',
    icon: Radio,
    color: 'from-orange-400 to-amber-500 hover:shadow-orange-500/20'
  },
  {
    id: 'api',
    label: 'API Gateway',
    category: 'Integration',
    tech: 'Laravel Routing',
    description: 'Ingresses client calls, manages CORS, handles rate limiting, and forwards valid endpoints to controllers.',
    icon: Settings,
    color: 'from-purple-500 to-indigo-600 hover:shadow-purple-500/20'
  },
  {
    id: 'auth',
    label: 'Sanctum Security',
    category: 'Security',
    tech: 'Bearer Tokens',
    description: 'Verifies authorization headers, checks session expirations, and maps requests to authenticated admins.',
    icon: ShieldCheck,
    color: 'from-emerald-400 to-teal-500 hover:shadow-emerald-500/20'
  },
  {
    id: 'backend',
    label: 'Laravel Application Engine',
    category: 'Backend',
    tech: 'PHP 8.2 / MVC',
    description: 'Executes core business logic, coordinates notifications, processes updates, and drives Eloquent ORM queries.',
    icon: Server,
    color: 'from-red-500 to-rose-600 hover:shadow-red-500/20'
  },
  {
    id: 'database',
    label: 'MySQL Database Server',
    category: 'Storage',
    tech: 'SQL Relations & Schema',
    description: 'Persists quote details, client profiles, and user accounts. Bound via native local socket connections.',
    icon: Database,
    color: 'from-cyan-500 to-blue-600 hover:shadow-cyan-500/20'
  }
];

const MOCK_LOGS = [
  "SYSTEM: Bootstrapping application container...",
  "API: Ingress request matched GET /api/me (Admin Session)",
  "SECURITY: Sanctum token validated for Admin User (Yeabsira W.)",
  "DATABASE: Connection established via socket mysql://127.0.0.1:3306",
  "CACHE: Query cache hit rate is 98.4%",
  "TELEMETRY: Latency check completed: 18ms response time",
  "API: Successful payload dispatch: 200 OK"
];

const MOCK_SERVICES = [
  { name: 'Redis Cache Server', status: 'Online', delay: '1.2ms' },
  { name: 'Node Cron Scheduler', status: 'Online', delay: '12ms' },
  { name: 'Mailtrap SMTP Sandbox', status: 'Online', delay: '42ms' },
  { name: 'Vite HMR Websocket', status: 'Online', delay: '0.8ms' }
];

export default function Yanol() {
  const [selectedNode, setSelectedNode] = useState(TECH_NODES[0]);
  const [trafficLoad, setTrafficLoad] = useState('Medium');
  const [cpuUsage, setCpuUsage] = useState(12);
  const [ramUsage, setRamUsage] = useState(48);
  const [pingLatency, setPingLatency] = useState(18);
  const [cacheHitRate, setCacheHitRate] = useState(98.4);
  const [logs, setLogs] = useState(MOCK_LOGS);
  const [isSimulating, setIsSimulating] = useState(true);
  const [isFlushing, setIsFlushing] = useState(false);
  const terminalEndRef = useRef(null);

  // Dynamic telemetry change based on traffic mode
  useEffect(() => {
    let baseCpu = 12;
    let baseRam = 48;
    let basePing = 18;
    let baseCache = 98.4;

    if (trafficLoad === 'Low') {
      baseCpu = 4;
      baseRam = 38;
      basePing = 9;
      baseCache = 99.1;
    } else if (trafficLoad === 'High') {
      baseCpu = 42;
      baseRam = 71;
      basePing = 34;
      baseCache = 96.8;
    }

    setCpuUsage(baseCpu);
    setRamUsage(baseRam);
    setPingLatency(basePing);
    setCacheHitRate(baseCache);
  }, [trafficLoad]);

  // Telemetry fluctuation simulator
  useEffect(() => {
    if (!isSimulating) return;

    const interval = setInterval(() => {
      setCpuUsage(prev => {
        const delta = Math.floor(Math.random() * 5) - 2;
        const target = trafficLoad === 'Low' ? 4 : trafficLoad === 'High' ? 42 : 12;
        return Math.max(1, Math.min(99, prev + delta));
      });
      setPingLatency(prev => {
        const delta = Math.floor(Math.random() * 3) - 1;
        return Math.max(2, prev + delta);
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [isSimulating, trafficLoad]);

  // Live Scrolling logs simulator
  useEffect(() => {
    if (!isSimulating) return;

    const verbs = ["GET", "POST", "PATCH", "DELETE", "PUT"];
    const endpoints = ["/api/quotes", "/api/clients", "/api/dashboard-stats", "/api/quotes/recent", "/api/report-stats"];
    const statuses = ["200 OK", "201 Created", "304 Not Modified", "401 Unauthorized"];
    const actions = [
      "DB: Optimized indexes on 'quotes' table",
      "SECURITY: Revoking expired tokens...",
      "SYSTEM: Allocated memory garbage collection executed successfully",
      "CACHE: Flushed stale items from RAM pool",
      "WS: Pushing state update to connected admin sockets"
    ];

    const interval = setInterval(() => {
      const isApiLog = Math.random() > 0.4;
      let newLog = '';
      
      if (isApiLog) {
        const verb = verbs[Math.floor(Math.random() * verbs.length)];
        const endpoint = endpoints[Math.floor(Math.random() * endpoints.length)];
        const status = statuses[Math.floor(Math.random() * statuses.length)];
        const time = Math.floor(Math.random() * 30) + 5;
        newLog = `API: Ingress ${verb} ${endpoint} → Response: ${status} in ${time}ms`;
      } else {
        newLog = actions[Math.floor(Math.random() * actions.length)];
      }

      const timestamp = new Date().toTimeString().split(' ')[0];
      setLogs(prev => [...prev.slice(-30), `[${timestamp}] ${newLog}`]);
    }, 2500);

    return () => clearInterval(interval);
  }, [isSimulating]);

  // Scroll to bottom on new log
  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const handleFlushCache = () => {
    setIsFlushing(true);
    const timestamp = new Date().toTimeString().split(' ')[0];
    setLogs(prev => [...prev, `[${timestamp}] SYSTEM: Initiating Redis & SQL Query Cache flush...`]);
    
    setTimeout(() => {
      setIsFlushing(false);
      setCacheHitRate(100.0);
      const doneTimestamp = new Date().toTimeString().split(' ')[0];
      setLogs(prev => [...prev, `[${doneTimestamp}] SYSTEM: Cache flushed successfully. Telemetry reset.`]);
    }, 1500);
  };

  const handlePingServer = () => {
    const timestamp = new Date().toTimeString().split(' ')[0];
    setLogs(prev => [...prev, `[${timestamp}] TELEMETRY: Outbound ICMP ping dispatched to 127.0.0.1...`]);
    setPingLatency(2);
    setTimeout(() => {
      const doneTimestamp = new Date().toTimeString().split(' ')[0];
      setLogs(prev => [...prev, `[${doneTimestamp}] TELEMETRY: Inbound reply received. Latency: 2.1ms (direct socket)`]);
    }, 600);
  };

  return (
    <div className="space-y-6">
      {/* Title section */}
      <div className="border-b border-slate-100 pb-4">
        <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-sky-600 animate-pulse" />
          Yanol Infrastructure Engine
        </h2>
        <p className="text-xs text-slate-400 font-medium mt-0.5">
          Real-time telemetry and technology stack directory mapping Yanol's operations
        </p>
      </div>

      {/* Top Section: Simulated Telemetry Dashboard */}
      <div className="grid gap-4 md:grid-cols-4">
        {/* Metric 1 */}
        <div className="rounded-2xl border border-sky-100 bg-white p-5 shadow-sm transition-all hover:border-sky-300">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Core Engine CPU</span>
            <div className="rounded-xl bg-sky-50 p-2 text-sky-600"><Cpu size={16} /></div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-800 tracking-tight">{cpuUsage}%</span>
            <span className="text-xs font-bold text-sky-600 bg-sky-50 px-1.5 py-0.5 rounded">Core 0</span>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full mt-3 overflow-hidden">
            <div 
              className={`h-full transition-all duration-1000 ${cpuUsage > 75 ? 'bg-red-500' : cpuUsage > 40 ? 'bg-amber-500' : 'bg-sky-500'}`}
              style={{ width: `${cpuUsage}%` }}
            />
          </div>
        </div>

        {/* Metric 2 */}
        <div className="rounded-2xl border border-sky-100 bg-white p-5 shadow-sm transition-all hover:border-sky-300">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">DB Cache Hit Rate</span>
            <div className="rounded-xl bg-indigo-50 p-2 text-indigo-600"><HardDrive size={16} /></div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-800 tracking-tight">{cacheHitRate}%</span>
            <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded">Fast</span>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full mt-3 overflow-hidden">
            <div 
              className="h-full bg-indigo-500 transition-all duration-1000" 
              style={{ width: `${cacheHitRate}%` }}
            />
          </div>
        </div>

        {/* Metric 3 */}
        <div className="rounded-2xl border border-sky-100 bg-white p-5 shadow-sm transition-all hover:border-sky-300">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">API Response Time</span>
            <div className="rounded-xl bg-emerald-50 p-2 text-emerald-600"><Wifi size={16} /></div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-800 tracking-tight">{pingLatency} ms</span>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">Stable</span>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full mt-3 overflow-hidden">
            <div 
              className={`h-full transition-all duration-1000 ${pingLatency > 50 ? 'bg-red-500' : 'bg-emerald-500'}`} 
              style={{ width: `${Math.max(5, Math.min(100, (100 - pingLatency)))}%` }}
            />
          </div>
        </div>

        {/* Traffic Simulation Controls */}
        <div className="rounded-2xl border border-sky-100 bg-white p-5 shadow-sm transition-all hover:border-sky-300 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Simulation Control</span>
            <div className="flex gap-1.5">
              <button 
                onClick={() => setIsSimulating(!isSimulating)}
                className={`rounded-lg p-1.5 transition ${isSimulating ? 'bg-rose-50 text-rose-600 hover:bg-rose-100' : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'}`}
                title={isSimulating ? "Stop Simulation" : "Start Simulation"}
              >
                {isSimulating ? <Square size={12} /> : <Play size={12} />}
              </button>
            </div>
          </div>
          
          <div className="mt-2.5">
            <p className="text-[10px] font-bold text-slate-400 mb-1">Set Network Load</p>
            <div className="grid grid-cols-3 gap-1 rounded-xl bg-slate-100 p-1">
              {['Low', 'Medium', 'High'].map(load => (
                <button
                  key={load}
                  onClick={() => setTrafficLoad(load)}
                  className={`rounded-lg py-1 text-[10px] font-bold transition-all ${trafficLoad === load ? 'bg-white text-sky-800 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
                >
                  {load}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Middle Section: Architecture Map & Interactive Details */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Architecture Node Grid */}
        <div className="rounded-2xl border border-sky-100 bg-white p-6 shadow-sm lg:col-span-2 space-y-6">
          <div>
            <h3 className="text-base font-black text-sky-950 flex items-center gap-1.5">
              <Activity size={18} className="text-sky-600" />
              Interactive Architecture Map
            </h3>
            <p className="text-xs text-slate-400 font-medium">Click on nodes to query structural integrations</p>
          </div>

          <div className="grid grid-cols-2 gap-4 relative">
            {TECH_NODES.map((node, i) => {
              const Icon = node.icon;
              const isSelected = selectedNode.id === node.id;
              return (
                <button
                  key={node.id}
                  onClick={() => setSelectedNode(node)}
                  className={`flex items-start gap-3 rounded-2xl border p-4 text-left transition-all duration-300 relative group cursor-pointer ${
                    isSelected 
                      ? 'border-sky-500 bg-sky-50/50 shadow-md ring-2 ring-sky-500/20' 
                      : 'border-slate-100 bg-white hover:border-sky-200 hover:shadow-sm'
                  }`}
                >
                  <div className={`rounded-xl bg-gradient-to-br ${node.color} p-2.5 text-white shadow-sm transition-transform group-hover:scale-105`}>
                    <Icon size={18} />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">{node.category}</span>
                    <h4 className="font-extrabold text-sm text-slate-800 group-hover:text-sky-950 transition-colors mt-0.5 truncate">{node.label}</h4>
                    <p className="text-[10px] font-semibold text-sky-700 mt-1">{node.tech}</p>
                  </div>
                  
                  {isSelected && (
                    <div className="absolute right-3 top-3 h-2 w-2 rounded-full bg-sky-500 animate-ping" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Node Detail Card */}
        <div className="rounded-2xl border border-sky-100 bg-white p-6 shadow-sm flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="text-[10px] font-black uppercase tracking-widest text-sky-600 bg-sky-50 px-2.5 py-0.5 rounded-lg border border-sky-100">
                Node Properties
              </span>
              <span className="text-[10px] font-extrabold text-slate-400">ID: {selectedNode.id}</span>
            </div>
            
            <div className="flex items-center gap-3">
              <div className={`rounded-2xl bg-gradient-to-br ${selectedNode.color} p-3 text-white shadow-md`}>
                {React.createElement(selectedNode.icon, { size: 24 })}
              </div>
              <div>
                <h4 className="font-black text-slate-800 text-base">{selectedNode.label}</h4>
                <p className="text-xs font-bold text-sky-700">{selectedNode.tech}</p>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <div>
                <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Classification</span>
                <p className="text-xs font-semibold text-slate-700 mt-0.5">{selectedNode.category} Service Layer</p>
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Functional Role</span>
                <p className="text-xs font-semibold text-slate-600 mt-1 leading-relaxed">{selectedNode.description}</p>
              </div>
            </div>
          </div>

          <div className="mt-6 border-t border-slate-100/80 pt-4 flex gap-2">
            <button 
              onClick={handleFlushCache}
              disabled={isFlushing}
              className="flex-1 flex items-center justify-center gap-1.5 rounded-xl border border-sky-100 bg-white py-2 text-xs font-bold text-sky-700 hover:bg-sky-50 active:scale-95 transition disabled:opacity-50"
            >
              <RefreshCw size={13} className={isFlushing ? 'animate-spin' : ''} />
              Flush Cache
            </button>
            <button 
              onClick={handlePingServer}
              className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-sky-700 py-2 text-xs font-bold text-white hover:bg-sky-800 active:scale-95 transition shadow-sm"
            >
              <Send size={12} />
              Ping Socket
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Section: Operations Console & System Services */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Terminal log console */}
        <div className="rounded-2xl border border-sky-100 bg-slate-900 p-5 shadow-inner lg:col-span-2 flex flex-col h-[280px]">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2.5 mb-3">
            <div className="flex items-center gap-2">
              <div className="flex gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
                <span className="h-2.5 w-2.5 rounded-full bg-amber-500/80" />
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/80" />
              </div>
              <span className="text-[10px] font-bold text-slate-500 font-mono tracking-tight ml-1">system_operations_logger.sh</span>
            </div>
            <div className="flex items-center gap-1 text-[9px] font-bold text-emerald-500/80 font-mono uppercase bg-emerald-950/50 border border-emerald-900/50 px-2 py-0.5 rounded">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping inline-block mr-1" />
              Active Logger
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto font-mono text-[11px] text-slate-300 space-y-1.5 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
            {logs.map((log, index) => {
              let colorClass = 'text-slate-300';
              if (log.includes('SYSTEM:')) colorClass = 'text-amber-400';
              if (log.includes('SECURITY:')) colorClass = 'text-emerald-400';
              if (log.includes('API:')) colorClass = 'text-sky-400';
              if (log.includes('DATABASE:')) colorClass = 'text-cyan-400';
              return (
                <div key={index} className="flex gap-2">
                  <span className="text-slate-600 select-none">{String(index + 1).padStart(2, '0')}</span>
                  <p className={`${colorClass} whitespace-pre-line leading-relaxed`}>{log}</p>
                </div>
              );
            })}
            <div ref={terminalEndRef} />
          </div>
        </div>

        {/* Services Status Dashboard */}
        <div className="rounded-2xl border border-sky-100 bg-white p-5 shadow-sm flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="text-sm font-black text-sky-950 flex items-center gap-1.5">
              <HardDrive size={16} className="text-sky-600" />
              Core Background Threads
            </h3>
            
            <div className="space-y-3.5">
              {MOCK_SERVICES.map((srv, idx) => (
                <div key={idx} className="flex items-center justify-between border-b border-slate-50 pb-2">
                  <div>
                    <h5 className="text-xs font-bold text-slate-700">{srv.name}</h5>
                    <p className="text-[10px] font-semibold text-slate-400">Response Offset: {srv.delay}</p>
                  </div>
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[9px] font-black uppercase text-emerald-600 border border-emerald-200">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    {srv.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="text-[10px] text-slate-400 font-semibold text-center border-t border-slate-100 pt-3 flex items-center justify-center gap-1">
            <Activity size={10} className="text-emerald-500 animate-pulse" />
            Telemetry services reporting healthy: 100% SLA uptime
          </div>
        </div>
      </div>
    </div>
  );
}
