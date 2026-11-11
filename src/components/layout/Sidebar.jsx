import {
  LayoutDashboard,
  Activity,
  BarChart3,
  Bell,
  Settings,
  Shield,
  ChevronLeft,
  ChevronRight,
  Wifi,
  Cpu,
  ScanLine,
} from 'lucide-react'

const navItems = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'live', label: 'Live Monitoring', icon: Activity },
  { id: 'vehicle-detection', label: 'AI Detection', icon: ScanLine },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'alerts', label: 'Alerts', icon: Bell },
  { id: 'settings', label: 'Settings', icon: Settings },
]

export default function Sidebar({ activeTab, setActiveTab, collapsed, setCollapsed }) {
  return (
    <aside
      className={`flex flex-col bg-[#0d1526] border-r border-[#1e3a5f]/50 transition-all duration-300 ease-in-out relative z-20 ${
        collapsed ? 'w-16' : 'w-64'
      }`}
      style={{ minHeight: '100vh' }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-[#1e3a5f]/50">
        <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-blue-500/20 border border-blue-500/30 shrink-0">
          <Shield className="w-5 h-5 text-blue-400" />
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <h1 className="text-white font-bold text-sm leading-tight whitespace-nowrap">RoadGuard AI</h1>
            <p className="text-gray-500 text-xs whitespace-nowrap">Traffic Intelligence</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 space-y-1 px-2">
        {navItems.map(({ id, label, icon: Icon }) => {
          const isActive = activeTab === id
          return (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative ${
                isActive
                  ? 'bg-blue-500/15 text-blue-400 border border-blue-500/30'
                  : 'text-gray-400 hover:bg-[#1e3a5f]/30 hover:text-gray-200'
              }`}
            >
              {isActive && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 bg-blue-400 rounded-r-full" />
              )}
              <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-blue-400' : 'text-gray-500 group-hover:text-gray-300'}`} />
              {!collapsed && (
                <span className="text-sm font-medium whitespace-nowrap">{label}</span>
              )}
            </button>
          )
        })}
      </nav>

      {/* Status Section */}
      {!collapsed && (
        <div className="px-3 pb-4 space-y-2">
          <div className="bg-[#111827]/80 rounded-lg p-3 border border-[#1e3a5f]/30">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">System Status</span>
            </div>
            <div className="flex items-center gap-2 mb-1.5">
              <Cpu className="w-3.5 h-3.5 text-blue-400" />
              <span className="text-xs text-gray-300">AI Engine Active</span>
              <span className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-400 live-indicator" />
            </div>
            <div className="flex items-center gap-2">
              <Wifi className="w-3.5 h-3.5 text-blue-400" />
              <span className="text-xs text-gray-300">Data Feed: Online</span>
              <span className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-400 live-indicator" />
            </div>
          </div>
        </div>
      )}

      {/* Live indicator */}
      <div className={`flex items-center gap-2 px-4 py-3 border-t border-[#1e3a5f]/50 ${collapsed ? 'justify-center' : ''}`}>
        <span className="w-2 h-2 rounded-full bg-emerald-400 live-indicator shrink-0" />
        {!collapsed && <span className="text-xs font-semibold text-emerald-400 tracking-widest">LIVE</span>}
      </div>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-[#1e3a5f] border border-[#2d4f7a] flex items-center justify-center hover:bg-[#2d4f7a] transition-colors z-30"
      >
        {collapsed ? (
          <ChevronRight className="w-3 h-3 text-gray-400" />
        ) : (
          <ChevronLeft className="w-3 h-3 text-gray-400" />
        )}
      </button>
    </aside>
  )
}
