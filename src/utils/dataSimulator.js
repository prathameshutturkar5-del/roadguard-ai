// dataSimulator.js - Realistic data simulation for RoadGuard AI

let vehicleBase = 62000

export function generateVehicleCount() {
  vehicleBase += Math.floor(Math.random() * 1000) - 500
  vehicleBase = Math.max(45000, Math.min(85000, vehicleBase))
  return vehicleBase
}

export function generateTrafficData() {
  const hours = []
  for (let i = 0; i < 24; i++) {
    const isPeakMorning = i >= 7 && i <= 10
    const isPeakEvening = i >= 17 && i <= 20
    const isNight = i >= 23 || i <= 4
    let baseVehicles = isNight ? 8000 : isPeakMorning || isPeakEvening ? 55000 : 30000
    const vehicles = baseVehicles + Math.floor(Math.random() * 8000) - 4000
    const riskScore = Math.min(100, Math.round((vehicles / 85000) * 80 + Math.random() * 20))
    const accidents = Math.floor((riskScore / 100) * 8 * Math.random())
    hours.push({
      hour: `${i.toString().padStart(2, '0')}:00`,
      vehicles: Math.max(0, vehicles),
      riskScore: Math.max(0, riskScore),
      accidents: Math.max(0, accidents),
    })
  }
  return hours
}

export function generateWeeklyData() {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  return days.map((day) => ({
    day,
    accidents: Math.floor(Math.random() * 25) + 5,
    injuries: Math.floor(Math.random() * 15) + 2,
    fatalities: Math.floor(Math.random() * 3),
    nearMisses: Math.floor(Math.random() * 40) + 10,
  }))
}

export function generateAlerts() {
  const alertTypes = ['accident', 'congestion', 'weather', 'patrol', 'construction', 'hazard']
  const severities = ['critical', 'high', 'medium', 'low']
  const locations = [
    'Western Express Highway, km 24',
    'Bandra-Worli Sea Link',
    'Eastern Freeway Junction',
    'Andheri Flyover',
    'Dadar Circle',
    'Thane Creek Bridge',
    'Mulund Checkpoint',
    'Borivali National Park Entry',
  ]
  const messages = [
    'Multi-vehicle collision detected. Emergency services dispatched.',
    'Severe congestion, 85% capacity exceeded. Alternate routes advised.',
    'Heavy rainfall reducing visibility to 50m. Caution alert issued.',
    'Routine patrol checkpoint active. Random vehicle checks.',
    'Road construction causing single-lane traffic. Expect delays.',
    'Debris on road detected by sensors. Maintenance crew en route.',
    'Speeding violations detected – 23 vehicles in last hour.',
    'Drunk driving checkpoint active. 2 DUI arrests made.',
  ]

  return messages.map((message, i) => ({
    id: i + 1,
    type: alertTypes[i % alertTypes.length],
    message,
    location: locations[i],
    time: `${Math.floor(Math.random() * 55) + 1}m ago`,
    severity: severities[Math.floor(Math.random() * severities.length)],
    status: ['active', 'investigating', 'resolved'][Math.floor(Math.random() * 3)],
    units: Math.floor(Math.random() * 4) + 1,
  }))
}

export function generateAccidentProneLocations() {
  return [
    { name: 'Western Express Hwy, km 24', riskLevel: 'Critical', accidents: 47, coordinates: [19.1, 72.85], trend: 'up' },
    { name: 'Bandra-Kurla Complex', riskLevel: 'High', accidents: 38, coordinates: [19.065, 72.868], trend: 'up' },
    { name: 'Andheri East Junction', riskLevel: 'High', accidents: 31, coordinates: [19.115, 72.868], trend: 'down' },
    { name: 'Dadar TT Circle', riskLevel: 'Medium', accidents: 24, coordinates: [19.018, 72.843], trend: 'up' },
    { name: 'Thane-Belapur Rd', riskLevel: 'High', accidents: 29, coordinates: [19.195, 72.971], trend: 'down' },
    { name: 'Eastern Freeway, km 8', riskLevel: 'Medium', accidents: 18, coordinates: [18.978, 72.846], trend: 'down' },
    { name: 'Ghatkopar Flyover', riskLevel: 'Medium', accidents: 21, coordinates: [19.086, 72.908], trend: 'up' },
    { name: 'Mulund Check Naka', riskLevel: 'Low', accidents: 12, coordinates: [19.175, 72.956], trend: 'down' },
    { name: 'Vashi Bridge', riskLevel: 'High', accidents: 33, coordinates: [19.075, 72.998], trend: 'up' },
    { name: 'Borivali Flyover', riskLevel: 'Low', accidents: 9, coordinates: [19.228, 72.858], trend: 'down' },
  ]
}

