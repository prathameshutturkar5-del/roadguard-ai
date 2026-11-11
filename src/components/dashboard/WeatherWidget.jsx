import { Sun, Cloud, CloudRain, CloudLightning, Eye, Droplets, Wind, AlertTriangle } from 'lucide-react'

const impactConfig = {
  Low: { color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
  Medium: { color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
  High: { color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20' },
}

const conditionIcons = {
  Clear: Sun,
  'Partly Cloudy': Cloud,
  Cloudy: Cloud,
  'Light Rain': CloudRain,
  'Heavy Rain': CloudRain,
  Foggy: CloudLightning,
}

export default function WeatherWidget({ weather }) {
  if (!weather) return null
  const cfg = impactConfig[weather.impact] || impactConfig.Low
  const WeatherIcon = conditionIcons[weather.condition] || Sun

  return (
    <div className="glass-card p-5 h-full">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-white font-semibold text-sm">Weather Conditions</h3>
          <p className="text-gray-500 text-xs mt-0.5">Impact on road safety</p>
        </div>
      </div>

      {/* Main weather display */}
      <div className="flex items-center gap-4 mb-4">
        <div className="w-16 h-16 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
          <WeatherIcon className="w-8 h-8 text-blue-400" style={{ animation: 'float 3s ease-in-out infinite' }} />
        </div>
        <div>
          <div className="text-3xl font-bold text-white">{weather.temp}°C</div>
          <div className="text-sm text-gray-400">{weather.condition}</div>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        <div className="bg-[#111827]/60 rounded-lg p-2.5 text-center border border-[#1e3a5f]/20">
          <Droplets className="w-4 h-4 text-cyan-400 mx-auto mb-1" />
          <div className="text-sm font-bold text-white">{weather.humidity}%</div>
          <div className="text-[10px] text-gray-500">Humidity</div>
        </div>
        <div className="bg-[#111827]/60 rounded-lg p-2.5 text-center border border-[#1e3a5f]/20">
          <Eye className="w-4 h-4 text-amber-400 mx-auto mb-1" />
          <div className="text-sm font-bold text-white">{weather.visibility}km</div>
          <div className="text-[10px] text-gray-500">Visibility</div>
        </div>
        <div className="bg-[#111827]/60 rounded-lg p-2.5 text-center border border-[#1e3a5f]/20">
          <Wind className="w-4 h-4 text-purple-400 mx-auto mb-1" />
          <div className="text-sm font-bold text-white">{weather.windSpeed}</div>
          <div className="text-[10px] text-gray-500">km/h</div>
        </div>
      </div>

      {/* Road Impact */}
      <div className={`flex items-center gap-3 p-3 rounded-lg border ${cfg.bg} ${cfg.border}`}>
        <AlertTriangle className={`w-4 h-4 ${cfg.color} shrink-0`} />
        <div>
          <span className="text-xs text-gray-400">Road Safety Impact: </span>
          <span className={`text-xs font-bold ${cfg.color}`}>{weather.impact}</span>
        </div>
      </div>
    </div>
  )
}
