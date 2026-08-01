import { useState } from 'react'
import { submitContact } from '../services/api'
import { Mail, MapPin, Send, CheckCircle2, MessageSquare } from 'lucide-react'
import PageHero from '../components/PageHero'
import useScrollReveal from '../hooks/useScrollReveal'

function FloatingInput({ label, type = 'text', value, onChange, required, placeholder = ' ', id }) {
  const [focused, setFocused] = useState(false)
  const hasValue = value && value.length > 0
  return (
    <div style={{ position: 'relative' }}>
      <input
        id={id}
        type={type}
        required={required}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          width: '100%', padding: '20px 16px 8px',
          background: '#f8faff',
          border: focused ? '2px solid #6366f1' : '2px solid rgba(99,102,241,0.12)',
          borderRadius: '14px', fontSize: '15px', color: '#1e1b4b',
          outline: 'none', boxSizing: 'border-box',
          boxShadow: focused ? '0 0 0 4px rgba(99,102,241,0.08)' : 'none',
          transition: 'all 0.25s ease',
        }}
      />
      <label style={{
        position: 'absolute', left: '16px',
        top: (focused || hasValue) ? '8px' : '50%',
        transform: (focused || hasValue) ? 'none' : 'translateY(-50%)',
        fontSize: (focused || hasValue) ? '10px' : '14px',
        color: focused ? '#6366f1' : '#9ca3af',
        fontWeight: (focused || hasValue) ? 700 : 400,
        transition: 'all 0.22s cubic-bezier(.2,.9,.2,1)',
        pointerEvents: 'none', letterSpacing: (focused || hasValue) ? '0.05em' : 0,
      }}>
        {label}{required && ' *'}
      </label>
    </div>
  )
}

function FloatingTextarea({ label, value, onChange, required, rows = 5, id }) {
  const [focused, setFocused] = useState(false)
  const hasValue = value && value.length > 0
  return (
    <div style={{ position: 'relative' }}>
      <textarea
        id={id}
        required={required}
        value={value}
        onChange={onChange}
        rows={rows}
        placeholder=" "
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          width: '100%', padding: '24px 16px 8px', resize: 'none',
          background: '#f8faff',
          border: focused ? '2px solid #6366f1' : '2px solid rgba(99,102,241,0.12)',
          borderRadius: '14px', fontSize: '15px', color: '#1e1b4b',
          outline: 'none', boxSizing: 'border-box',
          boxShadow: focused ? '0 0 0 4px rgba(99,102,241,0.08)' : 'none',
          transition: 'all 0.25s ease',
        }}
      />
      <label style={{
        position: 'absolute', left: '16px',
        top: (focused || hasValue) ? '8px' : '18px',
        fontSize: (focused || hasValue) ? '10px' : '14px',
        color: focused ? '#6366f1' : '#9ca3af',
        fontWeight: (focused || hasValue) ? 700 : 400,
        transition: 'all 0.22s cubic-bezier(.2,.9,.2,1)',
        pointerEvents: 'none', letterSpacing: (focused || hasValue) ? '0.05em' : 0,
      }}>
        {label}{required && ' *'}
      </label>
    </div>
  )
}

