import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet'

const markerColors = {
  accident: '#ef4444',
  congestion: '#f59e0b',
  checkpoint: '#3b82f6',
  patrol: '#10b981',
}

const severityColors = {
  critical: '#ef4444',
  high: '#f97316',
  medium: '#f59e0b',
  low: '#10b981',
  info: '#3b82f6',
}

export default function TrafficMap({ markers }) {
  return (
    <div className="glass-card p-5 h-full">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-white font-semibold text-sm">Live Traffic Map</h3>
          <p className="text-gray-500 text-xs mt-0.5">Mumbai Metropolitan Region</p>
        </div>
        {/* Legend */}
        <div className="flex items-center gap-3 text-xs">
          {Object.entries(markerColors).map(([type, color]) => (
            <div key={type} className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full" style={{ background: color }} />
              <span className="text-gray-400 capitalize">{type}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-lg overflow-hidden border border-[#1e3a5f]/30" style={{ height: '320px' }}>
        <MapContainer
          center={[19.076, 72.878]}
          zoom={11}
          style={{ height: '100%', width: '100%' }}
          zoomControl={true}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            maxZoom={19}
          />
          {markers && markers.map((marker) => (
            <CircleMarker
              key={marker.id}
              center={[marker.lat, marker.lng]}
              radius={marker.type === 'accident' ? 10 : 8}
              fillColor={markerColors[marker.type] || '#3b82f6'}
              color={markerColors[marker.type] || '#3b82f6'}
              weight={2}
              opacity={0.9}
              fillOpacity={0.7}
            >
              <Popup>
                <div className="text-sm">
                  <div className="font-bold mb-1 text-white">{marker.label}</div>
                  <div className="flex items-center gap-1.5 text-xs">
                    <span
                      className="px-1.5 py-0.5 rounded text-white capitalize font-medium"
                      style={{ background: severityColors[marker.severity] }}
                    >
                      {marker.severity}
                    </span>
                    <span className="text-gray-400 capitalize">{marker.type}</span>
                  </div>
                </div>
              </Popup>
            </CircleMarker>
          ))}
        </MapContainer>
      </div>
    </div>
  )
}
