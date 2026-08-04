import { Activity, Microscope, Stethoscope, Languages, FileText, CheckCircle2, ShieldCheck, HeartPulse, Pill, Smartphone, BookMarked, GraduationCap } from 'lucide-react'

export default function ServiceCard({ service, index }) {
  const getIcon = (ic) => {
    if (!ic) return <span style={{ fontSize: '28px' }}>🩺</span>
    
    // Emoji mapping for known service types or direct emojis
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

    // Direct emoji string check
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

  return (
    <div
      className="reveal glass-card-light"
      style={{ padding: '32px', animationDelay: `${index * 80}ms` }}
    >
      {/* Icon */}
      <div style={{
        width: '56px', height: '56px', borderRadius: '16px', marginBottom: '20px',
        background: 'linear-gradient(135deg,rgba(99,102,241,0.12),rgba(59,130,246,0.08))',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        border: '1.5px solid rgba(99,102,241,0.14)',
        transition: 'transform 0.3s ease',
      }}
        onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.15) rotate(-4deg)'}
        onMouseLeave={e => e.currentTarget.style.transform = ''}
      >
        {getIcon(service.icon)}
      </div>
      <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#1e1b4b', marginBottom: '8px' }}>{service.title}</h3>
      <p style={{ fontSize: '13.5px', color: '#6b7280', lineHeight: 1.75 }}>{service.description}</p>
    </div>
  )
}
