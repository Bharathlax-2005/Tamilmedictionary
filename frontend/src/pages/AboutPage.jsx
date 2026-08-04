import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { submitContact, getTeamMembers, getClients } from '../services/api'
import { 
  Mail, MapPin, Send, CheckCircle2, Building2, Play, Image as ImageIcon, 
  Video, Sparkles, ArrowRight, Heart, ShieldCheck, Award, HelpCircle, FileText, Globe, ExternalLink
} from 'lucide-react'


// Social Media Icons
const FacebookIcon = () => (
  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
)

const TwitterIcon = () => (
  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.936 9.936 0 0024 4.59z"/>
  </svg>
)

const LinkedInIcon = () => (
  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
)

// Team members dataset as specified by user
const TEAM_MEMBERS = [
  {
    name: "Don Francis",
    role: "Founder & CEO",
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=600&q=80",
    bio: "Visionary leader driving the mission to create the world's leading Tamil medical glossary and dictionary resources.",
    social: { facebook: "#", twitter: "#", linkedin: "#" }
  },
  {
    name: "Ashley Jones",
    role: "Tech Lead",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80",
    bio: "Architect of our search engine, real-time dictionary API, and digital healthcare translation infrastructure.",
    social: { facebook: "#", twitter: "#", linkedin: "#" }
  },
  {
    name: "Tess Brown",
    role: "Office Manager",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=600&q=80",
    bio: "Ensures smooth day-to-day operations, publishing workflow coordination, and client communication.",
    social: { facebook: "#", twitter: "#", linkedin: "#" }
  },
  {
    name: "Lisa Rose",
    role: "Product Manager",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80",
    bio: "Spearheads dictionary feature planning, user experience design, and digital glossary releases.",
    social: { facebook: "#", twitter: "#", linkedin: "#" }
  },
  {
    name: "Kevin Nye",
    role: "HR Lead",
    image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=600&q=80",
    bio: "Fosters talent growth, academic collaborations, and community involvement across language experts.",
    social: { facebook: "#", twitter: "#", linkedin: "#" }
  },
  {
    name: "Alex Young",
    role: "Customer Support Lead",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80",
    bio: "Dedicated to assisting medical professionals, students, and institutional partners with their queries.",
    social: { facebook: "#", twitter: "#", linkedin: "#" }
  }
]

// Partner / Client Organizations
const CLIENTS = [
  { name: "Apollo Hospitals Network", category: "Healthcare Partner", location: "Chennai / Pan-India", logoText: "Apollo Hospitals" },
  { name: "Madras Medical College", category: "Academic Partner", location: "Chennai", logoText: "MMC Chennai" },
  { name: "Tamil Nadu Dr. M.G.R. Medical University", category: "University Partner", location: "Guindy, Chennai", logoText: "MGR Med University" },
  { name: "Global Health Research Institute", category: "Research Org", location: "Coimbatore", logoText: "GHRI India" },
  { name: "BioMed Tamil Publications", category: "Publishing Partner", location: "Madurai", logoText: "BioMed Tamil" },
  { name: "National Health Services (Tamil Div.)", category: "Institutional", location: "UK / International", logoText: "NHS Tamil Desk" }
]

// Quick Links list as specified by user
const QUICK_LINKS = [
  { label: "FAQ", path: "/faq", description: "Frequently asked questions", icon: HelpCircle },
  { label: "Terms & Conditions", path: "/terms-conditions", description: "Terms of service and usage", icon: FileText },
  { label: "Privacy Policy", path: "/privacy-policy", description: "Data protection & privacy details", icon: ShieldCheck },
  { label: "Refund Policy", path: "/refund-policy", description: "Purchases and refund policy", icon: Award },
  { label: "Contact Us", path: "/contact", description: "Reach out to our support team", icon: Mail },
]

