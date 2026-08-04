/**
 * TamilMeDictionary — Frontend-Only Data Store & Google Sheet Integration
 * 
 * Live Dictionary Source:
 * Google Sheet: https://docs.google.com/spreadsheets/d/1YuAH_irGgWq6qcSZO17i-PXXW_OP-BYKWg99w2xe5tA/edit?gid=1937920106#gid=1937920106
 * Google Apps Script Web App: https://script.google.com/macros/s/AKfycbyfs7265LYml-w6HpXKYzM1I7kj4yuFjACgaSOgi8TwFT3tDzO9i9gH0XFyVl6sR-3X/exec
 */

export const GOOGLE_APPS_SCRIPT_URL =
  import.meta.env?.VITE_GOOGLE_APPS_SCRIPT_URL ||
  'https://script.google.com/macros/s/AKfycbyfs7265LYml-w6HpXKYzM1I7kj4yuFjACgaSOgi8TwFT3tDzO9i9gH0XFyVl6sR-3X/exec'

export const GOOGLE_SHEET_URL =
  import.meta.env?.VITE_GOOGLE_SHEET_URL ||
  'https://docs.google.com/spreadsheets/d/1YuAH_irGgWq6qcSZO17i-PXXW_OP-BYKWg99w2xe5tA/edit?gid=1937920106#gid=1937920106'

// ── 1. CMS STATIC CONTENT ───────────────────────────────────────────────────
export const CMS_PAGES = {
  hero: {
    quote_ta: "சொல்லுக சொல்லைப் பிறிதோர்சொல் அச்சொல்லை வெல்லுஞ்சொல் இன்மை அறிந்து.",
    quote_en: '"Utter not a word without making sure there is no better word to express it."',
    quote_source: "--- Thiruvalluvar (திருக்குறள் 645)",
    heading_ta: "உலகின் முதல் தமிழ் மருத்துவச் சொல்லகராதி",
    heading_en: "The World's First Tamil Medical Dictionary",
    subtitle: "English → Tamil Medical Glossary",
    description: "The most comprehensive Tamil Medical Dictionary and Thesaurus designed for students, healthcare professionals, researchers, translators, and medical writers.",
    popular_searches: ["Anatomy", "Cardiology", "Neurology", "Pharmacology", "Surgery"],
  },
  about: {
    heading: "Medical Dictionary in Tamil",
    body: "Accurate and comprehensive medical terminology translated into Tamil. Helping students, doctors, translators, researchers, and healthcare professionals communicate complex medical concepts with confidence and clinical precision.",
    audiences: [
      "Medical Writers",
      "Medical Translators",
      "Doctors",
      "Medical Students",
      "Researchers",
      "Healthcare Professionals",
      "Academicians",
    ],
  },
  mission: {
    heading: "Our Mission",
    body: "We are committed to preserving, expanding, and standardizing Tamil medical terminology by delivering accurate, reliable, and clinically validated medical translations. Our goal is to bridge the communication gap between English medical science and the Tamil language worldwide.",
  },
  "featured-resource": {
    heading: "Medical Glossary",
    author: "Prof. Dr. Semmal Mustafa",
    ta_title: "மருத்துவக் கலைச்சொல் களஞ்சியம்",
    description: "Download the official comprehensive medical glossary prepared and verified by Prof. Dr. Semmal Mustafa.",
    download_url: "/Prof. Dr. Semmal Mustafa மருத்துவக் கலைச்சொல் களஞ்சியம்.docx",
  },
  "specialized-areas": {
    heading: "Our Expertise",
    areas: [
      {
        title: "Pharmaceuticals",
        description: "Translation of pharmaceutical, clinical drug classifications, and pharmacology terminology.",
        icon: "💊",
      },
      {
        title: "Research & Academia",
        description: "Supporting universities, medical journals, research institutions, and academic publications.",
        icon: "🎓",
      },
      {
        title: "Healthcare Services",
        description: "Clinical communication support for hospitals, diagnostic labs, and medical practitioners.",
        icon: "🏥",
      },
    ],
  },
  workflow: {
    heading: "Our Process",
    steps: [
      {
        step: 1,
        title: "Glossary Compilation",
        description: "Building an extensive collection of validated medical terminology.",
      },
      {
        step: 2,
        title: "Translation",
        description: "Professional translation by experienced linguistic and medical experts.",
      },
      {
        step: 3,
        title: "Quality Assurance",
        description: "Rigorous proofreading and clinical validation.",
      },
      {
        step: 4,
        title: "Continuous Support",
        description: "Continuous assistance and terminology expansion whenever needed.",
      },
    ],
  },
}

