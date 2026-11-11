import { TrendingUp, TrendingDown, MapPin } from 'lucide-react'

const riskConfig = {
  Critical: { color: 'text-red-400', bg: 'bg-red-500/10', badge: 'bg-red-500 text-white', bar: 'bg-red-500' },
  High: { color: 'text-orange-400', bg: 'bg-orange-500/10', badge: 'bg-orange-500 text-white', bar: 'bg-orange-500' },
  Medium: { color: 'text-amber-400', bg: 'bg-amber-500/10', badge: 'bg-amber-500 text-white', bar: 'bg-amber-500' },
  Low: { color: 'text-emerald-400', bg: 'bg-emerald-500/10', badge: 'bg-emerald-500/20 text-emerald-400', bar: 'bg-emerald-500' },
}

export default function AccidentProneLocations({ locations }) {
  const maxAccidents = locations ? Math.max(...locations.map(l => l.accidents)) : 1

  return (
    <div className="glass-card p-5 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-white font-semibold text-sm">Accident Prone Locations</h3>
          <p className="text-gray-500 text-xs mt-0.5">Top risk hotspots</p>
        </div>
        <div className="text-xs text-gray-500 bg-[#111827]/60 px-2 py-1 rounded border border-[#1e3a5f]/20">
          Last 30 days
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-2 pr-1">
        {(locations || []).map((loc, idx) => {
          const cfg = riskConfig[loc.riskLevel] || riskConfig.Medium
          const pct = Math.round((loc.accidents / maxAccidents) * 100)
          return (
            <div key={idx} className="flex items-center gap-3 p-2.5 rounded-lg bg-[#111827]/40 border border-[#1e3a5f]/20 hover:border-[#1e3a5f]/40 transition-all">
              <div className="flex items-center justify-center w-6 h-6 rounded bg-[#1e3a5f]/40 text-xs font-bold text-gray-400 shrink-0">
                {idx + 1}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <div className="flex items-center gap-1 min-w-0">
                    <MapPin className="w-3 h-3 text-gray-500 shrink-0" />
                    <span className="text-xs text-gray-300 truncate">{loc.name}</span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${cfg.badge}`}>
                      {loc.riskLevel}
                    </span>
                    <span className="text-xs font-bold text-white">{loc.accidents}</span>
                    {loc.trend === 'up' ? (
                      <TrendingUp className="w-3 h-3 text-red-400" />
                    ) : (
                      <TrendingDown className="w-3 h-3 text-emerald-400" />
                    )}
                  </div>
                </div>
                <div className="w-full bg-[#1e3a5f]/30 rounded-full h-1">
                  <div
                    className={`h-1 rounded-full ${cfg.bar} transition-all duration-500`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
