import { AlertTriangle, Clock, Eye, Droplets, Car, Construction } from 'lucide-react'
import { RadialBarChart, RadialBar, ResponsiveContainer } from 'recharts'

const levelConfig = {
  Low: { color: '#10b981', textColor: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
  Medium: { color: '#f59e0b', textColor: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
  High: { color: '#f97316', textColor: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/20' },
  Critical: { color: '#ef4444', textColor: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20' },
}

const factorIcons = {
  car: Car,
  eye: Eye,
  droplets: Droplets,
  clock: Clock,
  construction: AlertTriangle,
  alert: AlertTriangle,
}

export default function RoadRiskIndicator({ riskData }) {
  if (!riskData) return null
  const cfg = levelConfig[riskData.level] || levelConfig.Medium

  const chartData = [{ name: 'Risk', value: riskData.score, fill: cfg.color }]

  return (
    <div className="glass-card p-5 h-full flex flex-col">
      <div className="mb-4">
        <h3 className="text-white font-semibold text-sm">Road Risk Indicator</h3>
        <p className="text-gray-500 text-xs mt-0.5">AI-computed risk assessment</p>
      </div>

      {/* Gauge */}
      <div className="relative flex justify-center mb-2" style={{ height: '100px' }}>
        <ResponsiveContainer width="100%" height={100}>
          <RadialBarChart
            cx="50%"
            cy="85%"
            innerRadius="70%"
            outerRadius="100%"
            startAngle={180}
            endAngle={0}
            data={[{ value: 100, fill: '#1e3a5f' }, ...chartData]}
          >
            <RadialBar dataKey="value" cornerRadius={4} background={false} />
          </RadialBarChart>
        </ResponsiveContainer>
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-center">
          <div className={`text-2xl font-bold ${cfg.textColor}`}>{riskData.score}</div>
          <div className="text-xs text-gray-500">/ 100</div>
        </div>
      </div>

      {/* Level badge */}
      <div className={`flex items-center justify-center gap-2 py-2 px-4 rounded-lg border mb-4 ${cfg.bg} ${cfg.border}`}>
        <AlertTriangle className={`w-4 h-4 ${cfg.textColor}`} />
        <span className={`text-sm font-bold ${cfg.textColor}`}>{riskData.level} Risk</span>
      </div>

      {/* Factors */}
      <div className="flex-1 space-y-2">
        <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Contributing Factors</p>
        {(riskData.factors || []).map((item, i) => {
          const Icon = factorIcons[item.icon] || AlertTriangle
          return (
            <div key={i} className="flex items-center gap-2 text-xs">
              <Icon className={`w-3.5 h-3.5 ${cfg.textColor} shrink-0`} />
              <span className="text-gray-400">{item.factor}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