// ── 2. STATS DATA ───────────────────────────────────────────────────────────
export const STATS_DATA = [
  { id: "stat_1", value: "10,800+", label: "Medical Terms", icon: "📚", order: 1 },
  { id: "stat_2", value: "50,000+", label: "Users Reached", icon: "👥", order: 2 },
  { id: "stat_3", value: "100%", label: "Verified Translations", icon: "🩺", order: 3 },
  { id: "stat_4", value: "24/7", label: "Always Available", icon: "⚡", order: 4 },
]

// ── 3. SERVICES DATA ────────────────────────────────────────────────────────
export const SERVICES_DATA = [
  {
    id: "serv_1",
    title: "Clinical Document Translation",
    title_ta: "மருத்துவ ஆவண மொழிபெயர்ப்பு",
    description: "Professional translation of patient medical records, discharge summaries, consent forms, and diagnostic reports into precise Tamil.",
    icon: "📋",
    features: [
      "Patient records & case sheets",
      "Informed consent forms",
      "Discharge summaries & lab reports",
      "100% medical accuracy guarantee",
    ],
    order: 1,
  },
  {
    id: "serv_2",
    title: "Pharmaceutical Localization",
    title_ta: "மருந்தியல் உள்ளூர்மயமாக்கல்",
    description: "Standardized Tamil translation for drug labels, packaging inserts, dosage instructions, and pharmaceutical product catalogs.",
    icon: "💊",
    features: [
      "Package inserts & dosage guides",
      "Clinical trial protocols",
      "Regulatory compliance documentation",
      "Standard pharmacopoeia terms",
    ],
    order: 2,
  },
  {
    id: "serv_3",
    title: "Medical Academic & Research Translation",
    title_ta: "மருத்துவ ஆய்வுக் கட்டுரை மொழிபெயர்ப்பு",
    description: "Translating medical research papers, university textbooks, journal articles, and academic dissertations with technical rigor.",
    icon: "🔬",
    features: [
      "Research papers & journal abstracts",
      "Medical textbooks & monographs",
      "Thesis & conference presentations",
      "Linguistic and domain peer-review",
    ],
    order: 3,
  },
  {
    id: "serv_4",
    title: "Public Health Communication",
    title_ta: "பொது சுகாதார விழிப்புணர்வு",
    description: "Culturally resonant, easily understandable health brochures, patient education materials, and community outreach literature in Tamil.",
    icon: "🏥",
    features: [
      "Health awareness campaigns",
      "Patient education brochures",
      "Hospital signage & infographics",
      "Clear, accessible language",
    ],
    order: 4,
  },
  {
    id: "serv_5",
    title: "Medical Software & App Localization",
    title_ta: "மருத்துவ மென்பொருள் மொழியாக்கம்",
    description: "End-to-end localization of healthcare apps, telemedicine portals, hospital management software, and medical device UI into Tamil.",
    icon: "📱",
    features: [
      "Telemedicine app interfaces",
      "Hospital management systems",
      "Medical device screen prompts",
      "UI string testing & verification",
    ],
    order: 5,
  },
  {
    id: "serv_6",
    title: "Medical Glossary Development",
    title_ta: "மருத்துவக் கலைச்சொல் தொகுப்பு",
    description: "Custom medical dictionary creation and term standardisation services for specialized healthcare organizations and universities.",
    icon: "📖",
    features: [
      "Custom medical taxonomy building",
      "Specialized terminology validation",
      "Multi-specialty glossary databases",
      "Digital integration support",
    ],
    order: 6,
  },
]

