import { Car } from 'lucide-react'

function MiniBar({ label, value, color }) {
  const colorMap = {
    blue: { bar: 'bg-blue-500', text: 'text-blue-400' },
    amber: { bar: 'bg-amber-500', text: 'text-amber-400' },
    red: { bar: 'bg-red-500', text: 'text-red-400' },
    green: { bar: 'bg-emerald-500', text: 'text-emerald-400' },
  }
  const cfg = colorMap[color] || colorMap.blue

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs">
        <span className="text-gray-400">{label}</span>
        <span className={`font-bold ${cfg.text}`}>{value}%</span>
      </div>
      <div className="w-full bg-[#1e3a5f]/30 rounded-full h-1.5">
        <div
          className={`h-1.5 rounded-full ${cfg.bar} transition-all duration-700`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  )
}

function getOverallColor(value) {
  if (value >= 80) return { text: 'text-red-400', ring: 'border-red-500/40', label: 'Severe' }
  if (value >= 60) return { text: 'text-amber-400', ring: 'border-amber-500/40', label: 'High' }
  if (value >= 40) return { text: 'text-blue-400', ring: 'border-blue-500/40', label: 'Moderate' }
  return { text: 'text-emerald-400', ring: 'border-emerald-500/40', label: 'Low' }
}

export default function TrafficCongestionStatus({ congestion }) {
  if (!congestion) return null
  const cfg = getOverallColor(congestion.overall)

  return (
    <div className="glass-card p-5 h-full flex flex-col">
      <div className="mb-4">
        <h3 className="text-white font-semibold text-sm">Traffic Congestion</h3>
        <p className="text-gray-500 text-xs mt-0.5">Real-time network status</p>
      </div>

      {/* Central gauge */}
      <div className="flex flex-col items-center mb-5">
        <div className={`w-24 h-24 rounded-full border-4 ${cfg.ring} flex flex-col items-center justify-center bg-[#111827]/60`}>
          <Car className={`w-5 h-5 ${cfg.text} mb-1`} />
          <span className={`text-2xl font-bold ${cfg.text}`}>{congestion.overall}%</span>
        </div>
        <div className="mt-2 text-center">
          <span className={`text-xs font-bold ${cfg.text}`}>{cfg.label} Congestion</span>
        </div>
      </div>

      {/* Breakdown */}
      <div className="flex-1 space-y-3">
        <MiniBar label="Highway" value={congestion.highway} color="blue" />
        <MiniBar label="Arterial Roads" value={congestion.arterial} color="amber" />
        <MiniBar label="Local Streets" value={congestion.local} color="green" />
      </div>
    </div>
  )
}
