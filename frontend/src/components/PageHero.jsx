/**
 * Reusable animated page hero header used across all pages.
 * Props:
 *   badge     - string: small badge text above heading
 *   badgeIcon - ReactNode: optional icon before badge text
 *   title     - ReactNode: main heading (can include spans)
 *   subtitle  - string: subheading text
 *   children  - ReactNode: optional extra content below subtitle
 */
export default function PageHero({ badge, badgeIcon, title, subtitle, children }) {
  return (
    <div style={{
      background: 'linear-gradient(145deg,#f0f6ff 0%,#e8f0fe 40%,#f5f0ff 100%)',
      borderBottom: '1px solid rgba(99,102,241,0.08)',
      padding: '64px 24px 52px',
      position: 'relative', overflow: 'hidden',
      paddingTop: '80px',
    }}>
      {/* Decorative orbs */}
      <div style={{
        position:'absolute', top:'-50px', right:'-50px', width:'280px', height:'280px',
        borderRadius:'50%', background:'radial-gradient(circle,rgba(99,102,241,0.11) 0%,transparent 70%)',
        filter:'blur(35px)', animation:'floatY 6s ease-in-out infinite', pointerEvents:'none',
      }} />
      <div style={{
        position:'absolute', bottom:'-30px', left:'8%', width:'180px', height:'180px',
        borderRadius:'50%', background:'radial-gradient(circle,rgba(59,130,246,0.09) 0%,transparent 70%)',
        filter:'blur(28px)', animation:'floatY 8s ease-in-out infinite 1.5s', pointerEvents:'none',
      }} />

      {/* Dot particles */}
      {[[5,20,'4s','0s'],[92,15,'3.5s','0.8s'],[12,75,'5s','0.4s'],[88,65,'3.8s','1.6s']].map(([x,y,dur,del],i)=>(
        <div key={i} style={{
          position:'absolute', left:`${x}%`, top:`${y}%`,
          width:'5px', height:'5px', borderRadius:'50%',
          background:'rgba(99,102,241,0.4)',
          animation:`twinkle ${dur} ease-in-out infinite ${del}`,
          pointerEvents:'none',
        }} />
      ))}

      <div style={{ maxWidth:'860px', margin:'0 auto', textAlign:'center', position:'relative', zIndex:1 }}>
        {badge && (
          <div className="animate-fade-in-up" style={{ marginBottom:'14px' }}>
            <span style={{
              display:'inline-flex', alignItems:'center', gap:'6px',
              padding:'5px 16px', borderRadius:'999px', fontSize:'12px', fontWeight:700,
              background:'rgba(99,102,241,0.10)', color:'#4f46e5',
              border:'1.5px solid rgba(99,102,241,0.18)',
            }}>
              {badgeIcon} {badge}
            </span>
          </div>
        )}
        <div className="animate-fade-in-up" style={{ animationDelay:'80ms' }}>
          <h1 style={{ fontSize:'clamp(1.8rem,4vw,2.9rem)', fontWeight:900, color:'#1e1b4b', lineHeight:1.18, marginBottom:'14px' }}>
            {title}
          </h1>
          {subtitle && (
            <p style={{ fontSize:'1.05rem', color:'#6b7280', maxWidth:'600px', margin:'0 auto', lineHeight:1.75 }}>
              {subtitle}
            </p>
          )}
        </div>
        {children && (
          <div className="animate-fade-in-up" style={{ animationDelay:'160ms', marginTop:'24px' }}>
            {children}
          </div>
        )}
      </div>
    </div>
  )
}
