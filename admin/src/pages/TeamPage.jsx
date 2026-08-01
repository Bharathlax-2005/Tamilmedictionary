import { useState, useEffect, useRef } from 'react'
import {
  getTeamMembers, createTeamMember, updateTeamMember, deleteTeamMember, uploadTeamPhoto
} from '../services/api'
import {
  Plus, Edit2, Trash2, Users, Image as ImageIcon,
  CheckCircle2, AlertCircle, RefreshCw, X, Link as LinkIcon, MoveUp, MoveDown, Upload,
  ZoomIn, ZoomOut, RotateCw, RefreshCcw, Check, Crop
} from 'lucide-react'

// ─── Interactive Image Cropper Modal ──────────────────────────────────────────
function ImageCropperModal({ imageSrc, isOpen, onClose, onCropComplete }) {
  const [zoom, setZoom] = useState(1)
  const [rotation, setRotation] = useState(0)
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [processing, setProcessing] = useState(false)

  const canvasRef = useRef(null)
  const imgRef = useRef(null)

  useEffect(() => {
    if (imageSrc) {
      const img = new Image()
      img.crossOrigin = 'anonymous'
      img.src = imageSrc
      img.onload = () => {
        imgRef.current = img
        setZoom(1)
        setRotation(0)
        setOffset({ x: 0, y: 0 })
        drawCanvas()
      }
    }
  }, [imageSrc])

  useEffect(() => {
    drawCanvas()
  }, [zoom, rotation, offset])

  const drawCanvas = () => {
    const canvas = canvasRef.current
    const img = imgRef.current
    if (!canvas || !img) return

    const ctx = canvas.getContext('2d')
    const width = 400
    const height = 500

    canvas.width = width
    canvas.height = height

    ctx.clearRect(0, 0, width, height)

    ctx.save()
    ctx.translate(width / 2 + offset.x, height / 2 + offset.y)
    ctx.rotate((rotation * Math.PI) / 180)
    ctx.scale(zoom, zoom)

    const scale = Math.max(width / img.width, height / img.height)
    const drawW = img.width * scale
    const drawH = img.height * scale

    ctx.drawImage(img, -drawW / 2, -drawH / 2, drawW, drawH)
    ctx.restore()
  }

  const handleMouseDown = (e) => {
    setIsDragging(true)
    setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y })
  }

  const handleMouseMove = (e) => {
    if (!isDragging) return
    setOffset({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    })
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleSaveCrop = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    setProcessing(true)

    canvas.toBlob((blob) => {
      setProcessing(false)
      if (blob) {
        onCropComplete(blob)
      }
    }, 'image/jpeg', 0.92)
  }

  if (!isOpen || !imageSrc) return null

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2 text-primary-600 font-bold text-base">
            <Crop size={20} /> Adjust & Crop Team Photo
          </div>
          <button onClick={onClose} className="p-1 rounded-full text-slate-400 hover:bg-slate-100">
            <X size={18} />
          </button>
        </div>

        <p className="text-xs text-slate-500">
          Drag photo to position face. Use the zoom slider to resize inside the 4:5 portrait frame.
        </p>

        {/* Interactive Canvas Container with Visible Bounding Crop Box */}
        <div
          className="relative w-full aspect-[4/5] bg-slate-950 rounded-2xl overflow-hidden cursor-grab active:cursor-grabbing border border-slate-800 shadow-2xl flex items-center justify-center select-none group"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <canvas ref={canvasRef} className="w-full h-full object-contain pointer-events-none" />

          {/* Active Visible Bounding Crop Box Frame */}
          <div className="absolute inset-4 border-2 border-primary-400 ring-4 ring-primary-500/20 rounded-xl pointer-events-none shadow-[0_0_0_9999px_rgba(15,23,42,0.65)] flex flex-col justify-between p-2">
            {/* Top Corner Brackets */}
            <div className="w-full flex justify-between">
              <div className="w-4 h-4 border-t-4 border-l-4 border-white rounded-tl shadow-md" />
              <div className="w-4 h-4 border-t-4 border-r-4 border-white rounded-tr shadow-md" />
            </div>

            {/* Rule of Thirds Alignment Grid */}
            <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none opacity-30">
              <div className="border-r border-b border-white" />
              <div className="border-r border-b border-white" />
              <div className="border-b border-white" />
              <div className="border-r border-b border-white" />
              <div className="border-r border-b border-white" />
              <div className="border-b border-white" />
              <div className="border-r border-white" />
              <div className="border-r border-white" />
              <div />
            </div>

            {/* Visible Dimensions & Aspect Ratio Badge */}
            <div className="self-center z-10 bg-primary-600/90 text-white font-mono font-bold text-[11px] px-3 py-1 rounded-full shadow-lg border border-white/20 backdrop-blur-md flex items-center gap-1.5">
              <span>Crop Area: 500 × 600 px</span>
              <span className="text-primary-300">|</span>
              <span>4:5 Portrait</span>
            </div>

            {/* Bottom Corner Brackets */}
            <div className="w-full flex justify-between">
              <div className="w-4 h-4 border-b-4 border-l-4 border-white rounded-bl shadow-md" />
              <div className="w-4 h-4 border-b-4 border-r-4 border-white rounded-br shadow-md" />
            </div>
          </div>
        </div>


        {/* Interactive Controls */}
        <div className="space-y-3 pt-2">
          {/* Zoom Slider */}
          <div className="flex items-center gap-3">
            <ZoomOut size={16} className="text-slate-400" />
            <input
              type="range"
              min="0.8"
              max="2.5"
              step="0.05"
              value={zoom}
              onChange={(e) => setZoom(parseFloat(e.target.value))}
              className="flex-1 accent-primary-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
            />
            <ZoomIn size={16} className="text-slate-400" />
            <span className="text-xs font-mono font-bold text-slate-600 w-10 text-right">
              {Math.round(zoom * 100)}%
            </span>
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-between pt-1">
            <button
              type="button"
              onClick={() => setRotation((r) => (r + 90) % 360)}
              className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs flex items-center gap-1.5"
            >
              <RotateCw size={14} /> Rotate 90°
            </button>
            <button
              type="button"
              onClick={() => { setZoom(1); setRotation(0); setOffset({ x: 0, y: 0 }) }}
              className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs flex items-center gap-1.5"
            >
              <RefreshCcw size={14} /> Reset
            </button>
          </div>
        </div>

        {/* Modal Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSaveCrop}
            disabled={processing}
            className="px-5 py-2 rounded-xl bg-primary-600 hover:bg-primary-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md disabled:opacity-60"
          >
            {processing ? 'Processing...' : <><Check size={16} /> Crop & Save Photo</>}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function TeamPage() {
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Modal / Form state
  const [showModal, setShowModal] = useState(false)
  const [editingMember, setEditingMember] = useState(null)

  const [form, setForm] = useState({
    name: '',
    role: '',
    image: '',
    facebook: '',
    twitter: '',
    linkedin: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [uploadingPhoto, setUploadingPhoto] = useState(false)
  const [photoError, setPhotoError] = useState('')
  const [useUrlMode, setUseUrlMode] = useState(false)

  // Cropper state
  const [cropperOpen, setCropperOpen] = useState(false)
  const [rawImageToCrop, setRawImageToCrop] = useState(null)
  const [pendingFileName, setPendingFileName] = useState('photo.jpg')

  const handlePhotoFileChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setPhotoError('')
    setPendingFileName(file.name || 'photo.jpg')
    const objectUrl = URL.createObjectURL(file)
    setRawImageToCrop(objectUrl)
    setCropperOpen(true)
    e.target.value = ''
  }

  const handleCropComplete = async (croppedBlob) => {
    setCropperOpen(false)
    setUploadingPhoto(true)
    setPhotoError('')
    const data = new FormData()
    data.append('file', croppedBlob, pendingFileName)
    try {
      const res = await uploadTeamPhoto(data)
      setForm((f) => ({ ...f, image: res.data.url }))
    } catch (err) {
      setPhotoError(err.response?.data?.detail || 'Failed to upload photo file.')
    } finally {
      setUploadingPhoto(false)
    }
  }

  const fetchMembers = async () => {
    setLoading(true)
    try {
      const res = await getTeamMembers()
      setMembers(res.data || [])
      setError('')
    } catch {
      setError('Failed to load team members.')
    } finally {
      setLoading(false)
    }
  }


  useEffect(() => {
    fetchMembers()
  }, [])

  const handleOpenAdd = () => {
    setEditingMember(null)
    setPhotoError('')
    setUseUrlMode(false)
    setForm({
      name: '',
      role: '',
      image: '',
      facebook: '',
      twitter: '',
      linkedin: '',
    })
    setShowModal(true)
  }

  const handleOpenEdit = (member) => {
    setEditingMember(member)
    setPhotoError('')
    setUseUrlMode(false)
    setForm({
      name: member.name || '',
      role: member.role || '',
      image: member.image || '',
      facebook: member.facebook || '',
      twitter: member.twitter || '',
      linkedin: member.linkedin || '',
    })
    setShowModal(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    setSuccess('')

    try {
      if (editingMember) {
        await updateTeamMember(editingMember.id, form)
        setSuccess(`Team member '${form.name}' updated successfully!`)
      } else {
        await createTeamMember({ ...form, order: members.length + 1 })
        setSuccess(`Team member '${form.name}' added successfully!`)
      }
      setShowModal(false)
      fetchMembers()
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to save team member.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (member) => {
    if (!window.confirm(`Are you sure you want to delete '${member.name}'?`)) return
    try {
      await deleteTeamMember(member.id)
      setSuccess(`Team member '${member.name}' deleted.`)
      fetchMembers()
    } catch {
      setError('Failed to delete team member.')
    }
  }

  const handleMoveOrder = async (index, direction) => {
    const targetIdx = direction === 'up' ? index - 1 : index + 1
    if (targetIdx < 0 || targetIdx >= members.length) return

    const newMembers = [...members]
    const temp = newMembers[index]
    newMembers[index] = newMembers[targetIdx]
    newMembers[targetIdx] = temp

    setMembers(newMembers)

    try {
      await Promise.all(
        newMembers.map((m, idx) => updateTeamMember(m.id, { order: idx + 1 }))
      )
      setSuccess('Reordered successfully!')
    } catch {
      fetchMembers()
    }
  }

  const [viewMode, setViewMode] = useState('cards') // 'cards' | 'table'

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 text-white p-6 rounded-2xl">
        <div>
          <div className="flex items-center gap-2 text-primary-400 font-semibold text-xs uppercase tracking-wider mb-1">
            <Users size={16} /> Admin Management
          </div>
          <h1 className="text-2xl font-bold">Team Management</h1>
          <p className="text-slate-400 text-xs mt-1">
            Manage the "Meet The Team" section displayed on the About page. Photos auto-fit vertically with 4:5 portrait aspect ratio.
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 bg-primary-600 hover:bg-primary-500 text-white font-bold rounded-xl text-sm flex items-center justify-center gap-2 shadow-lg transition-colors"
        >
          <Plus size={18} /> Add Team Member
        </button>
      </div>

      {/* Notifications */}
      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-semibold flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
          <button onClick={() => setError('')} className="hover:text-rose-900">
            <X size={14} />
          </button>
        </div>
      )}

      {success && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl text-xs font-semibold flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={16} />
            <span>{success}</span>
          </div>
          <button onClick={() => setSuccess('')} className="hover:text-emerald-900">
            <X size={14} />
          </button>
        </div>
      )}

      {/* Main Team Section Header & View Switcher */}
      <div className="flex items-center justify-between px-1">
        <h3 className="font-bold text-slate-800 text-lg">Active Team Profiles ({members.length})</h3>
        <div className="flex items-center gap-2 bg-slate-200/70 p-1 rounded-xl">
          <button
            onClick={() => setViewMode('cards')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${viewMode === 'cards' ? 'bg-white text-primary-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
          >
            Vertical Cards View
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${viewMode === 'table' ? 'bg-white text-primary-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
          >
            Table View
          </button>
        </div>
      </div>

      {loading ? (
        <div className="p-12 bg-white rounded-2xl border border-slate-200 text-center text-slate-400 font-medium">Loading team members...</div>
      ) : members.length === 0 ? (
        <div className="p-12 bg-white rounded-2xl border border-slate-200 text-center text-slate-400">No team members found. Click "Add Team Member" to create one.</div>
      ) : viewMode === 'cards' ? (
        /* Vertical Portrait Cards View Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {members.map((member, index) => (
            <div
              key={member.id}
              className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                {/* Compact Vertical Portrait Image Header */}
                <div className="relative h-48 sm:h-52 w-full bg-slate-900 overflow-hidden">
                  <img
                    src={member.image || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80'}
                    alt={member.name}
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      e.target.onerror = null
                      e.target.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80'
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
                  
                  {/* Badge & Order */}
                  <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between">
                    <span className="text-[11px] font-bold text-white bg-primary-600/90 backdrop-blur-md px-2.5 py-1 rounded-full shadow">
                      {member.role}
                    </span>
                    <span className="text-[10px] text-slate-300 font-mono bg-slate-900/60 backdrop-blur-md px-2 py-0.5 rounded-full">
                      #{index + 1}
                    </span>
                  </div>
                </div>

                {/* Profile Information */}
                <div className="p-4 space-y-1">
                  <h4 className="text-base font-extrabold text-slate-900">{member.name}</h4>
                  <p className="text-[11px] font-semibold text-primary-600">{member.role}</p>
                </div>
              </div>


              {/* Action Toolbar */}
              <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <button
                    disabled={index === 0}
                    onClick={() => handleMoveOrder(index, 'up')}
                    className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-30"
                    title="Move Up"
                  >
                    <MoveUp size={14} />
                  </button>
                  <button
                    disabled={index === members.length - 1}
                    onClick={() => handleMoveOrder(index, 'down')}
                    className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-30"
                    title="Move Down"
                  >
                    <MoveDown size={14} />
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenEdit(member)}
                    className="px-3 py-1.5 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800 flex items-center gap-1 shadow-sm"
                  >
                    <Edit2 size={13} /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(member)}
                    className="px-3 py-1.5 bg-rose-100 text-rose-700 rounded-xl text-xs font-semibold hover:bg-rose-200 flex items-center gap-1"
                  >
                    <Trash2 size={13} /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Table View */
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-100 text-xs">
                <tr>
                  <th className="px-5 py-3.5 w-12 text-center">Order</th>
                  <th className="px-5 py-3.5">Photo</th>
                  <th className="px-5 py-3.5">Name</th>
                  <th className="px-5 py-3.5">Role / Title</th>
                  <th className="px-5 py-3.5">Social Links</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {members.map((member, index) => (
                  <tr key={member.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-5 py-4 text-center">
                      <div className="flex flex-col items-center gap-1">
                        <button
                          onClick={() => handleMoveOrder(index, 'up')}
                          disabled={index === 0}
                          className="p-1 text-slate-400 hover:text-primary-600 disabled:opacity-30"
                        >
                          <MoveUp size={14} />
                        </button>
                        <span className="text-xs font-mono font-bold text-slate-500">{index + 1}</span>
                        <button
                          onClick={() => handleMoveOrder(index, 'down')}
                          disabled={index === members.length - 1}
                          className="p-1 text-slate-400 hover:text-primary-600 disabled:opacity-30"
                        >
                          <MoveDown size={14} />
                        </button>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      {member.image ? (
                        <img
                          src={member.image}
                          alt={member.name}
                          className="w-12 h-14 rounded-xl object-cover border border-slate-200 shadow-sm"
                          onError={(e) => {
                            e.target.onerror = null
                            e.target.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
                          }}
                        />
                      ) : (
                        <div className="w-12 h-14 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400">
                          <ImageIcon size={18} />
                        </div>
                      )}
                    </td>

                    <td className="px-5 py-4 font-bold text-slate-800">{member.name}</td>
                    <td className="px-5 py-4 text-slate-600">{member.role}</td>

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        {member.facebook && <span className="text-blue-600 font-semibold">FB</span>}
                        {member.twitter && <span className="text-sky-500 font-semibold">X</span>}
                        {member.linkedin && <span className="text-blue-700 font-semibold">IN</span>}
                        {!member.facebook && !member.twitter && !member.linkedin && <span>None</span>}
                      </div>
                    </td>

                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEdit(member)}
                          className="p-2 rounded-xl text-slate-400 hover:text-primary-600 hover:bg-primary-50 transition-colors"
                          title="Edit Member"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(member)}
                          className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                          title="Delete Member"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Admin Form Modal (Add / Edit Team Member) ────────────────────── */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-5 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-xl font-bold text-slate-900">
                  {editingMember ? 'Edit Team Member' : 'Add Team Member'}
                </h3>
                <p className="text-xs text-slate-400">Upload a photo from device or fill details for the About page.</p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  placeholder="e.g. Don Francis"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Role / Designation *</label>
                <input
                  type="text"
                  required
                  value={form.role}
                  onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
                  placeholder="e.g. Founder & CEO"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-slate-700">Team Member Photo</label>
                  <button
                    type="button"
                    onClick={() => setUseUrlMode(!useUrlMode)}
                    className="text-[11px] font-semibold text-primary-600 hover:underline flex items-center gap-1"
                  >
                    {useUrlMode ? 'Upload from Device' : 'Paste Image URL instead'}
                  </button>
                </div>

                {!useUrlMode ? (
                  <div className="space-y-2">
                    <label className="flex flex-col items-center justify-center gap-2 p-4 border-2 border-dashed border-slate-300 hover:border-primary-500 rounded-2xl cursor-pointer bg-slate-50 hover:bg-primary-50/30 transition-all text-xs font-semibold text-slate-700">
                      <div className="w-10 h-10 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center">
                        <Upload size={20} />
                      </div>
                      <span>{uploadingPhoto ? 'Uploading Photo...' : 'Click to Upload Photo File from Computer'}</span>
                      <span className="text-[10px] text-slate-400">Supports PNG, JPG, JPEG, WEBP, SVG</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoFileChange}
                        disabled={uploadingPhoto}
                        className="hidden"
                      />
                    </label>

                    {photoError && <p className="text-xs text-rose-500 font-medium">{photoError}</p>}
                  </div>
                ) : (
                  <div>
                    <input
                      type="url"
                      value={form.image}
                      onChange={(e) => setForm((f) => ({ ...f, image: e.target.value }))}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                    />
                  </div>
                )}

                {/* Photo Preview */}
                {form.image && (
                  <div className="mt-3 p-2.5 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={form.image}
                        alt="Preview"
                        className="w-12 h-12 rounded-xl object-cover border border-slate-300 flex-shrink-0"
                        onError={(e) => { e.target.style.display = 'none' }}
                      />
                      <div className="text-xs min-w-0">
                        <p className="font-semibold text-slate-800 truncate">{form.image}</p>
                        <p className="text-[10px] text-emerald-600 font-bold">✓ Photo Selected</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setForm((f) => ({ ...f, image: '' }))}
                      className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-white transition-colors"
                      title="Remove Photo"
                    >
                      <X size={16} />
                    </button>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Facebook URL</label>
                  <input
                    type="text"
                    value={form.facebook}
                    onChange={(e) => setForm((f) => ({ ...f, facebook: e.target.value }))}
                    placeholder="https://facebook.com/..."
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Twitter / X URL</label>
                  <input
                    type="text"
                    value={form.twitter}
                    onChange={(e) => setForm((f) => ({ ...f, twitter: e.target.value }))}
                    placeholder="https://twitter.com/..."
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">LinkedIn URL</label>
                  <input
                    type="text"
                    value={form.linkedin}
                    onChange={(e) => setForm((f) => ({ ...f, linkedin: e.target.value }))}
                    placeholder="https://linkedin.com/in/..."
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>

              {/* Form Action Buttons */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
                >
                  Cancel
                </button>
                {editingMember && (
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false)
                      handleDelete(editingMember)
                    }}
                    className="px-4 py-2 rounded-xl bg-rose-100 hover:bg-rose-200 text-rose-700 font-bold text-xs"
                  >
                    Delete
                  </button>
                )}
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md disabled:opacity-60"
                >
                  {submitting ? 'Saving...' : editingMember ? 'Update Member' : 'Save Member'}
                </button>

              </div>
            </form>
          </div>
        </div>
      )}


      {/* Interactive Image Cropper Modal */}
      <ImageCropperModal
        isOpen={cropperOpen}
        imageSrc={rawImageToCrop}
        onClose={() => setCropperOpen(false)}
        onCropComplete={handleCropComplete}
      />
    </div>
  )
}


