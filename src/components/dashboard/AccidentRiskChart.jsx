import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts'

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#0d1526]/95 border border-[#1e3a5f]/50 rounded-lg p-3 shadow-xl backdrop-blur-sm">
        <p className="text-gray-400 text-xs mb-2 font-medium">{label}</p>
        {payload.map((p, i) => (
          <div key={i} className="flex items-center gap-2 text-xs mb-1">
            <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
            <span className="text-gray-400">{p.name}:</span>
            <span className="text-white font-bold">{typeof p.value === 'number' ? p.value.toLocaleString() : p.value}</span>
          </div>
        ))}
      </div>
    )
  }
  return null
}

export default function AccidentRiskChart({ data }) {
  return (
    <div className="glass-card p-5 h-full">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-white font-semibold text-sm">Accident Risk & Traffic Flow</h3>
          <p className="text-gray-500 text-xs mt-0.5">24-hour analysis</p>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-400 live-indicator" />
          <span className="text-xs text-gray-500">Live</span>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={260}>
        <ComposedChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e3a5f" vertical={false} />
          <XAxis
            dataKey="hour"
            tick={{ fill: '#6b7280', fontSize: 10 }}
            tickLine={false}
            axisLine={{ stroke: '#1e3a5f' }}
            interval={3}
          />
          <YAxis
            yAxisId="vehicles"
            tick={{ fill: '#6b7280', fontSize: 10 }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            yAxisId="risk"
            orientation="right"
            domain={[0, 100]}
            tick={{ fill: '#6b7280', fontSize: 10 }}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{ fontSize: '11px', color: '#9ca3af', paddingTop: '8px' }}
          />
          <Area
            yAxisId="vehicles"
            type="monotone"
            dataKey="vehicles"
            fill="rgba(59,130,246,0.1)"
            stroke="#3b82f6"
            strokeWidth={2}
            name="Vehicle Flow"
          />
          <Bar
            yAxisId="vehicles"
            dataKey="accidents"
            fill="rgba(245,158,11,0.6)"
            radius={[2, 2, 0, 0]}
            name="Accidents"
          />
          <Line
            yAxisId="risk"
            type="monotone"
            dataKey="riskScore"
            stroke="#ef4444"
            strokeWidth={2}
            dot={false}
            name="Risk Score"
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  )
}