export default function ContactPage() {
  useScrollReveal()
  const [form, setForm]     = useState({ first_name: '', last_name: '', email: '', company: '', message: '' })
  const [status, setStatus] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setStatus(null)
    try {
      await submitContact(form)
      setStatus({ type: 'success', message: 'Thank you! We have received your message and will contact you within 2 days.' })
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
        badge="Get In Touch"
        badgeIcon={<MessageSquare size={13} />}
        title={<>Contact <span style={{ background:'linear-gradient(135deg,#6366f1,#3b82f6)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>Us</span></>}
        subtitle="Reach out for translations, support, or contribution opportunities. We'd love to hear from you."
      />

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '56px 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(320px,1fr))', gap: '32px', alignItems: 'start' }}>

          {/* Left info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Image mosaic */}
            <div className="reveal-left" style={{ borderRadius: '20px', overflow: 'hidden', boxShadow: '0 12px 40px rgba(99,102,241,0.12)' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', height: '200px' }}>
                {[
                  'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=400&q=80',
                  'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=400&q=80',
                  'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=400&q=80',
                ].map((src, i) => (
                  <div key={i} style={{ overflow: 'hidden' }}>
                    <img src={src} alt="" style={{ width: '100%', height: '200px', objectFit: 'cover', display: 'block', transition: 'transform 0.4s ease' }}
                      onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.08)'}
                      onMouseLeave={e => e.currentTarget.style.transform = ''}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="reveal-left" style={{ animationDelay:'100ms',
              background: 'white', borderRadius: '20px', padding: '28px',
              border: '1.5px solid rgba(99,102,241,0.10)',
              boxShadow: '0 4px 20px rgba(99,102,241,0.06)',
            }}>
              <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#1e1b4b', marginBottom: '8px' }}>
                Send your message<br />and we'll reply quickly.
              </h2>
              <p style={{ fontSize: '14px', color: '#6b7280', lineHeight: 1.75, marginBottom: '24px' }}>
                Our team reviews every submission and replies with guidance or next steps.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {[
                  { icon: <Mail size={16} color="#6366f1" />, label: 'Email', value: 'Tamilmedictionary@gmail.com', href: 'mailto:Tamilmedictionary@gmail.com' },
                  { icon: <MapPin size={16} color="#3b82f6" />, label: 'Location', value: 'Chennai, Tamil Nadu, India' },
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                    <div style={{
                      width: '36px', height: '36px', borderRadius: '10px', flexShrink: 0,
                      background: 'rgba(99,102,241,0.08)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      {item.icon}
                    </div>
                    <div>
                      <p style={{ fontSize: '11px', color: '#9ca3af', fontWeight: 600, letterSpacing: '0.05em', marginBottom: '2px' }}>{item.label.toUpperCase()}</p>
                      {item.href ? (
                        <a href={item.href} style={{ fontSize: '14px', color: '#4b5563', textDecoration: 'none', transition: 'color 0.2s' }}
                          onMouseEnter={e => e.currentTarget.style.color = '#6366f1'}
                          onMouseLeave={e => e.currentTarget.style.color = '#4b5563'}
                        >{item.value}</a>
                      ) : (
                        <p style={{ fontSize: '14px', color: '#4b5563', margin: 0 }}>{item.value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right form */}
          <div className="reveal-right" style={{
            background: 'white', borderRadius: '24px', padding: '36px',
            border: '1.5px solid rgba(99,102,241,0.10)',
            boxShadow: '0 8px 40px rgba(99,102,241,0.08)',
          }}>
            <p style={{ fontSize: '11px', fontWeight: 700, color: '#6366f1', letterSpacing: '0.1em', marginBottom: '6px' }}>MESSAGE US</p>
            <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#1e1b4b', marginBottom: '6px' }}>Secure contact form</h2>
            <p style={{ fontSize: '14px', color: '#9ca3af', marginBottom: '28px' }}>Our team will respond within 24–48 hours.</p>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <FloatingInput id="contact-first-name" label="First Name" value={form.first_name} onChange={e => setForm(f => ({ ...f, first_name: e.target.value }))} required />
                <FloatingInput id="contact-last-name" label="Last Name" value={form.last_name} onChange={e => setForm(f => ({ ...f, last_name: e.target.value }))} required />
              </div>
              <FloatingInput id="contact-email" label="Email Address" type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required />
              <FloatingInput id="contact-company" label="Company / Organization" value={form.company} onChange={e => setForm(f => ({ ...f, company: e.target.value }))} />
              <FloatingTextarea id="contact-message" label="Message" value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} required rows={5} />

              {status && (
                <div style={{
                  padding: '14px 18px', borderRadius: '14px', fontSize: '14px',
                  background: status.type === 'success' ? 'rgba(16,185,129,0.08)' : 'rgba(239,68,68,0.08)',
                  border: `1.5px solid ${status.type === 'success' ? 'rgba(16,185,129,0.25)' : 'rgba(239,68,68,0.25)'}`,
                  color: status.type === 'success' ? '#059669' : '#dc2626',
                  display: 'flex', alignItems: 'flex-start', gap: '8px',
                  animation: 'popIn 0.4s ease both',
                }}>
                  <CheckCircle2 size={16} style={{ flexShrink: 0, marginTop: '1px' }} />
                  {status.message}
                </div>
              )}

              <button type="submit" id="contact-submit" disabled={loading}
                style={{
                  padding: '14px 24px', borderRadius: '14px', fontWeight: 700, fontSize: '15px',
                  background: 'linear-gradient(135deg,#6366f1,#4f46e5)', color: 'white',
                  border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
                  boxShadow: '0 4px 14px rgba(99,102,241,0.35)',
                  opacity: loading ? 0.7 : 1,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                  transition: 'all 0.22s ease',
                }}
                onMouseEnter={e => { if(!loading) { e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.boxShadow='0 8px 24px rgba(99,102,241,0.45)'; }}}
                onMouseLeave={e => { e.currentTarget.style.transform=''; e.currentTarget.style.boxShadow='0 4px 14px rgba(99,102,241,0.35)'; }}
              >
                {loading ? (
                  <><span style={{ width:'16px', height:'16px', border:'2px solid rgba(255,255,255,0.3)', borderTopColor:'white', borderRadius:'50%', animation:'spin 0.8s linear infinite' }} /> Sending...</>
                ) : (
                  <><Send size={16} /> Send Message</>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
