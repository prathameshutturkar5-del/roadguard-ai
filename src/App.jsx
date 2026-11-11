import { useState } from 'react'
import Sidebar from './components/layout/Sidebar'
import Header from './components/layout/Header'
import Overview from './pages/Overview'
import LiveMonitoring from './pages/LiveMonitoring'
import Analytics from './pages/Analytics'
import AlertsPage from './pages/AlertsPage'
import Settings from './pages/Settings'
import VehicleDetection from './pages/VehicleDetection'
import { useLiveData } from './hooks/useLiveData'

export default function App() {
  const [activeTab, setActiveTab] = useState('overview')
  const [collapsed, setCollapsed] = useState(false)
  const data = useLiveData()

  const renderPage = () => {
    switch (activeTab) {
      case 'overview':
        return <Overview data={data} onViewAlerts={() => setActiveTab('alerts')} />
      case 'live':
        return <LiveMonitoring />
      case 'vehicle-detection':
        return <VehicleDetection />
      case 'analytics':
        return <Analytics data={data} />
      case 'alerts':
        return <AlertsPage alerts={data.alerts} setAlerts={data.setAlerts} />
      case 'settings':
        return <Settings />
      default:
        return <Overview data={data} onViewAlerts={() => setActiveTab('alerts')} />
    }
  }

  const criticalAlerts = (data.alerts || []).filter(a => a.severity === 'critical').length

  return (
    <div className="flex min-h-screen bg-[#0a0f1e]">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
      />
      <div className="flex-1 flex flex-col min-w-0">
        <Header
          activeTab={activeTab}
          lastUpdated={data.lastUpdated}
          alertCount={criticalAlerts}
          vehicleCount={data.vehicleCount}
          incidentsToday={data.incidentsToday}
        />
        <main className="flex-1 overflow-y-auto">
          {renderPage()}
        </main>
      </div>
    </div>
  )
}
