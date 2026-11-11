import { useState, useRef, useCallback, useEffect } from 'react'
import {
  Upload, Car, AlertCircle, Loader2, Video,
  X, Cpu, Zap, Eye, CheckCircle2, FileImage, Film
} from 'lucide-react'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts'

// Configurable API base URL with fallback to local backend for development
const API_BASE = (
  import.meta.env.VITE_API_BASE_URL ||
  import.meta.env.VITE_API_URL ||
  'http://localhost:8000'
).replace(/\/+$/, '')

const CLASS_CONFIG = {
  car:        { label: 'Cars',        color: '#3b82f6', bg: 'bg-blue-500/10',    border: 'border-blue-500/30',    text: 'text-blue-400',    bar: 'bg-blue-500' },
  motorcycle: { label: 'Motorcycles', color: '#10b981', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', text: 'text-emerald-400', bar: 'bg-emerald-500' },
  bus:        { label: 'Buses',       color: '#f59e0b', bg: 'bg-amber-500/10',   border: 'border-amber-500/30',   text: 'text-amber-400',   bar: 'bg-amber-500' },
  truck:      { label: 'Trucks',      color: '#ef4444', bg: 'bg-red-500/10',     border: 'border-red-500/30',     text: 'text-red-400',     bar: 'bg-red-500' },
}

// Reusable drop zone component
function DropZone({ accept, label, sublabel, onFile, file, onClear }) {
  const inputRef = useRef(null)
  const [dragging, setDragging] = useState(false)

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    setDragging(false)
    const dropped = e.dataTransfer.files[0]
    if (dropped) onFile(dropped)
  }, [onFile])

  return (
    <div
      className={`relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200
        ${dragging ? 'border-blue-400 bg-blue-500/10' : 'border-[#1e3a5f] hover:border-blue-500/50 hover:bg-blue-500/5'}
        ${file ? 'border-blue-500/40 bg-blue-500/5' : ''}`}
      onClick={() => !file && inputRef.current?.click()}
      onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
    >
      <input ref={inputRef} type="file" accept={accept} className="hidden" onChange={(e) => e.target.files[0] && onFile(e.target.files[0])} />
      {file ? (
        <div className="flex items-center justify-center gap-3">
          <FileImage className="text-blue-400 w-6 h-6" />
          <div className="text-left">
            <p className="text-white text-sm font-medium">{file.name}</p>
            <p className="text-gray-500 text-xs">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
          </div>
          <button onClick={(e) => { e.stopPropagation(); onClear() }} className="ml-auto text-gray-500 hover:text-red-400 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <>
          <Upload className="w-10 h-10 text-gray-600 mx-auto mb-3" />
          <p className="text-gray-300 font-medium text-sm">{label}</p>
          <p className="text-gray-600 text-xs mt-1">{sublabel}</p>
        </>
      )}
    </div>
  )
}

// Vehicle class count card
function ClassCard({ cls, count, total }) {
  const cfg = CLASS_CONFIG[cls]
  const pct = total > 0 ? Math.round((count / total) * 100) : 0
  return (
    <div className={`glass-card p-4 border ${cfg.border}`}>
      <div className="flex items-center justify-between mb-2">
        <span className={`text-xs font-medium ${cfg.text}`}>{cfg.label}</span>
        <span className="text-white font-bold text-lg">{count}</span>
      </div>
      <div className="w-full bg-white/5 rounded-full h-1.5">
        <div className={`${cfg.bar} h-1.5 rounded-full transition-all duration-500`} style={{ width: `${pct}%` }} />
      </div>
      <p className="text-gray-500 text-xs mt-1">{pct}% of total</p>
    </div>
  )
}

