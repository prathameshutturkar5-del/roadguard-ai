import { Bell, User, Car, AlertTriangle, CheckCircle } from 'lucide-react'

const pageTitles = {
  overview: 'Dashboard Overview',
  live: 'Live Traffic Monitoring',
  'vehicle-detection': 'AI Vehicle Detection',
  analytics: 'Analytics & Insights',
  alerts: 'Safety Alerts',
  settings: 'System Settings',
}

const pageSubtitles = {
  overview: 'AI-powered road safety intelligence',
  live: 'Real-time traffic feed from 247 sensors',
  'vehicle-detection': 'YOLOv8n real-time vehicle detection engine',
  analytics: 'Historical trends and predictive analysis',
  alerts: 'Active incidents and notifications',
  settings: 'Configure monitoring parameters',
}

export default function Header({ activeTab, lastUpdated, alertCount, vehicleCount, incidentsToday }) {
  const timeStr = lastUpdated
    ? lastUpdated.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    : '--:--:--'

  return (
    <header className="bg-[#0d1526]/90 backdrop-blur-sm border-b border-[#1e3a5f]/50 px-6 py-3 flex flex-col gap-3 sticky top-0 z-10">
      {/* Top Row */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-white font-bold text-xl leading-tight">{pageTitles[activeTab] || 'Dashboard'}</h2>
          <p className="text-gray-500 text-xs mt-0.5">{pageSubtitles[activeTab]}</p>
        </div>

        <div className="flex items-center gap-3">
          {/* Last updated */}
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-gray-500 bg-[#111827] px-3 py-1.5 rounded-lg border border-[#1e3a5f]/30">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 live-indicator" />
            <span>Updated {timeStr}</span>
          </div>

          {/* Notifications */}
          <button className="relative w-9 h-9 rounded-lg bg-[#111827] border border-[#1e3a5f]/30 flex items-center justify-center hover:border-blue-500/30 transition-colors">
            <Bell className="w-4 h-4 text-gray-400" />
            {alertCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
                {alertCount > 9 ? '9+' : alertCount}
              </span>
            )}
          </button>

          {/* User avatar */}
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-500/30 to-cyan-500/30 border border-blue-500/30 flex items-center justify-center">
            <User className="w-4 h-4 text-blue-400" />
          </div>
        </div>
      </div>

      {/* Quick Stats Bar */}
      <div className="flex items-center gap-4 pb-1">
        <div className="flex items-center gap-2 bg-[#111827]/60 rounded-lg px-3 py-1.5 border border-[#1e3a5f]/20">
          <Car className="w-3.5 h-3.5 text-blue-400" />
          <span className="text-xs text-gray-400">Total Vehicles:</span>
          <span className="text-xs font-bold text-white">{vehicleCount?.toLocaleString() || '0'}</span>
        </div>
        <div className="flex items-center gap-2 bg-[#111827]/60 rounded-lg px-3 py-1.5 border border-[#1e3a5f]/20">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
          <span className="text-xs text-gray-400">Incidents Today:</span>
          <span className="text-xs font-bold text-amber-400">{incidentsToday || 0}</span>
        </div>
        <div className="flex items-center gap-2 bg-[#111827]/60 rounded-lg px-3 py-1.5 border border-[#1e3a5f]/20">
          <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-xs text-gray-400">System Status:</span>
          <span className="text-xs font-bold text-emerald-400">Operational</span>
        </div>
      </div>
    </header>
  )
}
