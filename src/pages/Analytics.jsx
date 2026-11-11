import { useState } from 'react'
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts'
import { Calendar } from 'lucide-react'

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#0d1526]/95 border border-[#1e3a5f]/50 rounded-lg p-3 shadow-xl">
        <p className="text-gray-400 text-xs mb-2">{label}</p>
        {payload.map((p, i) => (
          <div key={i} className="flex items-center gap-2 text-xs">
            <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
            <span className="text-gray-400">{p.name}:</span>
            <span className="text-white font-bold">{p.value.toLocaleString()}</span>
          </div>
        ))}
      </div>
    )
  }
  return null
}

export default function Analytics({ data }) {
  const { weeklyData, monthlyData, accidentCauses, heatmapData } = data
  const [dateRange, setDateRange] = useState('30d')

  const riskColor = (val) => {
    if (val >= 80) return '#ef4444'
    if (val >= 60) return '#f59e0b'
    if (val >= 40) return '#3b82f6'
    return '#10b981'
  }

  return (
    <div className="p-6 space-y-5">
      {/* Header controls */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-white font-bold text-lg">Traffic Analytics</h2>
          <p className="text-gray-500 text-sm">Historical trends and predictive insights</p>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-gray-400" />
          {['7d', '30d', '90d', '1y'].map(r => (
            <button
              key={r}
              onClick={() => setDateRange(r)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                dateRange === r
                  ? 'bg-blue-500/20 border border-blue-500/30 text-blue-400'
                  : 'bg-[#111827] border border-[#1e3a5f]/30 text-gray-400 hover:text-gray-200'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Stats summary */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {[
          { label: 'Total Accidents', value: '1,247', change: '-8.3%', positive: true, color: 'text-red-400' },
          { label: 'Fatalities', value: '89', change: '-12.1%', positive: true, color: 'text-orange-400' },
          { label: 'Injuries', value: '3,421', change: '-5.7%', positive: true, color: 'text-amber-400' },
          { label: 'Near Misses', value: '8,932', change: '+3.2%', positive: false, color: 'text-blue-400' },
        ].map((s, i) => (
          <div key={i} className="glass-card p-4">
            <div className="text-xs text-gray-500 font-medium mb-1">{s.label}</div>
            <div className={`text-2xl font-bold ${s.color} mb-1`}>{s.value}</div>
            <div className={`text-xs font-medium ${s.positive ? 'text-emerald-400' : 'text-red-400'}`}>{s.change} vs last period</div>
          </div>
        ))}
      </div>

      {/* Weekly + Monthly charts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <div className="glass-card p-5">
          <h3 className="text-white font-semibold text-sm mb-4">Weekly Accident Trends</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={weeklyData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e3a5f" vertical={false} />
              <XAxis dataKey="day" tick={{ fill: '#6b7280', fontSize: 11 }} tickLine={false} axisLine={{ stroke: '#1e3a5f' }} />
              <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} tickLine={false} axisLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: '11px', color: '#9ca3af' }} />
              <Bar dataKey="accidents" name="Accidents" fill="#ef4444" radius={[3, 3, 0, 0]} />
              <Bar dataKey="injuries" name="Injuries" fill="#f59e0b" radius={[3, 3, 0, 0]} />
              <Bar dataKey="nearMisses" name="Near Misses" fill="#3b82f6" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="glass-card p-5">
          <h3 className="text-white font-semibold text-sm mb-4">Monthly Comparison</h3>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={monthlyData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e3a5f" vertical={false} />
              <XAxis dataKey="month" tick={{ fill: '#6b7280', fontSize: 11 }} tickLine={false} axisLine={{ stroke: '#1e3a5f' }} />
              <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} tickLine={false} axisLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: '11px', color: '#9ca3af' }} />
              <Line type="monotone" dataKey="accidents" stroke="#ef4444" strokeWidth={2} dot={false} name="Accidents" />
              <Line type="monotone" dataKey="injuries" stroke="#f59e0b" strokeWidth={2} dot={false} name="Injuries" />
              <Line type="monotone" dataKey="fatalities" stroke="#8b5cf6" strokeWidth={2} dot={false} name="Fatalities" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Heatmap + Causes */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-4">
        {/* Heatmap */}
        <div className="xl:col-span-3 glass-card p-5">
          <h3 className="text-white font-semibold text-sm mb-4">Hour-by-Hour Risk Heatmap (7 Days)</h3>
          <div className="overflow-x-auto">
            <div className="min-w-max">
              {/* Hour labels */}
              <div className="flex gap-0.5 mb-1 ml-10">
                {Array.from({ length: 24 }, (_, h) => (
                  <div key={h} className="w-6 text-center text-[9px] text-gray-600">{h % 6 === 0 ? h : ''}</div>
                ))}
              </div>
              {(heatmapData || []).map((dayData) => (
                <div key={dayData.day} className="flex items-center gap-1 mb-0.5">
                  <div className="w-9 text-xs text-gray-500 text-right shrink-0">{dayData.day}</div>
                  <div className="flex gap-0.5">
                    {dayData.hours.map((h) => (
                      <div
                        key={h.hour}
                        className="w-6 h-6 rounded-sm transition-opacity hover:opacity-80 cursor-pointer"
                        style={{ background: riskColor(h.risk), opacity: 0.3 + (h.risk / 100) * 0.7 }}
                        title={`${dayData.day} ${h.hour}:00 - Risk: ${h.risk}%`}
                      />
                    ))}
                  </div>
                </div>
              ))}
              {/* Legend */}
              <div className="flex items-center gap-2 mt-3 ml-10">
                <span className="text-xs text-gray-500">Low</span>
                {[20, 40, 60, 80, 100].map(v => (
                  <div key={v} className="w-6 h-3 rounded-sm" style={{ background: riskColor(v) }} />
                ))}
                <span className="text-xs text-gray-500">High</span>
              </div>
            </div>
          </div>
        </div>

        {/* Causes */}
        <div className="xl:col-span-2 glass-card p-5">
          <h3 className="text-white font-semibold text-sm mb-4">Top Accident Causes</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={accidentCauses}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={3}
                dataKey="value"
              >
                {(accidentCauses || []).map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ background: 'rgba(13,21,38,0.95)', border: '1px solid #1e3a5f', borderRadius: '8px', color: '#fff' }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-2">
            {(accidentCauses || []).map((cause, i) => (
              <div key={i} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ background: cause.color }} />
                  <span className="text-gray-400">{cause.name}</span>
                </div>
                <span className="text-white font-bold">{cause.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