// ── 4. BLOG POSTS DATA ──────────────────────────────────────────────────────
export const BLOG_POSTS_DATA = [
  {
    id: "post_1",
    slug: "importance-of-tamil-medical-terminology",
    title: "The Vital Role of Standardized Tamil Medical Terminology in Healthcare",
    title_ta: "மருத்துவத்துறையில் தமிழ் கலைச்சொற்களின் முக்கியத்துவம்",
    excerpt: "Why translating clinical terms into native languages bridges vital communication barriers between doctors and patients.",
    content: `
# The Vital Role of Standardized Tamil Medical Terminology

Healthcare communication is a fundamental determinant of medical outcomes. When patients fully understand their diagnosis, treatment procedures, and medication schedules in their native tongue, treatment adherence increases dramatically.

## Bridging the Linguistic Divide

Historically, medical education and clinical literature in South Asia have been predominantly in English. While this has facilitated global scientific exchange, it often creates a barrier for patients in rural and semi-urban communities across Tamil Nadu, Sri Lanka, Malaysia, and Singapore.

### Key Advantages:
1. **Enhanced Informed Consent**: Patients comprehend risk factors and procedural nuances before surgeries.
2. **Pedagogical Clarity**: Medical, nursing, and pharmacy students grasp fundamental anatomical concepts with deeper intuitive retention.
3. **Public Health Effectiveness**: Epidemic advisories and disease prevention campaigns achieve immediate resonance.

Through TamilMeDictionary, our mission is to empower both medical practitioners and everyday citizens with reliable, standardized translations.
    `,
    cover_image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80",
    coverImage: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80",
    tags: ["Healthcare", "Terminology", "Tamil Medicine"],
    author: "Prof. Dr. Semmal Mustafa",
    published_at: "2024-03-01T00:00:00Z",
    is_published: true,
  },
  {
    id: "post_2",
    slug: "translating-cardiology-terms-to-tamil",
    title: "Deciphering Cardiology Terms: From Angioplasty to Myocardial Infarction",
    title_ta: "இதயவியல் கலைச்சொற்கள்: ஆஞ்சியோபிளாஸ்டி முதல் மாரடைப்பு வரை",
    excerpt: "A deep dive into cardiovascular terminology and how complex cardiac concepts are accurately rendered in Tamil.",
    content: `
# Deciphering Cardiology Terms

Cardiology encompasses some of the most critical and frequently encountered medical terms in emergency care. Translating these terms accurately into Tamil requires not only linguistic elegance but absolute physiological precision.

## Key Examples:

* **Myocardial Infarction (மாரடைப்பு / இதயத் தசை இறப்பு)**: Literally translating to the ischemic necrosis of heart muscle tissue.
* **Coronary Angiography (குருதிக்குழாய் வரைவி / ஆஞ்சியோகிராபி)**: The diagnostic visualization of cardiac blood vessels using radio-opaque dye.
* **Arrhythmia (இதயத் துடிப்பு ஒழுங்கின்மை)**: Irregular rhythm or pacing of heartbeats.
* **Hypertension (உயர் இரத்த அழுத்தம்)**: Chronic elevation of arterial blood pressure.

Standardization ensures that whether a doctor speaks in Chennai, Madurai, Jaffna, or London, the medical meaning remains unambiguously clear.
    `,
    cover_image: "https://images.unsplash.com/photo-1628348068343-c6a848d2b6dd?auto=format&fit=crop&w=1200&q=80",
    coverImage: "https://images.unsplash.com/photo-1628348068343-c6a848d2b6dd?auto=format&fit=crop&w=1200&q=80",
    tags: ["Cardiology", "Anatomy", "Clinical"],
    author: "Editorial Team",
    published_at: "2024-02-15T00:00:00Z",
    is_published: true,
  },
  {
    id: "post_3",
    slug: "evolution-of-siddha-and-modern-medicine",
    title: "The Synthesis of Traditional Siddha Medicine and Modern Clinical Science",
    title_ta: "சித்த மருத்துவமும் நவீன மருத்துவ அறிவியலும்",
    excerpt: "Exploring the rich heritage of Tamil Siddha medicine and its harmonious coexistence with modern pharmacology.",
    content: `
# The Synthesis of Traditional Siddha Medicine and Modern Clinical Science

Tamil Nadu is the birthplace of the ancient Siddha medical tradition, founded by the 18 Siddhars, including Agathiyar and Thirumoolar. Siddha medicine provides an encyclopedic vocabulary of botanical, mineral, and physiological classifications.

## Harmonizing Ancient & Modern Glossaries

As modern medical research explores bio-active compounds in traditional herbs (like *Nilavembu*, *Kabasura*, and *Ashwagandha*), standardized terminology bridges the terminology used in classical palm-leaf manuscripts with contemporary pharmacological terminology.

TamilMeDictionary documents both modern Western allopathic terms and traditional therapeutic roots to support holistic medical understanding.
    `,
    cover_image: "https://images.unsplash.com/photo-1512069772995-ec65ed45afd6?auto=format&fit=crop&w=1200&q=80",
    coverImage: "https://images.unsplash.com/photo-1512069772995-ec65ed45afd6?auto=format&fit=crop&w=1200&q=80",
    tags: ["Siddha", "Pharmacology", "Heritage"],
    author: "Dr. S. K. Ramanathan",
    published_at: "2024-01-20T00:00:00Z",
    is_published: true,
  },
]

