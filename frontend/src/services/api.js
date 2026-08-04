/**
 * TamilMeDictionary — Frontend-Only API Service
 * 
 * Intercepts all API calls and resolves them using client-side data structures in dataStore.js.
 * Powered by Google Sheet and Google Apps Script Web App for live dictionary data.
 */

import {
  CMS_PAGES,
  STATS_DATA,
  SERVICES_DATA,
  BLOG_POSTS_DATA,
  TEAM_MEMBERS_DATA,
  CLIENTS_DATA,
  GOOGLE_APPS_SCRIPT_URL,
  GOOGLE_SHEET_URL,
  searchMedicalTerms,
  listMedicalTerms,
  getUniqueCategories,
  syncWithGoogleSheet,
  getLastSyncTime,
  saveContactSubmission,
} from './dataStore'

export { GOOGLE_APPS_SCRIPT_URL, GOOGLE_SHEET_URL, syncWithGoogleSheet, getLastSyncTime }

// Helper to simulate standard Axios response structure: { data: ... }
const resolveResponse = (data, delay = 0) => {
  return new Promise((resolve) => {
    if (delay > 0) {
      setTimeout(() => resolve({ data }), delay)
    } else {
      resolve({ data })
    }
  })
}

// ─── Dictionary Endpoints (Powered by Google Sheet & Apps Script) ───────────
export const searchTerms = async (q = '', page = 1, limit = 20, category = '') => {
  const result = await searchMedicalTerms(q, page, limit, category)
  return {
    data: {
      results: result.results,
      terms: result.results,
      total: result.total,
      page: result.page,
      pages: result.pages,
      limit: result.limit,
    },
  }
}

export const listTerms = async (params = {}) => {
  const { page = 1, limit = 20, category = '', q = '' } = params
  const result = await searchMedicalTerms(q, page, limit, category)
  return {
    data: {
      results: result.results,
      terms: result.results,
      total: result.total,
      page: result.page,
      pages: result.pages,
      limit: result.limit,
    },
  }
}

export const getCategories = async () => {
  const result = await getUniqueCategories()
  return { data: result }
}

// ─── CMS Pages Endpoints ────────────────────────────────────────────────────
export const getPage = async (slug) => {
  const pageData = CMS_PAGES[slug] || {}
  return resolveResponse({
    slug,
    content: pageData,
    ...pageData,
  })
}

// ─── Blog Endpoints ─────────────────────────────────────────────────────────
export const listBlogPosts = async (params = {}) => {
  const { page = 1, limit = 9, tag = '' } = params
  let posts = [...BLOG_POSTS_DATA]
  if (tag) {
    posts = posts.filter((p) => p.tags && p.tags.includes(tag))
  }
  const total = posts.length
  const pages = Math.max(1, Math.ceil(total / limit))
  const startIndex = (page - 1) * limit
  const results = posts.slice(startIndex, startIndex + limit)

  return resolveResponse({
    posts: results,
    total,
    page,
    pages,
    limit,
    data: results,
  })
}

export const getBlogPost = async (slug) => {
  const post = BLOG_POSTS_DATA.find((p) => p.slug === slug || p.id === slug)
  if (!post) {
    const err = new Error('Article not found')
    err.response = { status: 404, data: { detail: 'Article not found' } }
    throw err
  }
  return resolveResponse({
    ...post,
    post,
  })
}

// ─── Services Endpoints ─────────────────────────────────────────────────────
export const listServices = async () => {
  return resolveResponse({
    services: SERVICES_DATA,
    data: SERVICES_DATA,
  })
}

// ─── Stats Endpoints ────────────────────────────────────────────────────────
export const listStats = async () => {
  return resolveResponse({
    stats: STATS_DATA,
    data: STATS_DATA,
  })
}

// ─── Contact Endpoints ──────────────────────────────────────────────────────
export const submitContact = async (formData) => {
  const result = saveContactSubmission(formData)
  return resolveResponse({
    status: 'success',
    message: 'Thank you! Your message has been received.',
    id: result.id,
  }, 200)
}

// ─── Team Members Endpoints ─────────────────────────────────────────────────
export const getTeamMembers = async () => {
  return resolveResponse({
    members: TEAM_MEMBERS_DATA,
    team: TEAM_MEMBERS_DATA,
    data: TEAM_MEMBERS_DATA,
  })
}

// ─── Clients / Partners Endpoints ───────────────────────────────────────────
export const getClients = async () => {
  return resolveResponse({
    clients: CLIENTS_DATA,
    partners: CLIENTS_DATA,
    data: CLIENTS_DATA,
  })
}

// Default export dummy axios client for any remaining direct references
const api = {
  get: (url) => resolveResponse({}),
  post: (url, data) => resolveResponse({ status: 'success' }),
}

export default api
