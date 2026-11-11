import { TrendingUp, TrendingDown } from 'lucide-react'

const colorMap = {
  blue: {
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/20',
    icon: 'text-blue-400',
    accent: 'bg-blue-500/20',
    text: 'text-blue-400',
  },
  red: {
    bg: 'bg-red-500/10',
    border: 'border-red-500/20',
    icon: 'text-red-400',
    accent: 'bg-red-500/20',
    text: 'text-red-400',
  },
  amber: {
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/20',
    icon: 'text-amber-400',
    accent: 'bg-amber-500/20',
    text: 'text-amber-400',
  },
  green: {
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/20',
    icon: 'text-emerald-400',
    accent: 'bg-emerald-500/20',
    text: 'text-emerald-400',
  },
  cyan: {
    bg: 'bg-cyan-500/10',
    border: 'border-cyan-500/20',
    icon: 'text-cyan-400',
    accent: 'bg-cyan-500/20',
    text: 'text-cyan-400',
  },
}

export default function KPICard({ icon: Icon, title, value, unit, change, trend, color = 'blue' }) {
  const colors = colorMap[color] || colorMap.blue
  const isPositive = trend === 'up'

  return (
    <div className={`glass-card-hover p-5 ${colors.bg} ${colors.border}`}>
      <div className="flex items-start justify-between mb-3">
        <div className={`w-10 h-10 rounded-lg ${colors.accent} flex items-center justify-center`}>
          <Icon className={`w-5 h-5 ${colors.icon}`} />
        </div>
        {change !== undefined && (
          <div className={`flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${
            isPositive ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
          }`}>
            {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {Math.abs(change)}%
          </div>
        )}
      </div>

      <div className="space-y-1">
        <p className="text-gray-400 text-xs font-medium uppercase tracking-wide">{title}</p>
        <div className="flex items-baseline gap-1.5">
          <span className="text-2xl font-bold text-white">{typeof value === 'number' ? value.toLocaleString() : value}</span>
          {unit && <span className="text-gray-500 text-sm">{unit}</span>}
        </div>
      </div>
    </div>
  )
}
