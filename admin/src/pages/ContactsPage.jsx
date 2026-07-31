import { useState, useEffect } from 'react'
import { getContacts, markContactRead, deleteContact } from '../services/api'
import LoadingSpinner from '../components/LoadingSpinner'
import Modal from '../components/Modal'
import { Check, Trash2, Eye } from 'lucide-react'

export default function ContactsPage() {
  const [submissions, setSubmissions] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [viewingContact, setViewingContact] = useState(null)
  const [unreadOnly, setUnreadOnly] = useState(false)

  const fetchContacts = async () => {
    setLoading(true)
    try {
      const res = await getContacts({ unread_only: unreadOnly })
      setSubmissions(res.data.submissions || [])
      setTotal(res.data.total || 0)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchContacts() }, [unreadOnly])

  const handleMarkRead = async (id) => {
    try {
      await markContactRead(id)
      fetchContacts()
    } catch {
      alert('Failed to mark as read')
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this submission?')) return
    try {
      await deleteContact(id)
      if (viewingContact?.id === id) setViewingContact(null)
      fetchContacts()
    } catch {
      alert('Failed to delete submission')
    }
  }

  const handleOpenDetail = (c) => {
    setViewingContact(c)
    if (!c.is_read) handleMarkRead(c.id)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Contact & Contribution Submissions</h1>
          <p className="text-slate-500 text-sm">Review messages and term contributions submitted via the website.</p>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="unread"
            checked={unreadOnly}
            onChange={e => setUnreadOnly(e.target.checked)}
            className="rounded text-primary-600"
          />
          <label htmlFor="unread" className="text-sm font-medium text-slate-700">Show Unread Only</label>
        </div>
      </div>

      <div className="soft-card overflow-hidden">
        {loading ? (
          <LoadingSpinner />
        ) : submissions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5">Name</th>
                  <th className="px-6 py-3.5">Email</th>
                  <th className="px-6 py-3.5">Organization</th>
                  <th className="px-6 py-3.5">Date</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {submissions.map((c) => (
                  <tr key={c.id} className={`hover:bg-slate-50/50 transition-colors ${!c.is_read ? 'bg-amber-50/30 font-medium' : ''}`}>
                    <td className="px-6 py-4">
                      {c.is_read ? (
                        <span className="badge-status-read">Read</span>
                      ) : (
                        <span className="badge-status-unread">Unread</span>
                      )}
                    </td>
                    <td className="px-6 py-4 font-semibold text-slate-800">{c.first_name} {c.last_name}</td>
                    <td className="px-6 py-4">
                      <a href={`mailto:${c.email}`} className="text-primary-600 hover:underline">{c.email}</a>
                    </td>
                    <td className="px-6 py-4 text-slate-500">{c.company || '—'}</td>
                    <td className="px-6 py-4 text-xs text-slate-400">
                      {c.created_at ? new Date(c.created_at).toLocaleDateString() : '—'}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => handleOpenDetail(c)} className="p-1.5 rounded-lg text-slate-400 hover:text-primary-600 hover:bg-primary-50">
                          <Eye size={16} />
                        </button>
                        {!c.is_read && (
                          <button onClick={() => handleMarkRead(c.id)} className="p-1.5 rounded-lg text-slate-400 hover:text-green-600 hover:bg-green-50" title="Mark Read">
                            <Check size={16} />
                          </button>
                        )}
                        <button onClick={() => handleDelete(c.id)} className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center text-slate-500">No submissions found.</div>
        )}
      </div>

      <Modal isOpen={!!viewingContact} onClose={() => setViewingContact(null)} title="Contact Submission Details">
        {viewingContact && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 pb-4 border-b border-slate-100 text-sm">
              <div>
                <p className="text-xs text-slate-400">Name</p>
                <p className="font-semibold text-slate-800">{viewingContact.first_name} {viewingContact.last_name}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400">Email</p>
                <a href={`mailto:${viewingContact.email}`} className="font-semibold text-primary-600 hover:underline">{viewingContact.email}</a>
              </div>
              <div>
                <p className="text-xs text-slate-400">Organization</p>
                <p className="font-medium text-slate-700">{viewingContact.company || 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400">Submitted Date</p>
                <p className="font-medium text-slate-700">{viewingContact.created_at ? new Date(viewingContact.created_at).toLocaleString() : 'N/A'}</p>
              </div>
            </div>
            <div>
              <p className="text-xs text-slate-400 mb-2">Message</p>
              <div className="p-4 bg-slate-50 rounded-xl text-slate-700 text-sm whitespace-pre-wrap leading-relaxed border border-slate-200">
                {viewingContact.message}
              </div>
            </div>
            <div className="flex justify-between items-center pt-4">
              <a href={`mailto:${viewingContact.email}?subject=RE: TamilMeDictionary Inquiry`} className="btn-primary">
                Reply via Email
              </a>
              <button onClick={() => handleDelete(viewingContact.id)} className="btn-danger">
                Delete Submission
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
