import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@admin/context/AuthContext'
import { LogIn, Shield, UserCheck, BookOpen, Lock, Mail, CheckCircle2, AlertCircle } from 'lucide-react'

export default function LoginPage() {
  const { login } = useAuth()
  const [activeTab, setActiveTab] = useState('user')
  const [email, setEmail]         = useState('')
  const [password, setPassword]   = useState('')
  const [loading, setLoading]     = useState(false)
  const [status, setStatus]       = useState(null)
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setStatus(null)
    if (activeTab === 'user') {
      setTimeout(() => {
        setLoading(false)
        localStorage.setItem('user_session', JSON.stringify({ email, role: 'user', loggedInAt: new Date() }))
        setStatus({ type: 'success', message: 'Login successful! Redirecting...' })
        setTimeout(() => navigate('/'), 1000)
      }, 500)
    } else {
      try {
        await login(email.trim(), password)
        setStatus({ type: 'success', message: 'Admin authenticated! Opening Dashboard...' })
        setTimeout(() => navigate('/admin'), 600)
      } catch (err) {
        setStatus({ type: 'error', message: err.response?.data?.detail || 'Login failed. Check your username and password.' })
      } finally {
        setLoading(false)
      }
    }
  }

  const isAdmin = activeTab === 'admin'

  return (
    <div style={{
      paddingTop: '64px', minHeight: '100vh',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(145deg,#f0f6ff 0%,#e8f0fe 40%,#f5f0ff 100%)',
      position: 'relative', overflow: 'hidden', padding: '80px 24px 40px',
    }}>
      {/* Orbs */}
      <div style={{ position:'absolute',top:'10%',right:'8%',width:'280px',height:'280px',borderRadius:'50%',background:'radial-gradient(circle,rgba(99,102,241,0.12) 0%,transparent 70%)',filter:'blur(35px)',animation:'floatY 6s ease-in-out infinite',pointerEvents:'none' }} />
      <div style={{ position:'absolute',bottom:'10%',left:'6%',width:'200px',height:'200px',borderRadius:'50%',background:'radial-gradient(circle,rgba(59,130,246,0.10) 0%,transparent 70%)',filter:'blur(28px)',animation:'floatY 8s ease-in-out infinite 2s',pointerEvents:'none' }} />

      {/* Card */}
      <div style={{
        width: '100%', maxWidth: '440px',
        background: 'rgba(255,255,255,0.90)',
        backdropFilter: 'blur(20px)',
        border: '1.5px solid rgba(99,102,241,0.14)',
        borderRadius: '28px',
        padding: '40px',
        boxShadow: '0 24px 80px rgba(99,102,241,0.12)',
        animation: 'scaleIn 0.5s cubic-bezier(.2,.9,.2,1) both',
        position: 'relative', zIndex: 1,
      }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{
            width: '52px', height: '52px', borderRadius: '16px',
            background: 'linear-gradient(135deg,#6366f1,#3b82f6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 14px',
            boxShadow: '0 8px 24px rgba(99,102,241,0.35)',
            animation: 'floatY 4s ease-in-out infinite',
          }}>
            <BookOpen size={24} color="white" />
          </div>
          <h1 style={{ fontSize: '22px', fontWeight: 900, color: '#1e1b4b', marginBottom: '4px' }}>
            Welcome to{' '}
            <span style={{ background:'linear-gradient(135deg,#6366f1,#3b82f6)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>
              TamilMeDictionary
            </span>
          </h1>
          <p style={{ fontSize: '13px', color: '#9ca3af' }}>Sign in to access your portal features or admin dashboard.</p>
        </div>

        {/* Tabs */}
        <div style={{
          display: 'flex', background: '#f1f5f9', borderRadius: '14px', padding: '4px', marginBottom: '20px',
        }}>
          {[['user', <UserCheck size={15} />, 'User Login'], ['admin', <Shield size={15} />, 'Admin Login']].map(([tab, icon, label]) => (
            <button key={tab} type="button"
              onClick={() => { setActiveTab(tab); setStatus(null) }}
              style={{
                flex: 1, padding: '10px 0', borderRadius: '11px', fontWeight: 700, fontSize: '13px',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                cursor: 'pointer', border: 'none', transition: 'all 0.25s cubic-bezier(.2,.9,.2,1)',
                background: activeTab === tab ? (tab === 'admin' ? 'linear-gradient(135deg,#1e1b4b,#312e81)' : 'white') : 'transparent',
                color: activeTab === tab ? (tab === 'admin' ? 'white' : '#4f46e5') : '#9ca3af',
                boxShadow: activeTab === tab ? '0 4px 12px rgba(0,0,0,0.12)' : 'none',
              }}
            >{icon} {label}</button>
          ))}
        </div>

        {/* Tab description */}
        <div style={{
          fontSize: '12.5px', color: '#6b7280', background: isAdmin ? 'rgba(30,27,75,0.04)' : 'rgba(99,102,241,0.04)',
          padding: '12px 16px', borderRadius: '12px',
          border: `1px solid ${isAdmin ? 'rgba(30,27,75,0.10)' : 'rgba(99,102,241,0.12)'}`,
          marginBottom: '20px', transition: 'all 0.3s ease',
        }}>
          {isAdmin
            ? <><strong style={{ color: '#312e81' }}>Admin Portal:</strong> Manage dictionary terms, team members, blog posts, and site content.</>
            : <><strong style={{ color: '#4f46e5' }}>User Portal:</strong> Search medical terms, save bookmarks, and manage your learning profile.</>
          }
        </div>

        {/* Status */}
        {status && (
          <div style={{
            padding: '12px 16px', borderRadius: '12px', fontSize: '13px',
            display: 'flex', alignItems: 'flex-start', gap: '8px',
            background: status.type === 'success' ? 'rgba(16,185,129,0.08)' : 'rgba(239,68,68,0.08)',
            border: `1.5px solid ${status.type === 'success' ? 'rgba(16,185,129,0.25)' : 'rgba(239,68,68,0.25)'}`,
            color: status.type === 'success' ? '#059669' : '#dc2626',
            marginBottom: '16px', animation: 'popIn 0.4s ease both',
          }}>
            {status.type === 'success' ? <CheckCircle2 size={15} style={{ flexShrink: 0, marginTop: '1px' }} /> : <AlertCircle size={15} style={{ flexShrink: 0, marginTop: '1px' }} />}
            {status.message}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {[
            { key: 'email', label: isAdmin ? 'Admin Email / Username' : 'Email Address', type: isAdmin ? 'text' : 'email', icon: <Mail size={16} />, placeholder: isAdmin ? 'admin' : 'user@example.com', value: email, onChange: e => setEmail(e.target.value) },
            { key: 'password', label: 'Password', type: 'password', icon: <Lock size={16} />, placeholder: '••••••••', value: password, onChange: e => setPassword(e.target.value) },
          ].map(field => (
            <div key={field.key}>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#6366f1', letterSpacing: '0.05em', marginBottom: '6px' }}>
                {field.label} *
              </label>
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af', pointerEvents: 'none' }}>
                  {field.icon}
                </div>
                <input type={field.type} required value={field.value} onChange={field.onChange} placeholder={field.placeholder}
                  style={{
                    width: '100%', padding: '12px 14px 12px 42px', boxSizing: 'border-box',
                    background: '#f8faff', border: '2px solid rgba(99,102,241,0.12)',
                    borderRadius: '12px', fontSize: '14px', color: '#1e1b4b', outline: 'none',
                    transition: 'all 0.22s ease',
                  }}
                  onFocus={e => e.target.style.border = '2px solid #6366f1'}
                  onBlur={e => e.target.style.border = '2px solid rgba(99,102,241,0.12)'}
                />
              </div>
            </div>
          ))}

          <button type="submit" id="login-submit" disabled={loading} style={{
            padding: '13px 24px', borderRadius: '14px', fontWeight: 800, fontSize: '15px',
            background: isAdmin ? 'linear-gradient(135deg,#1e1b4b,#312e81)' : 'linear-gradient(135deg,#6366f1,#4f46e5)',
            color: 'white', border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
            boxShadow: `0 4px 14px ${isAdmin ? 'rgba(30,27,75,0.30)' : 'rgba(99,102,241,0.30)'}`,
            opacity: loading ? 0.7 : 1,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            transition: 'all 0.22s ease', marginTop: '4px',
          }}
            onMouseEnter={e => { if(!loading) { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = `0 8px 24px ${isAdmin ? 'rgba(30,27,75,0.40)' : 'rgba(99,102,241,0.45)'}` }}}
            onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = `0 4px 14px ${isAdmin ? 'rgba(30,27,75,0.30)' : 'rgba(99,102,241,0.30)'}` }}
          >
            {loading
              ? <><span style={{ width:'16px',height:'16px',border:'2px solid rgba(255,255,255,0.3)',borderTopColor:'white',borderRadius:'50%',animation:'spin 0.8s linear infinite' }} /> Signing In...</>
              : <><LogIn size={16} /> {isAdmin ? 'Sign In to Admin Dashboard' : 'Sign In'}</>
            }
          </button>
        </form>

        <p style={{ textAlign: 'center', fontSize: '12px', color: '#9ca3af', marginTop: '20px' }}>
          {isAdmin
            ? <>Default: Username <strong style={{ color: '#1e1b4b' }}>admin</strong> | Password <strong style={{ color: '#1e1b4b' }}>Admin@1234</strong></>
            : <>Need help? <Link to="/contact" style={{ color: '#6366f1', fontWeight: 700, textDecoration: 'none' }}>Contact Support</Link></>
          }
        </p>
      </div>
    </div>
  )
}