// Detection confidence list item
function DetectionRow({ det, idx }) {
  const cfg = CLASS_CONFIG[det.class] || CLASS_CONFIG.car
  const pct = Math.round(det.confidence * 100)
  return (
    <div className="flex items-center gap-3 py-2 border-b border-white/5 last:border-0">
      <span className="text-gray-500 text-xs w-5 text-right">{idx + 1}</span>
      <span className={`text-xs font-medium ${cfg.text} w-20`}>{det.class}</span>
      <div className="flex-1 bg-white/5 rounded-full h-1.5">
        <div className={`${cfg.bar} h-1.5 rounded-full`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-gray-400 text-xs w-10 text-right">{pct}%</span>
    </div>
  )
}

export default function VehicleDetection() {
  const [activeTab, setActiveTab] = useState('image')
  const [backendStatus, setBackendStatus] = useState({ checking: true, online: false })

  // Image state
  const [imgFile, setImgFile] = useState(null)
  const [imgPreview, setImgPreview] = useState(null)
  const [imgLoading, setImgLoading] = useState(false)
  const [imgResult, setImgResult] = useState(null)
  const [imgError, setImgError] = useState(null)

  // Video state
  const [vidFile, setVidFile] = useState(null)
  const [vidLoading, setVidLoading] = useState(false)
  const [vidResult, setVidResult] = useState(null)
  const [vidError, setVidError] = useState(null)

  // Health check on mount
  useEffect(() => {
    fetch(`${API_BASE}/health`)
      .then(r => r.json())
      .then(d => setBackendStatus({ checking: false, online: d.model_loaded === true }))
      .catch(() => setBackendStatus({ checking: false, online: false }))
  }, [])

  // Image file handler
  const handleImgFile = (f) => {
    setImgFile(f)
    setImgResult(null)
    setImgError(null)
    const url = URL.createObjectURL(f)
    setImgPreview(url)
  }

  const clearImg = () => {
    setImgFile(null)
    setImgPreview(null)
    setImgResult(null)
    setImgError(null)
  }

  // Run image detection
  const runImageDetection = async () => {
    if (!imgFile) return
    setImgLoading(true)
    setImgError(null)
    setImgResult(null)
    try {
      const form = new FormData()
      form.append('file', imgFile)
      const res = await fetch(`${API_BASE}/detect/image`, { method: 'POST', body: form })
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail || 'Detection failed')
      setImgResult(data)
    } catch (e) {
      setImgError(e.message)
    } finally {
      setImgLoading(false)
    }
  }

  // Video file handler
  const handleVidFile = (f) => {
    setVidFile(f)
    setVidResult(null)
    setVidError(null)
  }

  const clearVid = () => {
    setVidFile(null)
    setVidResult(null)
    setVidError(null)
  }

  // Run video detection
  const runVideoDetection = async () => {
    if (!vidFile) return
    setVidLoading(true)
    setVidError(null)
    setVidResult(null)
    try {
      const form = new FormData()
      form.append('file', vidFile)
      const res = await fetch(`${API_BASE}/detect/video`, { method: 'POST', body: form })
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail || 'Video detection failed')
      setVidResult(data)
    } catch (e) {
      setVidError(e.message)
    } finally {
      setVidLoading(false)
    }
  }

  return (
    <div className="p-6 space-y-6 min-h-screen">
      {/* Page Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">AI Vehicle Detection</h1>
          <p className="text-gray-400 text-sm mt-1">YOLOv8n Real-Time Detection Engine — Powered by Ultralytics</p>
        </div>
        {/* Backend status badge */}
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border
          ${backendStatus.checking ? 'border-gray-700 text-gray-400' :
            backendStatus.online   ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400' :
                                     'border-red-500/40 bg-red-500/10 text-red-400'}`}>
          {backendStatus.checking ? (
            <><Loader2 className="w-3 h-3 animate-spin" /> Connecting…</>
          ) : backendStatus.online ? (
            <><span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> Backend Online</>
          ) : (
            <><span className="w-2 h-2 rounded-full bg-red-400" /> Backend Offline</>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Main Detection Panel — 3 cols */}
        <div className="xl:col-span-3 space-y-6">

          {/* Tab switcher */}
          <div className="flex gap-1 p-1 bg-[#0d1526]/60 border border-[#1e3a5f]/40 rounded-xl w-fit">
            {[
              { id: 'image', label: 'Image Detection', icon: FileImage },
              { id: 'video', label: 'Video Detection', icon: Film },
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                  ${activeTab === id ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-gray-400 hover:text-gray-200'}`}
              >
                <Icon className="w-4 h-4" /> {label}
              </button>
            ))}
          </div>

          {/* ── IMAGE TAB ── */}
          {activeTab === 'image' && (
            <div className="space-y-5">
              <div className="glass-card p-5">
                <h3 className="text-white font-semibold text-sm mb-4 flex items-center gap-2">
                  <FileImage className="w-4 h-4 text-blue-400" /> Upload Image
                </h3>
                <DropZone
                  accept="image/jpeg,image/png,image/bmp,image/webp,image/jpg"
                  label="Drop image here or click to browse"
                  sublabel="Supports JPG, PNG, BMP, WEBP"
                  onFile={handleImgFile}
                  file={imgFile}
                  onClear={clearImg}
                />
                {imgPreview && !imgResult && (
                  <div className="mt-4 rounded-lg overflow-hidden border border-[#1e3a5f]/40">
                    <img src={imgPreview} alt="Preview" className="w-full max-h-64 object-contain bg-black/40" />
                  </div>
                )}
                {imgFile && (
                  <button
                    onClick={runImageDetection}
                    disabled={imgLoading || !backendStatus.online}
                    className={`mt-4 w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200
                      ${imgLoading || !backendStatus.online
                        ? 'bg-blue-600/40 text-blue-300 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/20'}`}
                  >
                    {imgLoading ? (
                      <><Loader2 className="w-4 h-4 animate-spin" /> Analyzing with YOLOv8n…</>
                    ) : (
                      <><Zap className="w-4 h-4" /> Run Detection</>
                    )}
                  </button>
                )}
                {!backendStatus.online && !backendStatus.checking && (
                  <p className="text-red-400 text-xs mt-2 text-center">⚠ Start the Python backend to enable detection</p>
                )}
              </div>

              {/* Error */}
              {imgError && (
                <div className="glass-card p-4 border border-red-500/30 bg-red-500/5">
                  <div className="flex items-center gap-2 text-red-400 text-sm">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" /> {imgError}
                  </div>
                </div>
              )}

              {/* Results */}
              {imgResult && (
                <div className="space-y-5">
                  {/* Success banner */}
                  <div className="flex items-center gap-2 text-emerald-400 text-sm bg-emerald-500/10 border border-emerald-500/20 rounded-lg px-4 py-2.5">
                    <CheckCircle2 className="w-4 h-4" />
                    Detection complete — {imgResult.total_vehicles} vehicle{imgResult.total_vehicles !== 1 ? 's' : ''} found in <span className="font-semibold ml-1">{imgResult.filename}</span>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                    {/* Annotated image */}
                    <div className="glass-card p-4">
                      <h4 className="text-gray-300 text-xs font-medium mb-3 uppercase tracking-wider">Annotated Output</h4>
                      <div className="rounded-lg overflow-hidden border border-[#1e3a5f]/40">
                        <img
                          src={`data:image/png;base64,${imgResult.annotated_image}`}
                          alt="Annotated detection"
                          className="w-full object-contain bg-black/40"
                        />
                      </div>
                      <p className="text-gray-500 text-xs mt-2">{imgResult.image_width} × {imgResult.image_height} px</p>
                    </div>

                    {/* Stats */}
                    <div className="space-y-4">
                      {/* Total */}
                      <div className="glass-card p-4 text-center border border-blue-500/20">
                        <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Total Vehicles</p>
                        <p className="text-5xl font-bold text-white">{imgResult.total_vehicles}</p>
                        <p className="text-gray-500 text-xs mt-1">detected with ≥25% confidence</p>
                      </div>

                      {/* Class cards grid */}
                      <div className="grid grid-cols-2 gap-3">
                        {Object.keys(CLASS_CONFIG).map(cls => (
                          <ClassCard key={cls} cls={cls} count={imgResult.counts_by_class[cls] || 0} total={imgResult.total_vehicles} />
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Detection list */}
                  {imgResult.detections.length > 0 && (
                    <div className="glass-card p-5">
                      <h4 className="text-gray-300 text-xs font-medium mb-4 uppercase tracking-wider flex items-center gap-2">
                        <Eye className="w-3.5 h-3.5 text-blue-400" /> Detection Confidence
                      </h4>
                      <div className="max-h-48 overflow-y-auto scrollbar-thin">
                        {imgResult.detections.map((det, i) => <DetectionRow key={i} det={det} idx={i} />)}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* ── VIDEO TAB ── */}
          {activeTab === 'video' && (
            <div className="space-y-5">
              <div className="glass-card p-5">
                <h3 className="text-white font-semibold text-sm mb-1 flex items-center gap-2">
                  <Film className="w-4 h-4 text-blue-400" /> Upload Video
                </h3>
                <p className="text-gray-500 text-xs mb-4">Video is sampled at regular intervals for performance (up to 60 frames analyzed)</p>
                <DropZone
                  accept="video/mp4,video/avi,video/mov,video/mkv,.mp4,.avi,.mov,.mkv"
                  label="Drop video here or click to browse"
                  sublabel="Supports MP4, AVI, MOV, MKV"
                  onFile={handleVidFile}
                  file={vidFile}
                  onClear={clearVid}
                />
                {vidFile && (
                  <button
                    onClick={runVideoDetection}
                    disabled={vidLoading || !backendStatus.online}
                    className={`mt-4 w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200
                      ${vidLoading || !backendStatus.online
                        ? 'bg-blue-600/40 text-blue-300 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/20'}`}
                  >
                    {vidLoading ? (
                      <><Loader2 className="w-4 h-4 animate-spin" /> Processing video… this may take a moment</>
                    ) : (
                      <><Zap className="w-4 h-4" /> Analyze Video</>
                    )}
                  </button>
                )}
                {!backendStatus.online && !backendStatus.checking && (
                  <p className="text-red-400 text-xs mt-2 text-center">⚠ Start the Python backend to enable detection</p>
                )}
              </div>

              {vidError && (
                <div className="glass-card p-4 border border-red-500/30 bg-red-500/5">
                  <div className="flex items-center gap-2 text-red-400 text-sm">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" /> {vidError}
                  </div>
                </div>
              )}

              {vidResult && (
                <div className="space-y-5">
                  <div className="flex items-center gap-2 text-emerald-400 text-sm bg-emerald-500/10 border border-emerald-500/20 rounded-lg px-4 py-2.5">
                    <CheckCircle2 className="w-4 h-4" />
                    Video analyzed — {vidResult.total_vehicles_detected} vehicle detections across {vidResult.frames_analyzed} sampled frames
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                    {/* Thumbnail */}
                    {vidResult.thumbnail && (
                      <div className="glass-card p-4">
                        <h4 className="text-gray-300 text-xs font-medium mb-3 uppercase tracking-wider">First Analyzed Frame</h4>
                        <div className="rounded-lg overflow-hidden border border-[#1e3a5f]/40">
                          <img src={`data:image/png;base64,${vidResult.thumbnail}`} alt="Video thumbnail" className="w-full object-contain bg-black/40" />
                        </div>
                        <div className="flex gap-4 mt-2 text-xs text-gray-500">
                          <span>{vidResult.video_width}×{vidResult.video_height}</span>
                          <span>{vidResult.fps} fps</span>
                          <span>{vidResult.total_frames} frames total</span>
                          <span>{vidResult.frames_analyzed} analyzed</span>
                        </div>
                      </div>
                    )}

                    {/* Class counts */}
                    <div className="space-y-3">
                      <div className="glass-card p-4 text-center border border-blue-500/20">
                        <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Total Detections</p>
                        <p className="text-5xl font-bold text-white">{vidResult.total_vehicles_detected}</p>
                        <p className="text-gray-500 text-xs mt-1">across all analyzed frames</p>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        {Object.keys(CLASS_CONFIG).map(cls => (
                          <ClassCard key={cls} cls={cls} count={vidResult.counts_by_class[cls] || 0} total={vidResult.total_vehicles_detected} />
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Frame timeline chart */}
                  {vidResult.frame_data?.length > 1 && (
                    <div className="glass-card p-5">
                      <h4 className="text-gray-300 text-xs font-medium mb-4 uppercase tracking-wider">Vehicle Count Over Time</h4>
                      <ResponsiveContainer width="100%" height={200}>
                        <AreaChart data={vidResult.frame_data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                          <defs>
                            <linearGradient id="vcGrad" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#1e3a5f" />
                          <XAxis dataKey="time_sec" stroke="#4b5563" tick={{ fill: '#6b7280', fontSize: 10 }} label={{ value: 'Time (s)', position: 'insideBottom', offset: -2, fill: '#6b7280', fontSize: 10 }} />
                          <YAxis stroke="#4b5563" tick={{ fill: '#6b7280', fontSize: 10 }} />
                          <Tooltip contentStyle={{ backgroundColor: '#0d1526', border: '1px solid #1e3a5f', borderRadius: 8 }} labelStyle={{ color: '#9ca3af', fontSize: 11 }} itemStyle={{ color: '#3b82f6' }} formatter={(v) => [v, 'Vehicles']} labelFormatter={(l) => `Time: ${l}s`} />
                          <Area type="monotone" dataKey="vehicle_count" stroke="#3b82f6" fill="url(#vcGrad)" strokeWidth={2} dot={false} />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  )}

                  {/* Frame table */}
                  <div className="glass-card p-5">
                    <h4 className="text-gray-300 text-xs font-medium mb-4 uppercase tracking-wider">Frame-by-Frame Data</h4>
                    <div className="overflow-auto max-h-56 scrollbar-thin">
                      <table className="w-full text-xs">
                        <thead>
                          <tr className="text-gray-500 border-b border-white/10">
                            <th className="text-left pb-2 font-medium">Frame</th>
                            <th className="text-left pb-2 font-medium">Time</th>
                            <th className="text-center pb-2 font-medium text-blue-400">Cars</th>
                            <th className="text-center pb-2 font-medium text-emerald-400">Motorcycles</th>
                            <th className="text-center pb-2 font-medium text-amber-400">Buses</th>
                            <th className="text-center pb-2 font-medium text-red-400">Trucks</th>
                            <th className="text-right pb-2 font-medium">Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          {vidResult.frame_data.map((fd, i) => (
                            <tr key={i} className="border-b border-white/5 hover:bg-white/2 transition-colors">
                              <td className="py-1.5 text-gray-400">{fd.frame}</td>
                              <td className="py-1.5 text-gray-400">{fd.time_sec}s</td>
                              <td className="py-1.5 text-center text-blue-400">{fd.counts.car || 0}</td>
                              <td className="py-1.5 text-center text-emerald-400">{fd.counts.motorcycle || 0}</td>
                              <td className="py-1.5 text-center text-amber-400">{fd.counts.bus || 0}</td>
                              <td className="py-1.5 text-center text-red-400">{fd.counts.truck || 0}</td>
                              <td className="py-1.5 text-right text-white font-medium">{fd.vehicle_count}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Sidebar info panel — 1 col */}
        <div className="space-y-4">
          {/* Model info */}
          <div className="glass-card p-5">
            <div className="flex items-center gap-2 mb-4">
              <Cpu className="w-4 h-4 text-blue-400" />
              <h3 className="text-white font-semibold text-sm">Model Info</h3>
            </div>
            <div className="space-y-3 text-xs">
              {[
                ['Model',       'YOLOv8 Nano'],
                ['Framework',   'Ultralytics'],
                ['Confidence',  '≥ 25%'],
                ['Input',       'Images & Video'],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between">
                  <span className="text-gray-500">{k}</span>
                  <span className="text-gray-200 font-medium">{v}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-white/10">
              <p className="text-gray-500 text-xs mb-2 font-medium">Detects</p>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(CLASS_CONFIG).map(([cls, cfg]) => (
                  <div key={cls} className={`${cfg.bg} border ${cfg.border} rounded-lg px-2 py-1.5 text-center`}>
                    <span className={`text-xs font-medium ${cfg.text}`}>{cfg.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Tips */}
          <div className="glass-card p-5 border border-blue-500/20">
            <h3 className="text-blue-400 font-semibold text-sm mb-3 flex items-center gap-2">
              <Zap className="w-4 h-4" /> Tips
            </h3>
            <ul className="space-y-2 text-xs text-gray-400">
              <li className="flex gap-2"><span className="text-blue-400 mt-0.5">•</span> Use clear, well-lit images for best accuracy</li>
              <li className="flex gap-2"><span className="text-blue-400 mt-0.5">•</span> Overhead/angled views work best</li>
              <li className="flex gap-2"><span className="text-blue-400 mt-0.5">•</span> Video processing samples frames automatically</li>
              <li className="flex gap-2"><span className="text-blue-400 mt-0.5">•</span> Min confidence threshold is 25%</li>
              <li className="flex gap-2"><span className="text-blue-400 mt-0.5">•</span> Supports JPG, PNG, MP4, AVI, MOV</li>
            </ul>
          </div>

          {/* API endpoints reference */}
          <div className="glass-card p-5">
            <h3 className="text-gray-300 font-semibold text-sm mb-3">API Endpoints</h3>
            <div className="space-y-2 text-xs font-mono">
              <div className="flex items-center gap-2">
                <span className="text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded text-[10px]">GET</span>
                <span className="text-gray-400">/health</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-blue-400 bg-blue-500/10 px-1.5 py-0.5 rounded text-[10px]">POST</span>
                <span className="text-gray-400">/detect/image</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-blue-400 bg-blue-500/10 px-1.5 py-0.5 rounded text-[10px]">POST</span>
                <span className="text-gray-400">/detect/video</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
