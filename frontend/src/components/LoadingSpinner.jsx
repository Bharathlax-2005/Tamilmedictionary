export default function LoadingSpinner({ size = 'md', text = '' }) {
  const px = { sm: '20px', md: '32px', lg: '48px' }[size]
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px', padding: '48px 0' }}>
      {/* Dual-ring spinner */}
      <div style={{ position: 'relative', width: px, height: px }}>
        <div style={{
          position: 'absolute', inset: 0,
          border: '3px solid rgba(99,102,241,0.12)',
          borderTopColor: '#6366f1',
          borderRadius: '50%',
          animation: 'spin 0.85s linear infinite',
        }} />
        <div style={{
          position: 'absolute', inset: '4px',
          border: '2px solid rgba(59,130,246,0.12)',
          borderTopColor: '#3b82f6',
          borderRadius: '50%',
          animation: 'spin 1.2s linear infinite reverse',
        }} />
      </div>
      {text && (
        <p style={{ fontSize: '13.5px', color: '#9ca3af', fontWeight: 500, animation: 'fadeIn 0.4s ease both' }}>
          {text}
        </p>
      )}
    </div>
  )
}
