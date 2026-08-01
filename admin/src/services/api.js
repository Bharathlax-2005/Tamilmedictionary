import axios from 'axios'

const api = axios.create({ baseURL: '/', timeout: 30000 })

// Attach token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Auto-refresh on 401
api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const original = err.config
    if (err.response?.status === 401 && !original._retry) {
      original._retry = true
      const refreshToken = localStorage.getItem('refresh_token')
      if (refreshToken) {
        try {
          const r = await axios.post('/api/auth/refresh', { refresh_token: refreshToken })
          localStorage.setItem('access_token', r.data.access_token)
          localStorage.setItem('refresh_token', r.data.refresh_token)
          original.headers.Authorization = `Bearer ${r.data.access_token}`
          return api(original)
        } catch {
          localStorage.removeItem('access_token')
          localStorage.removeItem('refresh_token')
          window.location.href = '/login'
        }
      }
    }
    return Promise.reject(err)
  }
)

export default api

// ─── API Helpers ──────────────────────────────────────────────────────────────
export const adminStats = () => api.get('/api/admin/dashboard/stats')

// Terms
export const getTerms = (p) => api.get('/api/dictionary/terms', { params: p })
export const searchTermsAdmin = (q, p, category = '') => api.get('/api/dictionary/search', { params: { q, page: p, limit: 20, category: category || undefined } })
export const getCategoriesAdmin = () => api.get('/api/dictionary/categories')
export const createTerm = (d) => api.post('/api/dictionary/terms', d)
export const updateTerm = (id, d) => api.put(`/api/dictionary/terms/${id}`, d)
export const deleteTerm = (id) => api.delete(`/api/dictionary/terms/${id}`)
export const importTermsAdmin = (formData) => api.post('/api/dictionary/import', formData)

export const exportTermsAdmin = (format = 'json') => api.get('/api/dictionary/export', { params: { format }, responseType: 'blob' })


// Blog
export const getBlogs = (p) => api.get('/api/blog/posts', { params: { ...p, published_only: false } })
export const createBlog = (d) => api.post('/api/blog/posts', d)
export const updateBlog = (id, d) => api.put(`/api/blog/posts/${id}`, d)
export const deleteBlog = (id) => api.delete(`/api/blog/posts/${id}`)

// Services
export const getServices = () => api.get('/api/services/')
export const createService = (d) => api.post('/api/services/', d)
export const updateService = (id, d) => api.put(`/api/services/${id}`, d)
export const deleteService = (id) => api.delete(`/api/services/${id}`)

// Stats
export const getStats = () => api.get('/api/stats/')
export const createStat = (d) => api.post('/api/stats/', d)
export const updateStat = (id, d) => api.put(`/api/stats/${id}`, d)
export const deleteStat = (id) => api.delete(`/api/stats/${id}`)

// Contacts
export const getContacts = (p) => api.get('/api/contact/submissions', { params: p })
export const markContactRead = (id) => api.patch(`/api/contact/submissions/${id}/read`)
export const deleteContact = (id) => api.delete(`/api/contact/submissions/${id}`)

// Products
export const getProducts = () => api.get('/api/shop/products')
export const createProduct = (d) => api.post('/api/shop/products', d)
export const updateProduct = (id, d) => api.put(`/api/shop/products/${id}`, d)
export const deleteProduct = (id) => api.delete(`/api/shop/products/${id}`)

// Pages (CMS)
export const getAllPages = () => api.get('/api/pages/')
export const getPageContent = (slug) => api.get(`/api/pages/${slug}`)
export const updatePageContent = (slug, content) => api.put(`/api/pages/${slug}`, { content })

// Team Members
export const getTeamMembers = () => api.get('/api/team')
export const createTeamMember = (d) => api.post('/api/team', d)
export const updateTeamMember = (id, d) => api.put(`/api/team/${id}`, d)
export const deleteTeamMember = (id) => api.delete(`/api/team/${id}`)
export const reorderTeamMembers = (list) => api.post('/api/team/reorder', list)
export const uploadTeamPhoto = (formData) => api.post('/api/team/upload-photo', formData)


// Collections
export const getCollections = () => api.get('/api/collections/')

export const createCollection = (formData, onProgress) =>
  api.post('/api/collections/', formData, {
    timeout: 0, // No timeout for large file uploads
    onUploadProgress: (progressEvent) => {
      if (onProgress) {
        const total = progressEvent.total || progressEvent.bytes || 0
        const percent = total ? Math.round((progressEvent.loaded * 100) / total) : 0
        onProgress(percent, progressEvent.loaded, total)
      }
    },
  })

export const updateCollection = (id, formData, onProgress) =>
  api.put(`/api/collections/${id}`, formData, {
    timeout: 0, // No timeout for large file uploads
    onUploadProgress: (progressEvent) => {
      if (onProgress) {
        const total = progressEvent.total || progressEvent.bytes || 0
        const percent = total ? Math.round((progressEvent.loaded * 100) / total) : 0
        onProgress(percent, progressEvent.loaded, total)
      }
    },
  })

export const deleteCollection = (id) => api.delete(`/api/collections/${id}`)

