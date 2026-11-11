import { Car, AlertTriangle, Shield, Activity } from 'lucide-react'
import KPICard from '../components/dashboard/KPICard'
import AccidentRiskChart from '../components/dashboard/AccidentRiskChart'
import TrafficMap from '../components/dashboard/TrafficMap'
import SafetyAlerts from '../components/dashboard/SafetyAlerts'
import WeatherWidget from '../components/dashboard/WeatherWidget'
import AccidentProneLocations from '../components/dashboard/AccidentProneLocations'
import TrafficCongestionStatus from '../components/dashboard/TrafficCongestionStatus'
import RoadRiskIndicator from '../components/dashboard/RoadRiskIndicator'

export default function Overview({ data, onViewAlerts }) {
  const {
    vehicleCount,
    trafficData,
    alerts,
    locations,
    weather,
    mapMarkers,
    congestion,
    riskData,
    incidentsToday,
    safeZones,
  } = data

  return (
    <div className="p-6 space-y-5">
      {/* KPI Row */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <KPICard
          icon={Car}
          title="Total Vehicles"
          value={vehicleCount}
          unit="today"
          change={3.2}
          trend="up"
          color="blue"
        />
        <KPICard
          icon={AlertTriangle}
          title="Active Incidents"
          value={incidentsToday}
          unit="active"
          change={12}
          trend="up"
          color="red"
        />
        <KPICard
          icon={Activity}
          title="Risk Score"
          value={riskData?.score || 72}
          unit="/ 100"
          change={5}
          trend="up"
          color="amber"
        />
        <KPICard
          icon={Shield}
          title="Safe Zones"
          value={safeZones}
          unit="zones"
          change={2.1}
          trend="down"
          color="green"
        />
      </div>

      {/* Chart + Weather */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-4">
        <div className="xl:col-span-3">
          <AccidentRiskChart data={trafficData} />
        </div>
        <div className="xl:col-span-2">
          <WeatherWidget weather={weather} />
        </div>
      </div>

      {/* Map + Congestion + Risk */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-4">
        <div className="xl:col-span-3">
          <TrafficMap markers={mapMarkers} />
        </div>
        <div className="xl:col-span-2 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-1 gap-4">
          <TrafficCongestionStatus congestion={congestion} />
          <RoadRiskIndicator riskData={riskData} />
        </div>
      </div>

      {/* Alerts + Locations */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <SafetyAlerts alerts={alerts} onViewAll={onViewAlerts} />
        <AccidentProneLocations locations={locations} />
      </div>
    </div>
  )
}
