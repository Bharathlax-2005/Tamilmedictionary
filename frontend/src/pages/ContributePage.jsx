import { useState } from 'react'
import { submitContact } from '../services/api'
import { Send, CheckCircle2, GitMerge, Sparkles, FileText, CheckCircle, Share2 } from 'lucide-react'
import PageHero from '../components/PageHero'
import useScrollReveal from '../hooks/useScrollReveal'

const WHY_ITEMS = [
  { icon: <FileText size={22} className="text-primary-600" />, title: "Submit Medical Terms", desc: "Share English-Tamil term pairs with definitions" },
  { icon: <CheckCircle size={22} className="text-emerald-600" />, title: "Review Translations", desc: "Help validate and improve existing translations" },
  { icon: <Share2 size={22} className="text-purple-600" />, title: "Share Resources", desc: "Contribute medical glossaries or reference materials" },
]


export default function ContributePage() {
  useScrollReveal()
  const [form, setForm]     = useState({ first_name: '', last_name: '', email: '', company: '', message: '' })
  const [status, setStatus] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await submitContact({ ...form, message: `[CONTRIBUTION] ${form.message}` })
      setStatus({ type: 'success', message: "Thank you for your interest in contributing! We'll be in touch soon." })
      setForm({ first_name: '', last_name: '', email: '', company: '', message: '' })
    } catch {
      setStatus({ type: 'error', message: 'Something went wrong. Please try again.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ paddingTop: '64px', minHeight: '100vh', background: '#fafbff' }}>
      <PageHero
        badge="Contribute"
        badgeIcon={<GitMerge size={13} />}
        title={<>Help Us <span style={{ background:'linear-gradient(135deg,#6366f1,#3b82f6)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>Grow</span></>}
        subtitle="Contribute medical terms, translations, or expertise to expand the dictionary"
      />

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '56px 24px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: '32px', alignItems: 'start' }}>

        {/* Left */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="reveal-left">
            <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#1e1b4b', marginBottom: '12px' }}>Why Contribute?</h2>
            <p style={{ fontSize: '14px', color: '#6b7280', lineHeight: 1.8, marginBottom: '28px' }}>
              TamilMeDictionary is a community-driven initiative. By contributing your knowledge, you're helping to preserve and expand Tamil medical vocabulary for future generations of healthcare professionals.
            </p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }} className="stagger">
            {WHY_ITEMS.map((item, i) => (
              <div key={i} className="reveal glass-card-light" style={{ padding: '20px', display: 'flex', gap: '16px', alignItems: 'center' }}>
                <div className="w-10 h-10 rounded-xl bg-indigo-50/80 flex items-center justify-center flex-shrink-0 border border-indigo-100/70 shadow-sm">
                  {item.icon}
                </div>
                <div>
                  <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#1e1b4b', marginBottom: '4px' }}>{item.title}</h3>
                  <p style={{ fontSize: '13px', color: '#6b7280' }}>{item.desc}</p>
                </div>
              </div>
            ))}

          </div>
        </div>

        {/* Right form */}
        <div className="reveal-right" style={{
          background: 'white', borderRadius: '24px', padding: '36px',
          border: '1.5px solid rgba(99,102,241,0.10)',
          boxShadow: '0 8px 40px rgba(99,102,241,0.08)',
        }}>
          <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#1e1b4b', marginBottom: '20px' }}>Send Us Your Contribution</h3>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              {[['first_name','First Name *','text'],['last_name','Last Name *','text']].map(([key,label,type]) => (
                <div key={key}>
                  <label style={{ display:'block', fontSize:'11px', fontWeight:600, color:'#6366f1', letterSpacing:'0.05em', marginBottom:'6px' }}>{label}</label>
                  <input type={type} required value={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                    style={{ width:'100%', padding:'11px 14px', background:'#f8faff', border:'2px solid rgba(99,102,241,0.12)', borderRadius:'12px', fontSize:'14px', color:'#1e1b4b', outline:'none', boxSizing:'border-box', transition:'all 0.2s ease' }}
                    onFocus={e => e.target.style.border='2px solid #6366f1'}
                    onBlur={e => e.target.style.border='2px solid rgba(99,102,241,0.12)'}
                  />
                </div>
              ))}
            </div>
            <div>
              <label style={{ display:'block', fontSize:'11px', fontWeight:600, color:'#6366f1', letterSpacing:'0.05em', marginBottom:'6px' }}>Email *</label>
              <input type="email" required value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                style={{ width:'100%', padding:'11px 14px', background:'#f8faff', border:'2px solid rgba(99,102,241,0.12)', borderRadius:'12px', fontSize:'14px', color:'#1e1b4b', outline:'none', boxSizing:'border-box', transition:'all 0.2s ease' }}
                onFocus={e => e.target.style.border='2px solid #6366f1'}
                onBlur={e => e.target.style.border='2px solid rgba(99,102,241,0.12)'}
              />
            </div>
            <div>
              <label style={{ display:'block', fontSize:'11px', fontWeight:600, color:'#6366f1', letterSpacing:'0.05em', marginBottom:'6px' }}>Contribution / Message *</label>
              <textarea required rows={5} value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                style={{ width:'100%', padding:'11px 14px', background:'#f8faff', border:'2px solid rgba(99,102,241,0.12)', borderRadius:'12px', fontSize:'14px', color:'#1e1b4b', outline:'none', boxSizing:'border-box', resize:'none', transition:'all 0.2s ease' }}
                onFocus={e => e.target.style.border='2px solid #6366f1'}
                onBlur={e => e.target.style.border='2px solid rgba(99,102,241,0.12)'}
                placeholder="Describe your contribution or share the medical terms you'd like to add..."
              />
            </div>
            {status && (
              <div style={{
                padding:'14px 18px', borderRadius:'14px', fontSize:'14px',
                background: status.type==='success' ? 'rgba(16,185,129,0.08)' : 'rgba(239,68,68,0.08)',
                border: `1.5px solid ${status.type==='success' ? 'rgba(16,185,129,0.25)' : 'rgba(239,68,68,0.25)'}`,
                color: status.type==='success' ? '#059669' : '#dc2626',
                display:'flex', alignItems:'flex-start', gap:'8px',
                animation:'popIn 0.4s ease both',
              }}>
                <CheckCircle2 size={16} style={{ flexShrink:0, marginTop:'1px' }} /> {status.message}
              </div>
            )}
            <button type="submit" disabled={loading} style={{
              padding:'14px 24px', borderRadius:'14px', fontWeight:700, fontSize:'15px',
              background:'linear-gradient(135deg,#6366f1,#4f46e5)', color:'white',
              border:'none', cursor:loading?'not-allowed':'pointer',
              boxShadow:'0 4px 14px rgba(99,102,241,0.35)', opacity:loading?0.7:1,
              display:'flex', alignItems:'center', justifyContent:'center', gap:'8px',
              transition:'all 0.22s ease',
            }}
              onMouseEnter={e => { if(!loading) { e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.boxShadow='0 8px 24px rgba(99,102,241,0.45)'; }}}
              onMouseLeave={e => { e.currentTarget.style.transform=''; e.currentTarget.style.boxShadow='0 4px 14px rgba(99,102,241,0.35)'; }}
            >
              {loading ? <><span style={{ width:'16px',height:'16px',border:'2px solid rgba(255,255,255,0.3)',borderTopColor:'white',borderRadius:'50%',animation:'spin 0.8s linear infinite' }} /> Sending...</> : <><Send size={16} /> Submit Contribution</>}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
