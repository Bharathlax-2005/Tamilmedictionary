import { useState, useEffect } from 'react'
import { getProducts, createProduct, updateProduct, deleteProduct } from '../services/api'
import LoadingSpinner from '../components/LoadingSpinner'
import Modal from '../components/Modal'
import { Plus, Edit2, Trash2 } from 'lucide-react'

export default function ShopPage() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [formData, setFormData] = useState({
    name: '', description: '', price: 0, original_price: '', category: 'Books', is_available: true, order: 0,
  })
  const [saving, setSaving] = useState(false)

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const res = await getProducts()
      setProducts(res.data.products || [])
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchProducts() }, [])

  const openCreateModal = () => {
    setEditingProduct(null)
    setFormData({ name: '', description: '', price: 0, original_price: '', category: 'Books', is_available: true, order: products.length + 1 })
    setIsModalOpen(true)
  }

  const openEditModal = (p) => {
    setEditingProduct(p)
    setFormData({
      name: p.name || '',
      description: p.description || '',
      price: p.price || 0,
      original_price: p.original_price ?? '',
      category: p.category || 'Books',
      is_available: p.is_available ?? true,
      order: p.order || 0,
    })
    setIsModalOpen(true)
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    const payload = {
      ...formData,
      price: parseFloat(formData.price) || 0,
      original_price: formData.original_price !== '' ? parseFloat(formData.original_price) : null,
    }

    try {
      if (editingProduct) {
        await updateProduct(editingProduct.id, payload)
      } else {
        await createProduct(payload)
      }
      setIsModalOpen(false)
      fetchProducts()
    } catch (err) {
      alert(err.response?.data?.detail || 'Failed to save product')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return
    try {
      await deleteProduct(id)
      fetchProducts()
    } catch {
      alert('Failed to delete product')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Shop Products & Resources</h1>
          <p className="text-slate-500 text-sm">Manage books, PDFs, and learning materials on the Shop page.</p>
        </div>
        <button onClick={openCreateModal} className="btn-primary">
          <Plus size={16} /> Add Product
        </button>
      </div>

      <div className="soft-card overflow-hidden">
        {loading ? (
          <LoadingSpinner />
        ) : products.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3.5">Name</th>
                  <th className="px-6 py-3.5">Category</th>
                  <th className="px-6 py-3.5">Price</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-semibold text-slate-800">
                      <div>{p.name}</div>
                      <div className="text-xs text-slate-400 font-normal line-clamp-1">{p.description}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600">{p.category}</span>
                    </td>
                    <td className="px-6 py-4 font-bold text-primary-600">
                      {p.price === 0 ? 'Free' : `₹${p.price}`}
                    </td>
                    <td className="px-6 py-4">
                      {p.is_available ? (
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-700">Available</span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-700">Unavailable</span>
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
          <div className="p-8 text-center text-slate-500">No products found.</div>
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingProduct ? "Edit Product" : "Add Product"}>
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Product Name *</label>
            <input type="text" required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="form-input" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Description *</label>
            <textarea rows={3} required value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} className="form-input resize-none" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Price (₹, 0 for free) *</label>
              <input type="number" step="0.01" required value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} className="form-input" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Original Price (₹, optional)</label>
              <input type="number" step="0.01" value={formData.original_price} onChange={e => setFormData({ ...formData, original_price: e.target.value })} className="form-input" placeholder="For strike-through discount" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Category</label>
            <input type="text" value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} className="form-input" placeholder="Books, Digital, Worksheets" />
          </div>
          <div className="flex items-center gap-2 pt-2">
            <input type="checkbox" id="is_available" checked={formData.is_available} onChange={e => setFormData({ ...formData, is_available: e.target.checked })} className="rounded text-primary-600" />
            <label htmlFor="is_available" className="text-sm text-slate-700">Available for purchase/download</label>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button type="button" onClick={() => setIsModalOpen(false)} className="btn-ghost">Cancel</button>
            <button type="submit" disabled={saving} className="btn-primary">
              {saving ? 'Saving...' : editingProduct ? 'Update Product' : 'Create Product'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
