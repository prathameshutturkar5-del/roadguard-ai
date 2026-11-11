import { useState, useEffect } from 'react'
import {
  generateVehicleCount,
  generateTrafficData,
  generateWeeklyData,
  generateAlerts,
  generateAccidentProneLocations,
  generateWeatherData,
  generateMapMarkers,
  generateTrafficCongestion,
  generateRoadRiskLevel,
  generateVehicleTypeData,
  generateHeatmapData,
  generateMonthlyData,
  generateAccidentCauses,
} from '../utils/dataSimulator'

export function useLiveData() {
  const [vehicleCount, setVehicleCount] = useState(generateVehicleCount)
  const [trafficData, setTrafficData] = useState(generateTrafficData)
  const [weeklyData, setWeeklyData] = useState(generateWeeklyData)
  const [alerts, setAlerts] = useState(generateAlerts)
  const [locations, setLocations] = useState(generateAccidentProneLocations)
  const [weather, setWeather] = useState(generateWeatherData)
  const [mapMarkers, setMapMarkers] = useState(generateMapMarkers)
  const [congestion, setCongestion] = useState(generateTrafficCongestion)
  const [riskData, setRiskData] = useState(generateRoadRiskLevel)
  const [vehicleTypes, setVehicleTypes] = useState(generateVehicleTypeData)
  const [heatmapData] = useState(generateHeatmapData)
  const [monthlyData] = useState(generateMonthlyData)
  const [accidentCauses] = useState(generateAccidentCauses)
  const [lastUpdated, setLastUpdated] = useState(new Date())
  const [incidentsToday, setIncidentsToday] = useState(23)
  const [safeZones, setSafeZones] = useState(142)

  useEffect(() => {
    const interval = setInterval(() => {
      setVehicleCount(generateVehicleCount())
      setTrafficData(generateTrafficData())
      setWeather(generateWeatherData())
      setCongestion(generateTrafficCongestion())
      setRiskData(generateRoadRiskLevel())
      setVehicleTypes(generateVehicleTypeData())
      setMapMarkers(generateMapMarkers())
      setIncidentsToday(prev => Math.max(0, prev + (Math.random() > 0.7 ? 1 : 0)))
      setSafeZones(prev => Math.max(100, Math.min(200, prev + (Math.floor(Math.random() * 3) - 1))))
      setLastUpdated(new Date())
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  return {
    vehicleCount,
    trafficData,
    weeklyData,
    alerts,
    setAlerts,
    locations,
    weather,
    mapMarkers,
    congestion,
    riskData,
    vehicleTypes,
    heatmapData,
    monthlyData,
    accidentCauses,
    lastUpdated,
    incidentsToday,
    safeZones,
  }
}
