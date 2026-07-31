export default function StatCard({ stat, index }) {
  return (
    <div
      className="reveal glass-card-light"
      style={{ padding: '32px', textAlign: 'center', animationDelay: `${index * 80}ms` }}
    >
      <div style={{
        fontSize: '36px', marginBottom: '12px', lineHeight: 1,
        transition: 'transform 0.3s ease',
        display: 'inline-block',
      }}
        onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.2) rotate(-8deg)'}
        onMouseLeave={e => e.currentTarget.style.transform = ''}
      >
        {stat.icon}
      </div>
      <div style={{
        fontSize: 'clamp(1.8rem,3vw,2.5rem)', fontWeight: 900, lineHeight: 1, marginBottom: '6px',
        background: 'linear-gradient(135deg,#6366f1,#3b82f6)',
        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
      }}>
        {stat.value}
      </div>
      <p style={{ fontSize: '13px', color: '#9ca3af', fontWeight: 600 }}>{stat.label}</p>
    </div>
  )
}
