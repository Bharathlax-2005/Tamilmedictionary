import { useState, useEffect } from 'react'
import { Activity, Microscope, Stethoscope, Languages, FileText, ShieldCheck, CheckCircle2 } from 'lucide-react'
import { listServices } from '../services/api'
import LoadingSpinner from '../components/LoadingSpinner'
import PageHero from '../components/PageHero'
import useScrollReveal from '../hooks/useScrollReveal'

function getServiceIcon(ic) {
  if (!ic) return <span style={{ fontSize: '28px' }}>🩺</span>
  
  const emojiMap = {
    'FileText': '📋',
    'Pill': '💊',
    'GraduationCap': '🔬',
    'HeartPulse': '🏥',
    'Smartphone': '📱',
    'BookMarked': '📖',
    'Stethoscope': '🩺',
    'Languages': '🌐',
    'ShieldCheck': '🛡️',
    'Activity': '⚡'
  }

  if (emojiMap[ic]) {
    return <span style={{ fontSize: '28px', lineHeight: 1 }}>{emojiMap[ic]}</span>
  }

  if (typeof ic === 'string' && /[\p{Emoji}\u200d]+/u.test(ic)) {
    return <span style={{ fontSize: '28px', lineHeight: 1 }}>{ic}</span>
  }

  if (ic === '🔬') return <Microscope size={26} className="text-primary-600" />
  if (ic === '🏥' || ic === '🩺') return <Stethoscope size={26} className="text-cyan-600" />
  if (ic === '🌐' || ic === '🗣️') return <Languages size={26} className="text-teal-600" />
  if (ic === '📄' || ic === '📋') return <FileText size={26} className="text-indigo-600" />
  if (ic === '✅' || ic === '🛡️') return <ShieldCheck size={26} className="text-emerald-600" />
  
  return <span style={{ fontSize: '28px', lineHeight: 1 }}>🩺</span>
}

export default function ServicesPage() {
  useScrollReveal()
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    listServices()
      .then(res => setServices(res.data?.services || []))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  return (
    <div style={{ paddingTop:'64px', minHeight:'100vh', background:'#fafbff' }}>
      <PageHero
        badge="Our Services"
        badgeIcon={<Activity size={13} />}
        title={<>Medical <span style={{ background:'linear-gradient(135deg,#6366f1,#3b82f6)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>Services & Solutions</span></>}
        subtitle="Professional translation, lexicography, and consulting for healthcare and life sciences"
      />

      <div style={{ maxWidth:'1200px', margin:'0 auto', padding:'56px 24px' }}>
        {loading ? (
          <LoadingSpinner size="lg" text="Loading services..." />
        ) : services.length > 0 ? (
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(320px,1fr))', gap:'28px' }} className="stagger">
            {services.map((s, i) => (
              <div key={s.id || i} className="reveal glass-card-light" style={{ padding:'32px', display:'flex', flexDirection:'column', animationDelay:`${i*80}ms` }}>
                <div style={{
                  width:'56px', height:'56px', borderRadius:'16px', marginBottom:'20px',
                  background:'linear-gradient(135deg,rgba(99,102,241,0.12),rgba(59,130,246,0.10))',
                  display:'flex', alignItems:'center', justifyContent:'center',
                  border:'1.5px solid rgba(99,102,241,0.14)',
                }}>
                  {getServiceIcon(s.icon)}
                </div>
                <h3 style={{ fontSize:'18px', fontWeight:800, color:'#1e1b4b', marginBottom:'10px' }}>{s.title}</h3>
                <p style={{ fontSize:'14px', color:'#6b7280', lineHeight:1.75, marginBottom:'16px' }}>{s.description}</p>
                {s.features?.length > 0 && (
                  <ul style={{ listStyle:'none', padding:0, margin:0, display:'flex', flexDirection:'column', gap:'6px' }}>
                    {s.features.map((f, fi) => (
                      <li key={fi} style={{ display:'flex', alignItems:'center', gap:'8px', fontSize:'13px', color:'#4b5563' }}>
                        <CheckCircle2 size={14} color="#6366f1" /> {f}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign:'center', padding:'80px 0' }}>
            <div className="w-20 h-20 rounded-3xl bg-indigo-50 flex items-center justify-center border border-indigo-100 text-primary-600 shadow-sm mx-auto mb-4">
              <Activity size={40} />
            </div>
            <h3 style={{ fontSize:'20px', fontWeight:700, color:'#1e1b4b' }}>Services coming soon</h3>
          </div>
        )}
      </div>
    </div>
  )
}