export function generateWeatherData() {
  const conditions = ['Clear', 'Partly Cloudy', 'Cloudy', 'Light Rain', 'Heavy Rain', 'Foggy']
  const impacts = ['Low', 'Low', 'Medium', 'Medium', 'High', 'High']
  const idx = Math.floor(Math.random() * conditions.length)
  return {
    temp: Math.floor(Math.random() * 15) + 24,
    humidity: Math.floor(Math.random() * 40) + 50,
    visibility: Math.floor(Math.random() * 8) + 2,
    windSpeed: Math.floor(Math.random() * 25) + 5,
    condition: conditions[idx],
    impact: impacts[idx],
  }
}

export function generateMapMarkers() {
  return [
    { id: 1, lat: 19.076, lng: 72.878, type: 'accident', label: 'Accident - WEH km 24', severity: 'critical' },
    { id: 2, lat: 19.095, lng: 72.853, type: 'congestion', label: 'Heavy Congestion - Andheri', severity: 'high' },
    { id: 3, lat: 19.018, lng: 72.843, type: 'checkpoint', label: 'Police Checkpoint - Dadar', severity: 'info' },
    { id: 4, lat: 19.065, lng: 72.868, type: 'congestion', label: 'Moderate Traffic - BKC', severity: 'medium' },
    { id: 5, lat: 19.175, lng: 72.956, type: 'checkpoint', label: 'Toll Booth - Mulund', severity: 'info' },
    { id: 6, lat: 19.228, lng: 72.858, type: 'patrol', label: 'Patrol Unit - Borivali', severity: 'info' },
    { id: 7, lat: 19.115, lng: 72.908, type: 'accident', label: 'Minor Accident - Ghatkopar', severity: 'medium' },
    { id: 8, lat: 19.075, lng: 72.998, type: 'congestion', label: 'Congestion - Vashi Bridge', severity: 'high' },
    { id: 9, lat: 18.978, lng: 72.846, type: 'patrol', label: 'Highway Patrol - Eastern FW', severity: 'info' },
    { id: 10, lat: 19.195, lng: 72.971, type: 'accident', label: 'Accident - Thane-Belapur', severity: 'high' },
  ]
}

export function generateTrafficCongestion() {
  return {
    overall: Math.floor(Math.random() * 30) + 55,
    highway: Math.floor(Math.random() * 25) + 60,
    arterial: Math.floor(Math.random() * 35) + 50,
    local: Math.floor(Math.random() * 40) + 30,
  }
}

export function generateRoadRiskLevel() {
  const levels = ['Low', 'Medium', 'High', 'Critical']
  const score = Math.floor(Math.random() * 40) + 50
  let level
  if (score < 30) level = 'Low'
  else if (score < 55) level = 'Medium'
  else if (score < 75) level = 'High'
  else level = 'Critical'

  const allFactors = [
    { factor: 'High traffic density', icon: 'car' },
    { factor: 'Reduced visibility', icon: 'eye' },
    { factor: 'Wet road surface', icon: 'droplets' },
    { factor: 'Peak hour congestion', icon: 'clock' },
    { factor: 'Construction zone nearby', icon: 'construction' },
    { factor: 'High accident history', icon: 'alert' },
  ]

  const factorCount = score > 70 ? 4 : score > 50 ? 3 : 2
  return {
    level,
    score,
    factors: allFactors.slice(0, factorCount),
  }
}

export function generateVehicleTypeData() {
  return [
    { name: 'Cars', value: Math.floor(Math.random() * 1000) + 3000, color: '#3b82f6' },
    { name: 'Trucks', value: Math.floor(Math.random() * 500) + 800, color: '#f59e0b' },
    { name: 'Bikes', value: Math.floor(Math.random() * 800) + 1500, color: '#10b981' },
    { name: 'Buses', value: Math.floor(Math.random() * 300) + 400, color: '#8b5cf6' },
    { name: 'Autos', value: Math.floor(Math.random() * 400) + 600, color: '#06b6d4' },
  ]
}

export function generateHeatmapData() {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  return days.map(day => ({
    day,
    hours: Array.from({ length: 24 }, (_, h) => ({
      hour: h,
      risk: Math.floor(Math.random() * 100),
    })),
  }))
}

export function generateMonthlyData() {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  return months.map(month => ({
    month,
    accidents: Math.floor(Math.random() * 100) + 150,
    fatalities: Math.floor(Math.random() * 20) + 10,
    injuries: Math.floor(Math.random() * 200) + 300,
  }))
}

export function generateAccidentCauses() {
  return [
    { name: 'Over Speeding', value: 32, color: '#ef4444' },
    { name: 'Drunk Driving', value: 18, color: '#f59e0b' },
    { name: 'Poor Visibility', value: 15, color: '#8b5cf6' },
    { name: 'Vehicle Failure', value: 12, color: '#06b6d4' },
    { name: 'Road Condition', value: 13, color: '#10b981' },
    { name: 'Other', value: 10, color: '#6b7280' },
  ]
}
