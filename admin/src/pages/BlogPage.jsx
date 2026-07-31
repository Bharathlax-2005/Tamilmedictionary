import { useState, useEffect } from 'react'
import { getBlogs, createBlog, updateBlog, deleteBlog } from '../services/api'
import LoadingSpinner from '../components/LoadingSpinner'
import Modal from '../components/Modal'
import { Plus, Edit2, Trash2 } from 'lucide-react'

export default function BlogPage() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingPost, setEditingPost] = useState(null)
  const [formData, setFormData] = useState({
    title: '', slug: '', excerpt: '', content: '', author: 'TamilMeDictionary Team', cover_image: '', tags: '', is_published: true,
  })
  const [saving, setSaving] = useState(false)

  const fetchPosts = async () => {
    setLoading(true)
    try {
      const res = await getBlogs()
      setPosts(res.data.posts || [])
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchPosts() }, [])

  const openCreateModal = () => {
    setEditingPost(null)
    setFormData({ title: '', slug: '', excerpt: '', content: '', author: 'TamilMeDictionary Team', cover_image: '', tags: '', is_published: true })
    setIsModalOpen(true)
  }

  const openEditModal = (post) => {
    setEditingPost(post)
    setFormData({
      title: post.title || '',
      slug: post.slug || '',
      excerpt: post.excerpt || '',
      content: post.content || '',
      author: post.author || 'TamilMeDictionary Team',
      cover_image: post.cover_image || '',
      tags: Array.isArray(post.tags) ? post.tags.join(', ') : '',
      is_published: post.is_published ?? true,
    })
    setIsModalOpen(true)
  }

  const handleTitleChange = (e) => {
    const title = e.target.value
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
    setFormData(prev => ({ ...prev, title, slug: editingPost ? prev.slug : slug }))
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    const payload = {
      ...formData,
      tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
    }

    try {
      if (editingPost) {
        await updateBlog(editingPost.id, payload)
      } else {
        await createBlog(payload)
      }
      setIsModalOpen(false)
      fetchPosts()
    } catch (err) {
      alert(err.response?.data?.detail || 'Failed to save blog post')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this post permanently?')) return
    try {
      await deleteBlog(id)
      fetchPosts()
    } catch {
      alert('Failed to delete post')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Blog Posts</h1>
          <p className="text-slate-500 text-sm">Publish news, insights, and research articles.</p>
        </div>
        <button onClick={openCreateModal} className="btn-primary">
          <Plus size={16} /> Create Article
        </button>
      </div>

      <div className="soft-card overflow-hidden">
        {loading ? (
          <LoadingSpinner />
        ) : posts.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3.5">Title</th>
                  <th className="px-6 py-3.5">Author</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {posts.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-800">
                      <div>{p.title}</div>
                      <div className="text-xs text-slate-400 font-mono">/blog/{p.slug}</div>
                    </td>
                    <td className="px-6 py-4">{p.author}</td>
                    <td className="px-6 py-4">
                      {p.is_published ? (
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-700">Published</span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-700">Draft</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => openEditModal(p)} className="p-1.5 rounded-lg text-slate-400 hover:text-primary-600 hover:bg-primary-50">
                          <Edit2 size={16} />
                        </button>
                        <button onClick={() => handleDelete(p.id)} className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50">
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
          <div className="p-8 text-center text-slate-500">No blog posts found.</div>
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingPost ? "Edit Blog Post" : "Create Blog Post"} size="lg">
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Article Title *</label>
            <input type="text" required value={formData.title} onChange={handleTitleChange} className="form-input" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">URL Slug *</label>
            <input type="text" required value={formData.slug} onChange={e => setFormData({ ...formData, slug: e.target.value })} className="form-input font-mono text-xs" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Excerpt *</label>
            <textarea rows={2} required value={formData.excerpt} onChange={e => setFormData({ ...formData, excerpt: e.target.value })} className="form-input resize-none" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Main Content *</label>
            <textarea rows={6} required value={formData.content} onChange={e => setFormData({ ...formData, content: e.target.value })} className="form-input resize-none font-sans" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Author</label>
              <input type="text" value={formData.author} onChange={e => setFormData({ ...formData, author: e.target.value })} className="form-input" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Tags (comma separated)</label>
              <input type="text" value={formData.tags} onChange={e => setFormData({ ...formData, tags: e.target.value })} className="form-input" placeholder="translation, guide" />
            </div>
          </div>
          <div className="flex items-center gap-2 pt-2">
            <input type="checkbox" id="is_published" checked={formData.is_published} onChange={e => setFormData({ ...formData, is_published: e.target.checked })} className="rounded text-primary-600" />
            <label htmlFor="is_published" className="text-sm text-slate-700">Publish immediately</label>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button type="button" onClick={() => setIsModalOpen(false)} className="btn-ghost">Cancel</button>
            <button type="submit" disabled={saving} className="btn-primary">
              {saving ? 'Saving...' : editingPost ? 'Update Post' : 'Publish Article'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