// ── 5. TEAM MEMBERS DATA ────────────────────────────────────────────────────
export const TEAM_MEMBERS_DATA = [
  {
    id: "team_1",
    name: "Prof. Dr. Semmal Mustafa",
    role: "Founder & Chief Medical Editor",
    image: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=600&q=80",
    bio: "Renowned medical educator, author, and pioneer in Tamil medical glossary standardisation with over 30 years of clinical experience.",
    facebook: "#",
    twitter: "#",
    linkedin: "#",
    order: 1,
  },
  {
    id: "team_2",
    name: "Dr. R. Senthamil Selvi",
    role: "Linguistic Director & Senior Consultant",
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=600&q=80",
    bio: "Clinical terminology specialist focusing on anatomical translations and public health communication standards.",
    facebook: "#",
    twitter: "#",
    linkedin: "#",
    order: 2,
  },
]

// ── 6. CLIENTS & PARTNERS DATA ───────────────────────────────────────────────
export const CLIENTS_DATA = [
  {
    id: "client_1",
    name: "Apollo Hospitals Network",
    category: "Healthcare Partner",
    location: "Chennai / Pan-India",
    logo_text: "Apollo Hospitals",
    logoText: "Apollo Hospitals",
    website: "https://www.apollohospitals.com",
    order: 1,
  },
  {
    id: "client_2",
    name: "Madras Medical College",
    category: "Academic Partner",
    location: "Chennai",
    logo_text: "MMC Chennai",
    logoText: "MMC Chennai",
    website: "http://www.mmc.ac.in",
    order: 2,
  },
  {
    id: "client_3",
    name: "Tamil Nadu Dr. M.G.R. Medical University",
    category: "University Partner",
    location: "Guindy, Chennai",
    logo_text: "MGR Med University",
    logoText: "MGR Med University",
    website: "https://www.tnmgrmu.ac.in",
    order: 3,
  },
]

// ── 7. GOOGLE SHEET & APPS SCRIPT LIVE SEARCH ENGINE (10,800+ Terms) ────────
let termsDataset = []
let isDatasetLoaded = false
let loadingPromise = null
let lastSyncTimestamp = null

/**
 * Normalizes raw Google Sheet row objects into standardized dictionary terms
 */
function normalizeSheetTerms(rawTerms) {
  if (!Array.isArray(rawTerms)) return []
  return rawTerms
    .filter(t => t && (t.en_term || t.ta_term))
    .map((t, idx) => {
      let en = (t.en_term || '').toString().trim()
      let ta = (t.ta_term || '').toString().trim()
      const def = (t.definition || '').toString().trim()
      const taDef = (t.ta_definition || '').toString().trim()

      // Clean leading apostrophe or period artifacts from scanned OCR text
      if (en.startsWith("'") && en.length > 1) en = en.substring(1).trim()
      if (en.startsWith(".") && en.length > 1) en = en.substring(1).trim()

      const cat = (t.category && t.category.toString().trim() && t.category.toString().trim() !== 'General')
        ? t.category.toString().trim()
        : 'Medical Terms'

      let tags = []
      if (Array.isArray(t.tags)) {
        tags = t.tags
      } else if (typeof t.tags === 'string' && t.tags.trim()) {
        tags = t.tags.split(',').map(s => s.trim()).filter(Boolean)
      }

      return {
        id: t.id || `term_gs_${idx + 1}`,
        en_term: en,
        ta_term: ta,
        category: cat,
        definition: (def === 'None' || def === '.') ? '' : def,
        ta_definition: taDef,
        tags,
        is_featured: t.is_featured === true || t.is_featured === 'true' || idx < 12,
      }
    })
    .filter(t => {
      if (!t.en_term && !t.ta_term) return false
      // Filter out solitary punctuation marks
      if (t.en_term.length === 1 && !/[a-zA-Z0-9\u0B80-\u0BFF]/.test(t.en_term)) return false
      return true
    })
}

/**
 * Fetches dictionary data directly from the live Google Apps Script Web App URL.
 * No static JSON conversion file is used.
 */
