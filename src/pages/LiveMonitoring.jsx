import { useState, useEffect } from 'react'
import { Camera, Radio, Car, Truck, Bike, Bus, Activity, AlertTriangle } from 'lucide-react'
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { generateVehicleTypeData, generateMapMarkers, generateAlerts } from '../utils/dataSimulator'

const markerColors = {
  accident: '#ef4444',
  congestion: '#f59e0b',
  checkpoint: '#3b82f6',
  patrol: '#10b981',
}

export default function LiveMonitoring() {
  const [vehicleTypes, setVehicleTypes] = useState(generateVehicleTypeData)
  const [markers, setMarkers] = useState(generateMapMarkers)
  const [liveAlerts, setLiveAlerts] = useState(generateAlerts)
  const [tick, setTick] = useState(0)
  const [feedMessages, setFeedMessages] = useState([
    { id: 1, msg: 'Camera 24A: Overspeeding detected – 94km/h in 60 zone', time: '00:03' },
    { id: 2, msg: 'Sensor Grid B7: Traffic density 92% at WEH Junction', time: '00:11' },
    { id: 3, msg: 'AI Alert: Potential accident risk elevated at BKC exit', time: '00:18' },
    { id: 4, msg: 'Checkpoint 12: Vehicle flagged – expired insurance', time: '00:25' },
    { id: 5, msg: 'Weather module: Visibility drop detected – issuing caution', time: '00:34' },
  ])

  useEffect(() => {
    const interval = setInterval(() => {
      setVehicleTypes(generateVehicleTypeData())
      setMarkers(generateMapMarkers())
      setTick(t => t + 1)
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (tick > 0 && tick % 5 === 0) {
      const msgs = [
        'Camera 15C: Lane violation detected, logging vehicle',
        'Sensor Grid A3: Speed average 78km/h, within limits',
        'AI prediction: Heavy rain expected, issuing fog advisory',
        'Patrol unit 7 dispatched to Andheri junction',
        'Traffic signal Phase optimized at Bandra intersection',
      ]
      setFeedMessages(prev => [
        { id: Date.now(), msg: msgs[Math.floor(Math.random() * msgs.length)], time: new Date().toLocaleTimeString('en-IN', { minute: '2-digit', second: '2-digit' }) },
        ...prev.slice(0, 9),
      ])
    }
  }, [tick])

  const typeIcons = { Cars: Car, Trucks: Truck, Bikes: Bike, Buses: Bus, Autos: Activity }

  return (
    <div className="p-6 space-y-4">
      {/* Status bar */}
      <div className="flex items-center gap-4 flex-wrap">
        <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-lg px-4 py-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 live-indicator" />
          <span className="text-sm font-semibold text-emerald-400">Live Feed Active</span>
        </div>
        <div className="flex items-center gap-2 bg-[#0d1526]/80 border border-[#1e3a5f]/50 rounded-lg px-4 py-2">
          <Camera className="w-4 h-4 text-blue-400" />
          <span className="text-sm text-gray-300">247 Cameras Online</span>
        </div>
        <div className="flex items-center gap-2 bg-[#0d1526]/80 border border-[#1e3a5f]/50 rounded-lg px-4 py-2">
          <Radio className="w-4 h-4 text-cyan-400" />
          <span className="text-sm text-gray-300">512 Sensors Active</span>
        </div>
        <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-2">
          <AlertTriangle className="w-4 h-4 text-red-400" />
          <span className="text-sm text-red-400">{liveAlerts.filter(a => a.severity === 'critical').length} Critical Alerts</span>
        </div>
      </div>

      {/* Main content */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-4">
        {/* Large Map */}
        <div className="xl:col-span-3 glass-card p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-white font-semibold text-sm">Live Traffic Map</h3>
            <div className="flex items-center gap-3 text-xs">
              {Object.entries(markerColors).map(([type, color]) => (
                <div key={type} className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full" style={{ background: color }} />
                  <span className="text-gray-400 capitalize">{type}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-lg overflow-hidden border border-[#1e3a5f]/30" style={{ height: '480px' }}>
            <MapContainer center={[19.076, 72.878]} zoom={12} style={{ height: '100%', width: '100%' }}>
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                maxZoom={19}
              />
              {markers.map((marker) => (
                <CircleMarker
                  key={marker.id}
                  center={[marker.lat, marker.lng]}
                  radius={marker.type === 'accident' ? 12 : 9}
                  fillColor={markerColors[marker.type] || '#3b82f6'}
                  color={markerColors[marker.type] || '#3b82f6'}
                  weight={2}
                  opacity={0.9}
                  fillOpacity={0.7}
                >
                  <Popup>
                    <div className="text-sm text-white">
                      <div className="font-bold mb-1">{marker.label}</div>
                      <div className="text-xs text-gray-400 capitalize">{marker.type} · {marker.severity}</div>
                    </div>
                  </Popup>
                </CircleMarker>
              ))}
            </MapContainer>
          </div>
        </div>

        {/* Right Panel */}
        <div className="xl:col-span-2 space-y-4">
          {/* Vehicle Type Breakdown */}
          <div className="glass-card p-4">
            <h3 className="text-white font-semibold text-sm mb-3">Vehicle Composition</h3>
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie
                  data={vehicleTypes}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={70}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {vehicleTypes.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ background: 'rgba(13,21,38,0.95)', border: '1px solid #1e3a5f', borderRadius: '8px', color: '#fff' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', color: '#9ca3af' }} />
              </PieChart>
            </ResponsiveContainer>

            <div className="grid grid-cols-2 gap-2 mt-2">
              {vehicleTypes.map((vt) => {
                const Icon = typeIcons[vt.name] || Car
                return (
                  <div key={vt.name} className="flex items-center gap-2 bg-[#111827]/60 rounded-lg p-2 border border-[#1e3a5f]/20">
                    <Icon className="w-4 h-4 shrink-0" style={{ color: vt.color }} />
                    <div>
                      <div className="text-xs text-gray-400">{vt.name}</div>
                      <div className="text-sm font-bold text-white">{vt.value.toLocaleString()}</div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Live Feed */}
          <div className="glass-card p-4">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2 h-2 rounded-full bg-emerald-400 live-indicator" />
              <h3 className="text-white font-semibold text-sm">Live Feed Ticker</h3>
            </div>
            <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
              {feedMessages.map((msg) => (
                <div key={msg.id} className="flex gap-2 text-xs bg-[#111827]/60 rounded p-2 border border-[#1e3a5f]/20">
                  <span className="text-blue-400 font-mono shrink-0">{msg.time}</span>
                  <span className="text-gray-300">{msg.msg}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
