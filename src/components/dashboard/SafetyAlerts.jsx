import { AlertTriangle, Car, CloudLightning, Shield, MapPin, Clock, ChevronRight } from 'lucide-react'

const severityConfig = {
  critical: { color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20', badge: 'bg-red-500/20 text-red-400' },
  high: { color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/20', badge: 'bg-orange-500/20 text-orange-400' },
  medium: { color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20', badge: 'bg-amber-500/20 text-amber-400' },
  low: { color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', badge: 'bg-emerald-500/20 text-emerald-400' },
}

const typeIcons = {
  accident: Car,
  weather: CloudLightning,
  patrol: Shield,
  congestion: AlertTriangle,
  construction: AlertTriangle,
  hazard: AlertTriangle,
}

export default function SafetyAlerts({ alerts, onViewAll }) {
  return (
    <div className="glass-card p-5 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-white font-semibold text-sm">Safety Alerts</h3>
          <p className="text-gray-500 text-xs mt-0.5">Recent incidents & warnings</p>
        </div>
        <button
          onClick={onViewAll}
          className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors"
        >
          View All <ChevronRight className="w-3 h-3" />
        </button>
      </div>

      <div className="flex-1 space-y-2 overflow-y-auto pr-1">
        {(alerts || []).slice(0, 6).map((alert) => {
          const cfg = severityConfig[alert.severity] || severityConfig.medium
          const Icon = typeIcons[alert.type] || AlertTriangle
          return (
            <div
              key={alert.id}
              className={`flex items-start gap-3 p-3 rounded-lg border ${cfg.bg} ${cfg.border} transition-all duration-300 hover:scale-[1.01]`}
            >
              <div className={`w-8 h-8 rounded-lg ${cfg.bg} border ${cfg.border} flex items-center justify-center shrink-0`}>
                <Icon className={`w-4 h-4 ${cfg.color}`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-0.5">
                  <span className={`text-[10px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded ${cfg.badge}`}>
                    {alert.severity}
                  </span>
                  <span className="text-[10px] text-gray-500 flex items-center gap-1 shrink-0">
                    <Clock className="w-3 h-3" />
                    {alert.time}
                  </span>
                </div>
                <p className="text-xs text-gray-300 leading-tight truncate">{alert.message}</p>
                <div className="flex items-center gap-1 mt-1">
                  <MapPin className="w-3 h-3 text-gray-500" />
                  <span className="text-[10px] text-gray-500 truncate">{alert.location}</span>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
