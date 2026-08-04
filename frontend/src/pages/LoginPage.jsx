import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@admin/context/AuthContext'
import { LogIn, BookOpen, Lock, User, Eye, EyeOff, CheckCircle2, AlertCircle } from 'lucide-react'

export default function LoginPage() {
  const { login } = useAuth()
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword]     = useState('')
  const [showPass, setShowPass]     = useState(false)
  const [loading, setLoading]       = useState(false)
  const [status, setStatus]         = useState(null)
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setStatus(null)

    try {
      const res = await login(identifier.trim(), password)
      setStatus({ type: 'success', message: 'Login successful! Redirecting...' })
      setTimeout(() => {
        if (res?.role === 'admin') {
          navigate('/admin')
        } else {
          navigate('/')
        }
      }, 500)
    } catch (err) {
      setStatus({
        type: 'error',
        message: err.response?.data?.detail || 'Incorrect username or password. Please try again.',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      paddingTop: '64px', minHeight: '100vh',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(145deg,#f0f6ff 0%,#e8f0fe 40%,#f5f0ff 100%)',
      position: 'relative', overflow: 'hidden', padding: '80px 24px 40px',
    }}>
      {/* Background Decorative Orbs */}
      <div style={{
        position: 'absolute', top: '10%', right: '8%', width: '320px', height: '320px',
        borderRadius: '50%', background: 'radial-gradient(circle,rgba(99,102,241,0.14) 0%,transparent 70%)',
        filter: 'blur(40px)', animation: 'floatY 6s ease-in-out infinite', pointerEvents: 'none'
      }} />
      <div style={{
        position: 'absolute', bottom: '10%', left: '6%', width: '260px', height: '260px',
        borderRadius: '50%', background: 'radial-gradient(circle,rgba(59,130,246,0.12) 0%,transparent 70%)',
        filter: 'blur(32px)', animation: 'floatY 8s ease-in-out infinite 2s', pointerEvents: 'none'
      }} />

      {/* Login Card */}
      <div style={{
        width: '100%', maxWidth: '440px',
        background: 'rgba(255,255,255,0.92)',
        backdropFilter: 'blur(20px)',
        border: '1.5px solid rgba(99,102,241,0.15)',
        borderRadius: '28px',
        padding: '40px',
        boxShadow: '0 24px 80px rgba(99,102,241,0.12)',
        animation: 'scaleIn 0.5s cubic-bezier(.2,.9,.2,1) both',
        position: 'relative', zIndex: 1,
      }}>

        {/* Logo & Heading */}
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <div style={{
            width: '56px', height: '56px', borderRadius: '18px',
            background: 'linear-gradient(135deg,#6366f1,#3b82f6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 16px',
            boxShadow: '0 8px 24px rgba(99,102,241,0.35)',
            animation: 'floatY 4s ease-in-out infinite',
          }}>
            <BookOpen size={26} color="white" />
          </div>
          <h1 style={{ fontSize: '24px', fontWeight: 900, color: '#1e1b4b', marginBottom: '6px' }}>
            Sign In to{' '}
            <span style={{
              background: 'linear-gradient(135deg,#6366f1,#3b82f6)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              TamilMeDictionary
            </span>
          </h1>
          <p style={{ fontSize: '13.5px', color: '#64748b' }}>
            Enter your credentials to access your account
          </p>
        </div>

        {/* Status Message */}
        {status && (
          <div style={{
            padding: '12px 16px', borderRadius: '12px', fontSize: '13.5px',
            display: 'flex', alignItems: 'flex-start', gap: '10px',
            background: status.type === 'success' ? 'rgba(16,185,129,0.08)' : 'rgba(239,68,68,0.08)',
            border: `1.5px solid ${status.type === 'success' ? 'rgba(16,185,129,0.25)' : 'rgba(239,68,68,0.25)'}`,
            color: status.type === 'success' ? '#059669' : '#dc2626',
            marginBottom: '20px', animation: 'popIn 0.3s ease both',
          }}>
            {status.type === 'success'
              ? <CheckCircle2 size={18} style={{ flexShrink: 0, marginTop: '1px' }} />
              : <AlertCircle size={18} style={{ flexShrink: 0, marginTop: '1px' }} />
            }
            <span>{status.message}</span>
          </div>
        )}

        {/* Common Login Form */}
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Username / Email Field */}
          <div>
            <label style={{
              display: 'block', fontSize: '12px', fontWeight: 700,
              color: '#4338ca', letterSpacing: '0.04em', marginBottom: '6px'
            }}>
              Username or Email *
            </label>
            <div style={{ position: 'relative' }}>
              <div style={{
                position: 'absolute', left: '14px', top: '50%',
                transform: 'translateY(-50%)', color: '#94a3b8', pointerEvents: 'none',
                display: 'flex', alignItems: 'center'
              }}>
                <User size={18} />
              </div>
              <input
                id="login-identifier"
                type="text"
                required
                value={identifier}
                onChange={e => setIdentifier(e.target.value)}
                placeholder="Enter your username or email"
                autoComplete="username"
                style={{
                  width: '100%', padding: '12px 14px 12px 42px', boxSizing: 'border-box',
                  background: '#f8faff', border: '2px solid rgba(99,102,241,0.15)',
                  borderRadius: '12px', fontSize: '14px', color: '#1e1b4b', outline: 'none',
                  transition: 'all 0.22s ease',
                }}
                onFocus={e => { e.target.style.border = '2px solid #6366f1'; e.target.style.background = '#ffffff' }}
                onBlur={e => { e.target.style.border = '2px solid rgba(99,102,241,0.15)'; e.target.style.background = '#f8faff' }}
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label style={{
              display: 'block', fontSize: '12px', fontWeight: 700,
              color: '#4338ca', letterSpacing: '0.04em', marginBottom: '6px'
            }}>
              Password *
            </label>
            <div style={{ position: 'relative' }}>
              <div style={{
                position: 'absolute', left: '14px', top: '50%',
                transform: 'translateY(-50%)', color: '#94a3b8', pointerEvents: 'none',
                display: 'flex', alignItems: 'center'
              }}>
                <Lock size={18} />
              </div>
              <input
                id="login-password"
                type={showPass ? 'text' : 'password'}
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
                style={{
                  width: '100%', padding: '12px 42px 12px 42px', boxSizing: 'border-box',
                  background: '#f8faff', border: '2px solid rgba(99,102,241,0.15)',
                  borderRadius: '12px', fontSize: '14px', color: '#1e1b4b', outline: 'none',
                  transition: 'all 0.22s ease',
                }}
                onFocus={e => { e.target.style.border = '2px solid #6366f1'; e.target.style.background = '#ffffff' }}
                onBlur={e => { e.target.style.border = '2px solid rgba(99,102,241,0.15)'; e.target.style.background = '#f8faff' }}
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                style={{
                  position: 'absolute', right: '12px', top: '50%',
                  transform: 'translateY(-50%)', background: 'transparent',
                  border: 'none', cursor: 'pointer', color: '#94a3b8',
                  padding: '4px', display: 'flex', alignItems: 'center',
                  transition: 'color 0.2s ease',
                }}
                onMouseEnter={e => e.currentTarget.style.color = '#6366f1'}
                onMouseLeave={e => e.currentTarget.style.color = '#94a3b8'}
                aria-label={showPass ? 'Hide password' : 'Show password'}
              >
                {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            id="login-submit"
            disabled={loading}
            style={{
              padding: '14px 24px', borderRadius: '14px', fontWeight: 800, fontSize: '15px',
              background: 'linear-gradient(135deg,#6366f1,#4f46e5)',
              color: 'white', border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
              boxShadow: '0 6px 20px rgba(99,102,241,0.35)',
              opacity: loading ? 0.75 : 1,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              transition: 'all 0.22s ease', marginTop: '6px',
            }}
            onMouseEnter={e => {
              if (!loading) {
                e.currentTarget.style.transform = 'translateY(-2px)'
                e.currentTarget.style.boxShadow = '0 10px 28px rgba(99,102,241,0.45)'
              }
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = ''
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(99,102,241,0.35)'
            }}
          >
            {loading ? (
              <>
                <span style={{
                  width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.3)',
                  borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.8s linear infinite'
                }} />
                Signing In...
              </>
            ) : (
              <>
                <LogIn size={18} /> Sign In
              </>
            )}
          </button>
        </form>

        {/* Footer Support Link */}
        <p style={{ textAlign: 'center', fontSize: '13px', color: '#94a3b8', marginTop: '24px' }}>
          Need assistance?{' '}
          <Link to="/contact" style={{ color: '#6366f1', fontWeight: 700, textDecoration: 'none' }}>
            Contact Support
          </Link>
        </p>
      </div>
    </div>
  )
}