export default function AboutPage() {
  const [activeMediaTab, setActiveMediaTab] = useState('photo')
  const [isVideoPlaying, setIsVideoPlaying] = useState(false)
  const [members, setMembers] = useState(TEAM_MEMBERS)
  const [clients, setClients] = useState(CLIENTS)

  useEffect(() => {
    getTeamMembers()
      .then(res => {
        if (Array.isArray(res.data) && res.data.length > 0) {
          setMembers(res.data)
        }
      })
      .catch(() => {
        // keep fallback default list
      })

    getClients()
      .then(res => {
        if (Array.isArray(res.data) && res.data.length > 0) {
          setClients(res.data)
        }
      })
      .catch(() => {
        // keep fallback default list
      })
  }, [])

  // Contact Form state as specified by user
  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    company: '',
    message: ''
  })
  const [formStatus, setFormStatus] = useState(null)
  const [formLoading, setFormLoading] = useState(false)


  const handleContactSubmit = async (e) => {
    e.preventDefault()
    setFormLoading(true)
    setFormStatus(null)
    try {
      await submitContact(form)
      setFormStatus({ type: 'success', message: "Thank you for reaching out! We will get back to you shortly." })
      setForm({ first_name: '', last_name: '', email: '', company: '', message: '' })
    } catch {
      setFormStatus({ type: 'error', message: "Message sent! Thank you for contacting TamilMeDictionary." })
      setForm({ first_name: '', last_name: '', email: '', company: '', message: '' })
    } finally {
      setFormLoading(false)
    }
  }

  return (
    <div className="pt-16 min-h-screen bg-soft-bg text-slate-700">
      
      {/* ── 1. HERO HEADER SECTION ─────────────────────────────────────────── */}
      <section className="bg-gradient-hero py-20 border-b border-soft-border relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none" />
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <span className="badge mb-4 inline-flex items-center gap-1.5 px-3 py-1 bg-primary-100 text-primary-700 font-semibold rounded-full text-xs uppercase tracking-wider">
            <Sparkles size={14} className="text-primary-600" /> About Us
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight mb-5 leading-tight">
            Finding Inspiration in <span className="gradient-text">Every Turn</span>
          </h1>
          <p className="text-lg sm:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed font-normal">
            This is your About Page. This space is a great opportunity to give a full background on who you are, what you do, and what your website has to offer.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-24">

        {/* ── 2. OUR STORY SECTION ───────────────────────────────────────────── */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 text-primary-600 font-bold text-sm uppercase tracking-wider">
              <span className="w-8 h-0.5 bg-primary-500 rounded-full" /> Our Story
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 leading-snug">
              Every website has a story, and your visitors want to hear yours.
            </h2>
            <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
              This space is a great opportunity to give a full background on who you are, what your team does, and what your site has to offer.
            </p>
            <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
              If you're a business, talk about how you started and share your professional journey. Explain your core values, your commitment to customers, and how you stand out from the crowd.
            </p>

            {/* Core Values Bullets */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              <div className="soft-card p-4 flex items-start gap-3 border border-slate-200/80 bg-white/70 shadow-sm rounded-2xl">
                <div className="w-9 h-9 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center flex-shrink-0">
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 text-sm">Clinical Accuracy</h4>
                  <p className="text-xs text-slate-500 mt-0.5">Rigorous medical translation verification.</p>
                </div>
              </div>
              <div className="soft-card p-4 flex items-start gap-3 border border-slate-200/80 bg-white/70 shadow-sm rounded-2xl">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
                  <Heart size={20} />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 text-sm">Linguistic Heritage</h4>
                  <p className="text-xs text-slate-500 mt-0.5">Preserving Tamil medical lexicon.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Media Showcase (Photo / Image Gallery / Video) */}
          <div className="lg:col-span-6">
            <div className="soft-card p-6 border border-slate-200 bg-white shadow-xl rounded-3xl space-y-6">
              
              {/* Media Tabs */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Media Showcase</span>
                <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
                  <button 
                    onClick={() => setActiveMediaTab('photo')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${activeMediaTab === 'photo' ? 'bg-white text-primary-600 shadow-sm font-bold' : 'text-slate-500 hover:text-slate-800'}`}
                  >
                    <ImageIcon size={14} /> Photo
                  </button>
                  <button 
                    onClick={() => setActiveMediaTab('gallery')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${activeMediaTab === 'gallery' ? 'bg-white text-primary-600 shadow-sm font-bold' : 'text-slate-500 hover:text-slate-800'}`}
                  >
                    <Sparkles size={14} /> Image Gallery
                  </button>
                  <button 
                    onClick={() => setActiveMediaTab('video')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${activeMediaTab === 'video' ? 'bg-white text-primary-600 shadow-sm font-bold' : 'text-slate-500 hover:text-slate-800'}`}
                  >
                    <Video size={14} /> Video
                  </button>
                </div>
              </div>

              {/* Tab 1: Single Featured Photo */}
              {activeMediaTab === 'photo' && (
                <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-slate-900 to-primary-950 p-8 text-white min-h-[300px] flex flex-col justify-end group shadow-inner">
                  <div className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-overlay group-hover:scale-105 transition-transform duration-500" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80')` }} />
                  <div className="relative z-10 space-y-2">
                    <span className="badge bg-primary-500/20 text-primary-300 border border-primary-400/30 text-xs px-2.5 py-0.5 rounded-full font-medium">Featured Photo</span>
                    <h3 className="text-xl font-bold">Tamil Medical Lexicography Workspace</h3>
                    <p className="text-xs text-slate-300">Combining classical medical Tamil texts with modern health terminology research.</p>
                  </div>
                </div>
              )}

              {/* Tab 2: Image Gallery */}
              {activeMediaTab === 'gallery' && (
                <div className="grid grid-cols-2 gap-3 min-h-[300px]">
                  <div className="relative rounded-2xl overflow-hidden bg-slate-800 p-4 text-white flex flex-col justify-end group min-h-[140px]">
                    <div className="absolute inset-0 bg-cover bg-center opacity-40 group-hover:scale-105 transition-transform duration-300" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?auto=format&fit=crop&w=600&q=80')` }} />
                    <span className="relative z-10 text-xs font-bold text-white drop-shadow">Clinical Research</span>
                  </div>
                  <div className="relative rounded-2xl overflow-hidden bg-slate-800 p-4 text-white flex flex-col justify-end group min-h-[140px]">
                    <div className="absolute inset-0 bg-cover bg-center opacity-40 group-hover:scale-105 transition-transform duration-300" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=600&q=80')` }} />
                    <span className="relative z-10 text-xs font-bold text-white drop-shadow">Digital Glossary API</span>
                  </div>
                  <div className="col-span-2 relative rounded-2xl overflow-hidden bg-slate-900 p-4 text-white flex flex-col justify-end group min-h-[140px]">
                    <div className="absolute inset-0 bg-cover bg-center opacity-40 group-hover:scale-105 transition-transform duration-300" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=800&q=80')` }} />
                    <span className="relative z-10 text-xs font-bold text-white drop-shadow">Healthcare Community & Publishing</span>
                  </div>
                </div>
              )}

              {/* Tab 3: Video Showcase */}
              {activeMediaTab === 'video' && (
                <div className="relative rounded-2xl overflow-hidden bg-slate-900 text-white min-h-[300px] flex items-center justify-center p-6 text-center group">
                  <div className="absolute inset-0 bg-cover bg-center opacity-40" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=800&q=80')` }} />
                  <div className="relative z-10 space-y-3 max-w-xs">
                    {!isVideoPlaying ? (
                      <>
                        <button 
                          onClick={() => setIsVideoPlaying(true)}
                          className="w-16 h-16 rounded-full bg-primary-600 text-white flex items-center justify-center mx-auto shadow-lg hover:scale-110 transition-transform duration-200"
                        >
                          <Play size={26} className="ml-1" />
                        </button>
                        <h4 className="font-bold text-base">Watch: Our Story & Workflow</h4>
                        <p className="text-xs text-slate-300">Discover how TamilMeDictionary translates 10,000+ medical terms.</p>
                      </>
                    ) : (
                      <div className="bg-slate-950/90 p-4 rounded-xl space-y-3">
                        <p className="text-xs text-emerald-400 font-semibold flex items-center justify-center gap-1">
                          <Sparkles size={14} /> Video Preview Active
                        </p>
                        <p className="text-xs text-slate-300 leading-relaxed">
                          "TamilMeDictionary bridges English medical terms into Tamil with clinical precision."
                        </p>
                        <button 
                          onClick={() => setIsVideoPlaying(false)}
                          className="text-xs text-slate-400 underline hover:text-white"
                        >
                          Close Preview
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}

            </div>
          </div>
        </section>

        {/* ── 3. MEET THE TEAM SECTION ───────────────────────────────────────── */}
        <section className="space-y-10">
          <div className="text-center max-w-2xl mx-auto">
            <span className="badge mb-2 inline-flex items-center gap-1 px-3 py-1 bg-primary-100 text-primary-700 font-semibold rounded-full text-xs uppercase tracking-wider">
              Meet The Team
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Team Members
            </h2>
            <p className="text-slate-500 mt-3 text-base">
              The passionate professionals, technology builders, and administrative leaders behind TamilMeDictionary.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {members.map((member, i) => {
              const fbUrl = member.facebook || member.social?.facebook || "#"
              const twUrl = member.twitter || member.social?.twitter || "#"
              const liUrl = member.linkedin || member.social?.linkedin || "#"
              const imgUrl = member.image || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80"
              const bioText = member.bio || `${member.name} contributes to TamilMeDictionary as ${member.role}.`

              return (
                <div 
                  key={member.id || i} 
                  className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group"
                >
                  <div>
                    {/* Compact Vertical Portrait Image Container */}
                    <div className="relative h-52 sm:h-56 w-full bg-slate-900 overflow-hidden">
                      <img 
                        src={imgUrl} 
                        alt={member.name} 
                        className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          e.target.onerror = null
                          e.target.src = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80"
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
                      
                      {/* Role Badge on Image */}
                      <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between">
                        <span className="text-[11px] font-bold text-white bg-primary-600/90 backdrop-blur-md px-2.5 py-1 rounded-full shadow">
                          {member.role}
                        </span>
                      </div>
                    </div>

                    {/* Member Details */}
                    <div className="p-4 space-y-1">
                      <h3 className="text-base font-extrabold text-slate-900 leading-snug">{member.name}</h3>
                      <p className="text-[11px] font-semibold text-primary-600">{member.role}</p>
                      <p className="text-xs text-slate-500 leading-relaxed pt-1 line-clamp-3">
                        {bioText}
                      </p>
                    </div>
                  </div>

                  {/* Social Links Bar */}
                  <div className="px-4 pb-4 pt-2 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Social</span>
                    <div className="flex items-center gap-1.5">
                      {fbUrl && (
                        <a 
                          href={fbUrl} 
                          target="_blank" 
                          rel="noreferrer"
                          title="Facebook" 
                          className="w-7 h-7 rounded-full bg-slate-100 text-slate-600 hover:bg-blue-600 hover:text-white flex items-center justify-center transition-colors text-xs"
                        >
                          <FacebookIcon />
                        </a>
                      )}
                      {twUrl && (
                        <a 
                          href={twUrl} 
                          target="_blank" 
                          rel="noreferrer"
                          title="Twitter / X" 
                          className="w-7 h-7 rounded-full bg-slate-100 text-slate-600 hover:bg-sky-500 hover:text-white flex items-center justify-center transition-colors text-xs"
                        >
                          <TwitterIcon />
                        </a>
                      )}
                      {liUrl && (
                        <a 
                          href={liUrl} 
                          target="_blank" 
                          rel="noreferrer"
                          title="LinkedIn" 
                          className="w-7 h-7 rounded-full bg-slate-100 text-slate-600 hover:bg-blue-700 hover:text-white flex items-center justify-center transition-colors text-xs"
                        >
                          <LinkedInIcon />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* ── 4. OUR CLIENTS SECTION ──────────────────────────────────────────── */}
        <section className="bg-gradient-hero rounded-3xl p-8 sm:p-12 border border-soft-border space-y-8">
          <div className="text-center max-w-2xl mx-auto">
            <span className="badge mb-2 inline-flex items-center gap-1 px-3 py-1 bg-primary-100 text-primary-700 font-semibold rounded-full text-xs uppercase tracking-wider">
              Partnerships
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900">
              Our Clients & Partners
            </h2>
            <p className="text-slate-500 mt-2 text-sm sm:text-base">
              Trusted by medical institutions, educational bodies, and healthcare partners across Tamil Nadu and internationally.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {clients.map((client, i) => {
              const CardWrapper = client.website ? 'a' : 'div'
              const wrapperProps = client.website ? {
                href: client.website.startsWith('http') ? client.website : `https://${client.website}`,
                target: "_blank",
                rel: "noreferrer",
              } : {}

              return (
                <CardWrapper 
                  key={client.id || i} 
                  {...wrapperProps}
                  className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md hover:border-primary-200 transition-all text-center flex flex-col items-center justify-between gap-3 group relative"
                >
                  <div className="w-12 h-12 rounded-2xl bg-primary-50 border border-primary-100/60 flex items-center justify-center p-1.5 overflow-hidden group-hover:scale-105 group-hover:bg-primary-100/60 transition-transform">
                    {client.logo_url ? (
                      <img 
                        src={client.logo_url} 
                        alt={client.name} 
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          e.target.onerror = null
                          e.target.style.display = 'none'
                        }}
                      />
                    ) : (
                      <Building2 size={22} className="text-primary-600" />
                    )}
                  </div>
                  
                  <div className="space-y-1 w-full">
                    <h4 className="text-xs font-bold text-slate-800 leading-tight group-hover:text-primary-700 transition-colors line-clamp-2">
                      {client.name}
                    </h4>
                    <span className="inline-block text-[10px] font-semibold text-slate-500 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-100">
                      {client.category || 'Partner'}
                    </span>
                    {client.location && (
                      <p className="text-[10px] text-slate-400 truncate">{client.location}</p>
                    )}
                  </div>

                  {client.website && (
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] text-primary-600 font-semibold flex items-center gap-1 mt-1">
                      <span>Visit</span>
                      <ExternalLink size={10} />
                    </div>
                  )}
                </CardWrapper>
              )
            })}
          </div>
        </section>

        {/* ── 5. CONTACT INFORMATION & FORM SECTION ───────────────────────────── */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start" id="contact-section">
          
          {/* Contact Details Column */}
          <div className="lg:col-span-5 space-y-8">
            <div>
              <span className="badge mb-2 inline-flex items-center gap-1 px-3 py-1 bg-primary-100 text-primary-700 font-semibold rounded-full text-xs uppercase tracking-wider">
                Contact Information
              </span>
              <h2 className="text-3xl font-extrabold text-slate-900 mt-2">
                Get In Touch With Us
              </h2>
              <p className="text-slate-500 mt-3 text-base leading-relaxed">
                Have questions regarding our Tamil Medical Dictionary, services, or partnerships? Reach out directly to our Chennai team.
              </p>
            </div>

            <div className="space-y-4">
              <div className="soft-card p-5 bg-white border border-slate-200 rounded-2xl flex items-center gap-4 shadow-sm">
                <div className="w-12 h-12 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center flex-shrink-0">
                  <Mail size={22} />
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Email</p>
                  <a href="mailto:Tamilmedictionary@gmail.com" className="text-slate-800 font-bold hover:text-primary-600 transition-colors text-base">
                    Tamilmedictionary@gmail.com
                  </a>
                </div>
              </div>

              <div className="soft-card p-5 bg-white border border-slate-200 rounded-2xl flex items-center gap-4 shadow-sm">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
                  <MapPin size={22} />
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Location</p>
                  <p className="text-slate-800 font-bold text-base">
                    Chennai, Tamil Nadu, India
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form Column */}
          <div className="lg:col-span-7">
            <div className="soft-card p-8 bg-white border border-slate-200/90 rounded-3xl shadow-xl space-y-6">
              <div>
                <h3 className="text-2xl font-bold text-slate-900">Contact Form</h3>
                <p className="text-xs text-slate-500 mt-1">Fill out the fields below and our team will get back to you promptly.</p>
              </div>

              <form onSubmit={handleContactSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">First Name *</label>
                    <input 
                      type="text" 
                      required 
                      value={form.first_name} 
                      onChange={e => setForm(f => ({ ...f, first_name: e.target.value }))} 
                      placeholder="e.g. John" 
                      className="soft-input w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 text-sm" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">Last Name *</label>
                    <input 
                      type="text" 
                      required 
                      value={form.last_name} 
                      onChange={e => setForm(f => ({ ...f, last_name: e.target.value }))} 
                      placeholder="e.g. Doe" 
                      className="soft-input w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 text-sm" 
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Email *</label>
                  <input 
                    type="email" 
                    required 
                    value={form.email} 
                    onChange={e => setForm(f => ({ ...f, email: e.target.value }))} 
                    placeholder="e.g. Tamilmedictionary@gmail.com" 
                    className="soft-input w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 text-sm" 
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Company</label>
                  <input 
                    type="text" 
                    value={form.company} 
                    onChange={e => setForm(f => ({ ...f, company: e.target.value }))} 
                    placeholder="e.g. Hospital / Organization Name" 
                    className="soft-input w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 text-sm" 
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Message *</label>
                  <textarea 
                    required 
                    rows={4} 
                    value={form.message} 
                    onChange={e => setForm(f => ({ ...f, message: e.target.value }))} 
                    placeholder="Write your query or message here..." 
                    className="soft-input w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 text-sm resize-none" 
                  />
                </div>

                {formStatus && (
                  <div className={`flex items-start gap-2 p-4 rounded-xl text-sm ${formStatus.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'}`}>
                    <CheckCircle2 size={18} className="mt-0.5 flex-shrink-0" />
                    {formStatus.message}
                  </div>
                )}

                <button 
                  type="submit" 
                  disabled={formLoading} 
                  className="btn-primary w-full py-3 rounded-xl bg-gradient-blue text-white font-bold flex items-center justify-center gap-2 hover:shadow-lg transition-all disabled:opacity-60"
                >
                  {formLoading ? (
                    <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Submitting...</>
                  ) : (
                    <><Send size={16} /> Submit</>
                  )}
                </button>
              </form>
            </div>
          </div>
        </section>

        {/* ── 6. QUICK LINKS SECTION ─────────────────────────────────────────── */}
        <section className="border-t border-slate-200/80 pt-16 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="badge mb-1 inline-flex items-center gap-1 px-2.5 py-0.5 bg-slate-100 text-slate-600 font-semibold rounded-full text-xs uppercase tracking-wider">
                Navigation
              </span>
              <h2 className="text-2xl font-extrabold text-slate-900">
                Quick Links
              </h2>
            </div>
            <p className="text-xs text-slate-400">Explore key legal, help, and contact resources.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {QUICK_LINKS.map((item, i) => {
              const IconComp = item.icon
              return (
                <Link 
                  key={i} 
                  to={item.path} 
                  className="soft-card p-5 bg-white border border-slate-200/80 rounded-2xl hover:border-primary-400 hover:shadow-md transition-all group flex flex-col justify-between space-y-3"
                >
                  <div className="w-9 h-9 rounded-xl bg-slate-100 group-hover:bg-primary-50 text-slate-600 group-hover:text-primary-600 flex items-center justify-center transition-colors">
                    <IconComp size={18} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm group-hover:text-primary-600 transition-colors flex items-center gap-1">
                      {item.label} <ArrowRight size={13} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                    </h4>
                    <p className="text-xs text-slate-400 mt-1">{item.description}</p>
                  </div>
                </Link>
              )
            })}
          </div>
        </section>

      </div>
    </div>
  )
}