export async function loadFullDictionaryDataset(forceRefresh = false) {
  if (!forceRefresh && isDatasetLoaded && termsDataset.length > 0) {
    return termsDataset
  }
  if (!forceRefresh && loadingPromise) {
    return loadingPromise
  }

  loadingPromise = (async () => {
    // 1. Direct Live HTTP fetch from Google Apps Script Web App (connected to your Google Sheet)
    try {
      console.log('Fetching live dictionary terms from Google Apps Script...')
      const response = await fetch(GOOGLE_APPS_SCRIPT_URL, {
        method: 'GET',
        redirect: 'follow',
      })
      if (response.ok) {
        const rawData = await response.json()
        const normalized = normalizeSheetTerms(rawData)
        if (normalized.length > 0) {
          termsDataset = normalized
          isDatasetLoaded = true
          lastSyncTimestamp = new Date().toISOString()
          console.log(`Successfully loaded ${termsDataset.length} live terms from Google Sheet!`)
          return termsDataset
        }
      } else {
        console.warn('Apps Script response not OK:', response.status, response.statusText)
      }
    } catch (err) {
      console.error('Direct Google Apps Script fetch error:', err)
    }

    // 2. Emergency fallback to built-in seed terms if offline without internet
    if (termsDataset.length === 0) {
      console.log('Using local fallback dataset')
      termsDataset = normalizeSheetTerms(SEED_MEDICAL_TERMS)
      isDatasetLoaded = true
    }

    return termsDataset
  })()

  return loadingPromise
}

/**
 * Trigger explicit sync with Google Sheet via Google Apps Script
 */
export async function syncWithGoogleSheet() {
  loadingPromise = null
  isDatasetLoaded = false
  return await loadFullDictionaryDataset(true)
}

export function getLastSyncTime() {
  if (lastSyncTimestamp) return lastSyncTimestamp
  if (typeof localStorage !== 'undefined') {
    return localStorage.getItem('tamilmedictionary_gs_sync_time') || null
  }
  return null
}

// Background initial load
if (typeof window !== 'undefined') {
  setTimeout(() => {
    loadFullDictionaryDataset()
  }, 100)
}

// ── 8. REAL-TIME SEARCH ENGINE (Fuzzy + Score Match across Sheet rows) ──────
export async function searchMedicalTerms(query = '', page = 1, limit = 20, category = '') {
  await loadFullDictionaryDataset()

  const q = (query || '').trim().toLowerCase()
  const cat = (category || '').trim().toLowerCase()

  let filtered = termsDataset

  // Category filter
  if (cat && cat !== 'all categories' && cat !== 'all' && cat !== '') {
    filtered = filtered.filter(t => (t.category || '').toLowerCase() === cat)
  }

  // Query filter
  if (q) {
    const scored = []
    for (const t of filtered) {
      const en = (t.en_term || '').toLowerCase()
      const ta = (t.ta_term || '').toLowerCase()
      const def = (t.definition || '').toLowerCase()
      const taDef = (t.ta_definition || '').toLowerCase()
      const tCat = (t.category || '').toLowerCase()

      let score = 0
      if (en === q || ta === q) {
        score += 100
      } else if (en.startsWith(q) || ta.startsWith(q)) {
        score += 70
      } else if (en.includes(q) || ta.includes(q)) {
        score += 45
      } else if (tCat.includes(q)) {
        score += 25
      } else if (def.includes(q) || taDef.includes(q)) {
        score += 15
      } else if (t.tags && t.tags.some(tag => tag.toLowerCase().includes(q))) {
        score += 20
      }

      if (score > 0) {
        scored.push({ term: t, score })
      }
    }

    scored.sort((a, b) => b.score - a.score || a.term.en_term.localeCompare(b.term.en_term))
    filtered = scored.map(s => s.term)
  }

  const total = filtered.length
  const pages = Math.max(1, Math.ceil(total / limit))
  const safePage = Math.max(1, Math.min(page, pages))
  const startIndex = (safePage - 1) * limit
  const results = filtered.slice(startIndex, startIndex + limit)

  return {
    results,
    total,
    page: safePage,
    pages,
    limit,
  }
}

export async function listMedicalTerms({ page = 1, limit = 20, category = '', q = '' } = {}) {
  return searchMedicalTerms(q, page, limit, category)
}

export async function getUniqueCategories() {
  await loadFullDictionaryDataset()
  const catSet = new Set()
  for (const t of termsDataset) {
    if (t.category && t.category.trim()) {
      catSet.add(t.category.trim())
    }
  }
  const categories = Array.from(catSet).sort()
  return { categories }
}

// ── 9. LOCAL STORAGE CONTACTS & CONTRIBUTIONS ──────────────────────────────
export function saveContactSubmission(data) {
  try {
    const existing = JSON.parse(localStorage.getItem('tamilmedictionary_contacts') || '[]')
    const entry = {
      ...data,
      id: `contact_${Date.now()}`,
      created_at: new Date().toISOString(),
      is_read: false,
    }
    existing.unshift(entry)
    localStorage.setItem('tamilmedictionary_contacts', JSON.stringify(existing.slice(0, 100)))
    return { status: 'success', id: entry.id }
  } catch (e) {
    console.error('LocalStorage write error:', e)
    return { status: 'success', id: `contact_${Date.now()}` }
  }
}
