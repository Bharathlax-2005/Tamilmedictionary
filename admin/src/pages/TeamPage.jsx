import { useState, useEffect } from 'react'
import {
  getTeamMembers, createTeamMember, updateTeamMember, deleteTeamMember
} from '../services/api'
import {
  Plus, Edit2, Trash2, Users, Image as ImageIcon,
  CheckCircle2, AlertCircle, RefreshCw, X, Link as LinkIcon, MoveUp, MoveDown
} from 'lucide-react'

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

    // Save order changes
    try {
      await Promise.all(
        newMembers.map((m, idx) => updateTeamMember(m.id, { order: idx + 1 }))
      )
      setSuccess('Reordered successfully!')
    } catch {
      fetchMembers()
    }
  }

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
            Manage the "Meet The Team" section displayed on the About page. Changes automatically reflect on live site.
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
      {success && (
        <div className="flex items-center gap-2 p-4 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-sm">
          <CheckCircle2 size={18} /> {success}
        </div>
      )}
      {error && (
        <div className="flex items-center gap-2 p-4 bg-rose-50 text-rose-800 border border-rose-200 rounded-xl text-sm">
          <AlertCircle size={18} /> {error}
        </div>
      )}

      {/* Member Cards Grid */}
      {loading ? (
        <div className="p-12 text-center text-slate-500 flex items-center justify-center gap-2">
          <RefreshCw size={20} className="animate-spin" /> Loading team members...
        </div>
      ) : members.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center text-slate-500">
          No team members found. Click "Add Team Member" to create your first team profile!
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {members.map((member, idx) => (
            <div
              key={member.id}
              className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                {/* Image Frame */}
                <div className="relative h-48 bg-slate-100 overflow-hidden">
                  <img
                    src={member.image || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80'}
                    alt={member.name}
                    className="w-full h-full object-cover object-top"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80'
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white">
                    <span className="text-xs font-bold bg-primary-600/90 px-2.5 py-0.5 rounded-full backdrop-blur-sm">
                      {member.role}
                    </span>
                    <span className="text-[10px] text-slate-300 font-mono">
                      Order: #{idx + 1}
                    </span>
                  </div>
                </div>

                {/* Body details */}
                <div className="p-5 space-y-2">
                  <h3 className="font-bold text-slate-900 text-lg">{member.name}</h3>
                  <div className="text-xs text-slate-400 space-y-1">
                    {member.facebook && <p className="truncate flex items-center gap-1"><LinkIcon size={12} /> FB: {member.facebook}</p>}
                    {member.twitter && <p className="truncate flex items-center gap-1"><LinkIcon size={12} /> X: {member.twitter}</p>}
                    {member.linkedin && <p className="truncate flex items-center gap-1"><LinkIcon size={12} /> LI: {member.linkedin}</p>}
                  </div>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <button
                    disabled={idx === 0}
                    onClick={() => handleMoveOrder(idx, 'up')}
                    className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-40"
                    title="Move Up"
                  >
                    <MoveUp size={14} />
                  </button>
                  <button
                    disabled={idx === members.length - 1}
                    onClick={() => handleMoveOrder(idx, 'down')}
                    className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-40"
                    title="Move Down"
                  >
                    <MoveDown size={14} />
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenEdit(member)}
                    className="px-3 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800 flex items-center gap-1"
                  >
                    <Edit2 size={13} /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(member)}
                    className="px-3 py-1.5 bg-rose-100 text-rose-700 rounded-lg text-xs font-semibold hover:bg-rose-200 flex items-center gap-1"
                  >
                    <Trash2 size={13} /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
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
                <p className="text-xs text-slate-400">Fill in the fields below to update the About page.</p>
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
                <label className="block text-xs font-bold text-slate-700 mb-1">Profile Image URL</label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={form.image}
                    onChange={(e) => setForm((f) => ({ ...f, image: e.target.value }))}
                    placeholder="https://images.unsplash.com/..."
                    className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                  />
                </div>
                <p className="text-[10px] text-slate-400 mt-1">Provide a direct image URL or photo link.</p>
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
    </div>
  )
}
