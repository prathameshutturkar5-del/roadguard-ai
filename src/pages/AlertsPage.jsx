import { useState } from 'react'
import { Search, AlertTriangle, Car, CloudLightning, Shield, MapPin, Clock, CheckCircle, Eye, ChevronDown, ChevronUp } from 'lucide-react'

const severityConfig = {
  critical: { color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/30', badge: 'bg-red-500 text-white' },
  high: { color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/30', badge: 'bg-orange-500 text-white' },
  medium: { color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/30', badge: 'bg-amber-500/20 text-amber-400' },
  low: { color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', badge: 'bg-emerald-500/20 text-emerald-400' },
}

const statusConfig = {
  active: { color: 'text-red-400', bg: 'bg-red-500/10 border border-red-500/20' },
  investigating: { color: 'text-amber-400', bg: 'bg-amber-500/10 border border-amber-500/20' },
  resolved: { color: 'text-emerald-400', bg: 'bg-emerald-500/10 border border-emerald-500/20' },
}

const typeIcons = {
  accident: Car,
  weather: CloudLightning,
  patrol: Shield,
  congestion: AlertTriangle,
  construction: AlertTriangle,
  hazard: AlertTriangle,
}

export default function AlertsPage({ alerts, setAlerts }) {
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [expanded, setExpanded] = useState(null)
  const [page, setPage] = useState(1)
  const perPage = 5

  const filtered = (alerts || []).filter(a => {
    const matchSeverity = filter === 'all' || a.severity === filter
    const matchSearch = !search || a.message.toLowerCase().includes(search.toLowerCase()) || a.location.toLowerCase().includes(search.toLowerCase())
    return matchSeverity && matchSearch
  })

  const paginated = filtered.slice((page - 1) * perPage, page * perPage)
  const totalPages = Math.ceil(filtered.length / perPage)

  const handleAcknowledge = (id) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, status: 'investigating' } : a))
  }
  const handleResolve = (id) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, status: 'resolved' } : a))
  }

  return (
    <div className="p-6 space-y-5">
      {/* Summary cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {['critical', 'high', 'medium', 'low'].map(sev => {
          const count = (alerts || []).filter(a => a.severity === sev).length
          const cfg = severityConfig[sev]
          return (
            <div key={sev} className={`glass-card p-4 cursor-pointer transition-all hover:scale-[1.02] ${cfg.bg} ${cfg.border}`} onClick={() => setFilter(sev === filter ? 'all' : sev)}>
              <div className="text-xs font-medium text-gray-500 uppercase mb-1">{sev}</div>
              <div className={`text-3xl font-bold ${cfg.color}`}>{count}</div>
              <div className="text-xs text-gray-500 mt-1">alerts</div>
            </div>
          )
        })}
      </div>

      {/* Filter bar */}
      <div className="glass-card p-4 flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="flex gap-2 flex-wrap">
          {['all', 'critical', 'high', 'medium', 'low'].map(f => (
            <button
              key={f}
              onClick={() => { setFilter(f); setPage(1) }}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors ${
                filter === f
                  ? 'bg-blue-500/20 border border-blue-500/30 text-blue-400'
                  : 'bg-[#111827] border border-[#1e3a5f]/30 text-gray-400 hover:text-gray-200'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search alerts..."
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1) }}
            className="bg-[#111827] border border-[#1e3a5f]/30 rounded-lg pl-9 pr-4 py-2 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-blue-500/50 w-56"
          />
        </div>
      </div>

      {/* Alert list */}
      <div className="space-y-3">
        {paginated.map(alert => {
          const cfg = severityConfig[alert.severity] || severityConfig.medium
          const stCfg = statusConfig[alert.status] || statusConfig.active
          const Icon = typeIcons[alert.type] || AlertTriangle
          const isExpanded = expanded === alert.id

          return (
            <div key={alert.id} className={`glass-card overflow-hidden border ${cfg.border}`}>
              <div
                className={`flex items-center gap-4 p-4 cursor-pointer hover:bg-[#1e3a5f]/10 transition-colors`}
                onClick={() => setExpanded(isExpanded ? null : alert.id)}
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${cfg.bg} border ${cfg.border}`}>
                  <Icon className={`w-5 h-5 ${cfg.color}`} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${cfg.badge}`}>{alert.severity}</span>
                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded capitalize ${stCfg.bg} ${stCfg.color}`}>{alert.status}</span>
                    <span className="text-[10px] text-gray-500 flex items-center gap-1 ml-auto">
                      <Clock className="w-3 h-3" /> {alert.time}
                    </span>
                  </div>
                  <p className="text-sm text-gray-200 truncate">{alert.message}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <MapPin className="w-3 h-3 text-gray-500" />
                    <span className="text-xs text-gray-500 truncate">{alert.location}</span>
                  </div>
                </div>

                <div className="shrink-0">
                  {isExpanded ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                </div>
              </div>

              {isExpanded && (
                <div className="border-t border-[#1e3a5f]/30 p-4 bg-[#111827]/30">
                  <div className="grid grid-cols-2 gap-3 mb-4 text-xs">
                    <div><span className="text-gray-500">Alert ID:</span> <span className="text-gray-200 font-mono">RG-2026-{String(alert.id).padStart(4, '0')}</span></div>
                    <div><span className="text-gray-500">Type:</span> <span className="text-gray-200 capitalize">{alert.type}</span></div>
                    <div><span className="text-gray-500">Responding Units:</span> <span className="text-gray-200">{alert.units} unit{alert.units > 1 ? 's' : ''}</span></div>
                    <div><span className="text-gray-500">Status:</span> <span className={`capitalize font-medium ${stCfg.color}`}>{alert.status}</span></div>
                  </div>
                  <div className="flex gap-2">
                    {alert.status === 'active' && (
                      <button
                        onClick={() => handleAcknowledge(alert.id)}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/20 border border-amber-500/30 rounded-lg text-xs text-amber-400 hover:bg-amber-500/30 transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" /> Acknowledge
                      </button>
                    )}
                    {alert.status !== 'resolved' && (
                      <button
                        onClick={() => handleResolve(alert.id)}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/20 border border-emerald-500/30 rounded-lg text-xs text-emerald-400 hover:bg-emerald-500/30 transition-colors"
                      >
                        <CheckCircle className="w-3.5 h-3.5" /> Resolve
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          )
        })}

        {paginated.length === 0 && (
          <div className="glass-card p-10 text-center">
            <Shield className="w-10 h-10 text-gray-600 mx-auto mb-3" />
            <p className="text-gray-500">No alerts match your filters</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`w-8 h-8 rounded-lg text-xs font-medium transition-colors ${
                page === i + 1
                  ? 'bg-blue-500/20 border border-blue-500/30 text-blue-400'
                  : 'bg-[#111827] border border-[#1e3a5f]/30 text-gray-400 hover:text-gray-200'
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
