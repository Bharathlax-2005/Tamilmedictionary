import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
})

// ─── Dictionary ──────────────────────────────────────────────────────────────
export const searchTerms = (q, page = 1, limit = 20) =>
  api.get('/dictionary/search', { params: { q, page, limit } })

export const listTerms = (params = {}) =>
  api.get('/dictionary/terms', { params })

export const getCategories = () =>
  api.get('/dictionary/categories')

// ─── Pages (CMS) ─────────────────────────────────────────────────────────────
export const getPage = (slug) =>
  api.get(`/pages/${slug}`)

// ─── Blog ─────────────────────────────────────────────────────────────────────
export const listBlogPosts = (params = {}) =>
  api.get('/blog/posts', { params })

export const getBlogPost = (slug) =>
  api.get(`/blog/posts/${slug}`)

// ─── Services ─────────────────────────────────────────────────────────────────
export const listServices = () =>
  api.get('/services/')

// ─── Stats ────────────────────────────────────────────────────────────────────
export const listStats = () =>
  api.get('/stats/')

// ─── Contact ──────────────────────────────────────────────────────────────────
export const submitContact = (data) =>
  api.post('/contact/', data)

// ─── Shop ─────────────────────────────────────────────────────────────────────
export const listProducts = (category) =>
  api.get('/shop/products', { params: category ? { category } : {} })

// ─── Team Members ────────────────────────────────────────────────────────────
export const getTeamMembers = () =>
  api.get('/team')

// ─── Collections ────────────────────────────────────────────────────────────
export const getCollections = () =>
  api.get('/collections/')

export default api

