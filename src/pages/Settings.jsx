import { useState } from 'react'
import { Save, RotateCcw, Bell, Map, Cpu, RefreshCw, Shield, CheckCircle } from 'lucide-react'

function Toggle({ checked, onChange }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`w-11 h-6 rounded-full transition-colors relative ${checked ? 'bg-blue-500' : 'bg-[#1e3a5f]'}`}
    >
      <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all ${checked ? 'left-5' : 'left-0.5'}`} />
    </button>
  )
}

function Slider({ value, onChange, min = 0, max = 100, label }) {
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-xs">
        <span className="text-gray-400">{label}</span>
        <span className="text-blue-400 font-bold">{value}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="w-full h-1.5 rounded-full bg-[#1e3a5f] appearance-none cursor-pointer accent-blue-500"
      />
      <div className="flex justify-between text-[10px] text-gray-600">
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </div>
  )
}

export default function Settings() {
  const [toast, setToast] = useState(null)

  // Alert thresholds
  const [riskThreshold, setRiskThreshold] = useState(70)
  const [congestionThreshold, setCongestionThreshold] = useState(80)
  const [speedThreshold, setSpeedThreshold] = useState(120)
  const [aiSensitivity, setAiSensitivity] = useState(75)
  const [refreshInterval, setRefreshInterval] = useState(3)

  // Notifications
  const [smsAlerts, setSmsAlerts] = useState(true)
  const [emailAlerts, setEmailAlerts] = useState(true)
  const [pushNotifs, setPushNotifs] = useState(false)
  const [criticalOnly, setCriticalOnly] = useState(false)
  const [soundAlerts, setSoundAlerts] = useState(true)

  // Map settings
  const [showAccidents, setShowAccidents] = useState(true)
  const [showCongestion, setShowCongestion] = useState(true)
  const [showPatrols, setShowPatrols] = useState(true)
  const [showCheckpoints, setShowCheckpoints] = useState(true)
  const [autoZoom, setAutoZoom] = useState(false)

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  const handleSave = () => showToast('Settings saved successfully!', 'success')
  const handleReset = () => {
    setRiskThreshold(70)
    setCongestionThreshold(80)
    setSpeedThreshold(120)
    setAiSensitivity(75)
    setRefreshInterval(3)
    setSmsAlerts(true)
    setEmailAlerts(true)
    setPushNotifs(false)
    setCriticalOnly(false)
    setSoundAlerts(true)
    setShowAccidents(true)
    setShowCongestion(true)
    setShowPatrols(true)
    setShowCheckpoints(true)
    setAutoZoom(false)
    showToast('Settings reset to defaults', 'info')
  }

  return (
    <div className="p-6 space-y-5 max-w-4xl mx-auto">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-lg shadow-xl border animate-slide-in ${
          toast.type === 'success'
            ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-400'
            : 'bg-blue-500/20 border-blue-500/30 text-blue-400'
        }`}>
          <CheckCircle className="w-4 h-4" />
          <span className="text-sm font-medium">{toast.msg}</span>
        </div>
      )}

      {/* Alert Thresholds */}
      <div className="glass-card p-5">
        <div className="flex items-center gap-2 mb-5">
          <div className="w-8 h-8 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center">
            <Bell className="w-4 h-4 text-red-400" />
          </div>
          <div>
            <h3 className="text-white font-semibold text-sm">Alert Thresholds</h3>
            <p className="text-gray-500 text-xs">Configure when alerts are triggered</p>
          </div>
        </div>
        <div className="space-y-5">
          <Slider value={riskThreshold} onChange={setRiskThreshold} label="Risk Score Alert Threshold" min={0} max={100} />
          <Slider value={congestionThreshold} onChange={setCongestionThreshold} label="Congestion Alert Threshold (%)" min={0} max={100} />
          <Slider value={speedThreshold} onChange={setSpeedThreshold} label="Speed Violation Threshold (km/h)" min={40} max={200} />
        </div>
      </div>

      {/* AI Settings */}
      <div className="glass-card p-5">
        <div className="flex items-center gap-2 mb-5">
          <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
            <Cpu className="w-4 h-4 text-blue-400" />
          </div>
          <div>
            <h3 className="text-white font-semibold text-sm">AI Engine Settings</h3>
            <p className="text-gray-500 text-xs">Machine learning model configuration</p>
          </div>
        </div>
        <div className="space-y-5">
          <Slider value={aiSensitivity} onChange={setAiSensitivity} label="AI Model Sensitivity" min={0} max={100} />
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-gray-400">Data Refresh Interval (seconds)</span>
              <span className="text-blue-400 font-bold">{refreshInterval}s</span>
            </div>
            <div className="flex gap-2">
              {[1, 2, 3, 5, 10, 30].map(v => (
                <button
                  key={v}
                  onClick={() => setRefreshInterval(v)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    refreshInterval === v
                      ? 'bg-blue-500/20 border border-blue-500/30 text-blue-400'
                      : 'bg-[#111827] border border-[#1e3a5f]/30 text-gray-400 hover:text-gray-200'
                  }`}
                >
                  {v}s
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Notification Preferences */}
      <div className="glass-card p-5">
        <div className="flex items-center gap-2 mb-5">
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
            <Bell className="w-4 h-4 text-amber-400" />
          </div>
          <div>
            <h3 className="text-white font-semibold text-sm">Notification Preferences</h3>
            <p className="text-gray-500 text-xs">Choose how you receive alerts</p>
          </div>
        </div>
        <div className="space-y-4">
          {[
            { label: 'SMS Alerts', sub: 'Receive alerts via SMS', val: smsAlerts, set: setSmsAlerts },
            { label: 'Email Notifications', sub: 'Get daily summaries and critical alerts via email', val: emailAlerts, set: setEmailAlerts },
            { label: 'Push Notifications', sub: 'Browser push notifications', val: pushNotifs, set: setPushNotifs },
            { label: 'Critical Alerts Only', sub: 'Only notify for critical severity incidents', val: criticalOnly, set: setCriticalOnly },
            { label: 'Sound Alerts', sub: 'Play audio for new critical alerts', val: soundAlerts, set: setSoundAlerts },
          ].map(({ label, sub, val, set }) => (
            <div key={label} className="flex items-center justify-between py-2 border-b border-[#1e3a5f]/20 last:border-0">
              <div>
                <div className="text-sm text-gray-200">{label}</div>
                <div className="text-xs text-gray-500">{sub}</div>
              </div>
              <Toggle checked={val} onChange={set} />
            </div>
          ))}
        </div>
      </div>

      {/* Map Settings */}
      <div className="glass-card p-5">
        <div className="flex items-center gap-2 mb-5">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
            <Map className="w-4 h-4 text-cyan-400" />
          </div>
          <div>
            <h3 className="text-white font-semibold text-sm">Map Settings</h3>
            <p className="text-gray-500 text-xs">Configure map layers and behavior</p>
          </div>
        </div>
        <div className="space-y-4">
          {[
            { label: 'Show Accident Markers', sub: 'Display accident locations on map', val: showAccidents, set: setShowAccidents },
            { label: 'Show Congestion Zones', sub: 'Highlight congested areas', val: showCongestion, set: setShowCongestion },
            { label: 'Show Patrol Units', sub: 'Track police patrol vehicles', val: showPatrols, set: setShowPatrols },
            { label: 'Show Checkpoints', sub: 'Display toll and police checkpoints', val: showCheckpoints, set: setShowCheckpoints },
            { label: 'Auto-Zoom on Incident', sub: 'Automatically zoom to new critical incidents', val: autoZoom, set: setAutoZoom },
          ].map(({ label, sub, val, set }) => (
            <div key={label} className="flex items-center justify-between py-2 border-b border-[#1e3a5f]/20 last:border-0">
              <div>
                <div className="text-sm text-gray-200">{label}</div>
                <div className="text-xs text-gray-500">{sub}</div>
              </div>
              <Toggle checked={val} onChange={set} />
            </div>
          ))}
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-3 justify-end">
        <button
          onClick={handleReset}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#111827] border border-[#1e3a5f]/30 text-gray-400 text-sm hover:text-gray-200 hover:border-[#1e3a5f]/60 transition-colors"
        >
          <RotateCcw className="w-4 h-4" /> Reset to Defaults
        </button>
        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-blue-500/20 border border-blue-500/30 text-blue-400 text-sm font-medium hover:bg-blue-500/30 transition-colors"
        >
          <Save className="w-4 h-4" /> Save Settings
        </button>
      </div>
    </div>
  )
}
