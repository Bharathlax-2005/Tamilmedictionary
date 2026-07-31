import { useState } from 'react'
import { HelpCircle, ChevronDown, Mail } from 'lucide-react'
import { Link } from 'react-router-dom'
import PageHero from '../components/PageHero'
import useScrollReveal from '../hooks/useScrollReveal'

const FAQS = [
  {
    q: "What is TamilMeDictionary?",
    a: "TamilMeDictionary is the world's first comprehensive English-to-Tamil medical dictionary and glossary resource designed for healthcare professionals, students, translators, and researchers."
  },
  {
    q: "How are medical translations validated?",
    a: "All medical terms and definitions undergo clinical verification by medical doctors, certified translators, and lexicography experts to ensure accuracy and cultural consistency."
  },
  {
    q: "Can I contribute new medical terms to the dictionary?",
    a: "Yes! We welcome contributions from healthcare workers and language experts. You can submit suggestions via our Contribute page."
  },
  {
    q: "Do you offer digital PDF glossaries or print editions?",
    a: "Yes, we offer both digital PDF collections (such as the Medical Glossary by Prof. Dr. Semmal Mustafa) and print editions through our Shop page."
  },
  {
    q: "How can I contact TamilMeDictionary for institutional partnerships?",
    a: "You can email us directly at Tamilmedictionary@gmail.com or fill out the contact form on our About or Contact page."
  }
]

export default function FaqPage() {
  useScrollReveal()
  const [openIdx, setOpenIdx] = useState(0)

  return (
    <div style={{ paddingTop: '64px', minHeight: '100vh', background: '#fafbff' }}>
      <PageHero
        badge="Knowledge Base"
        badgeIcon={<HelpCircle size={13} />}
        title={<>Frequently Asked <span style={{ background:'linear-gradient(135deg,#6366f1,#3b82f6)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>Questions</span></>}
        subtitle="Find answers to common questions about TamilMeDictionary and our medical terminology platform."
      />

      <div style={{ maxWidth:'760px', margin:'0 auto', padding:'56px 24px' }}>
        <div style={{ display:'flex', flexDirection:'column', gap:'12px' }}>
          {FAQS.map((faq, i) => {
            const isOpen = openIdx === i
            return (
              <div key={i} className="reveal" style={{ animationDelay:`${i*60}ms` }}>
                <div style={{
                  background: 'white', borderRadius:'18px', overflow:'hidden',
                  border: isOpen ? '1.5px solid rgba(99,102,241,0.25)' : '1.5px solid rgba(99,102,241,0.08)',
                  boxShadow: isOpen ? '0 8px 32px rgba(99,102,241,0.10)' : '0 2px 8px rgba(0,0,0,0.04)',
                  transition:'all 0.3s ease',
                }}>
                  <button
                    onClick={() => setOpenIdx(isOpen ? -1 : i)}
                    style={{
                      width:'100%', padding:'20px 24px', textAlign:'left',
                      display:'flex', alignItems:'center', justifyContent:'space-between', gap:'12px',
                      background:'transparent', border:'none', cursor:'pointer',
                    }}
                  >
                    <span style={{ fontSize:'15px', fontWeight:700, color: isOpen ? '#4f46e5' : '#1e1b4b', transition:'color 0.2s' }}>
                      {faq.q}
                    </span>
                    <div style={{
                      width:'30px', height:'30px', borderRadius:'8px', flexShrink:0,
                      display:'flex', alignItems:'center', justifyContent:'center',
                      background: isOpen ? 'rgba(99,102,241,0.10)' : '#f8faff',
                      transition:'all 0.3s ease',
                    }}>
                      <ChevronDown size={16} color={isOpen ? '#6366f1' : '#9ca3af'} style={{
                        transform: isOpen ? 'rotate(180deg)' : 'none',
                        transition:'transform 0.3s cubic-bezier(.2,.9,.2,1)',
                      }} />
                    </div>
                  </button>
                  <div style={{
                    maxHeight: isOpen ? '300px' : '0',
                    overflow:'hidden',
                    transition:'max-height 0.4s cubic-bezier(.2,.9,.2,1)',
                  }}>
                    <div style={{
                      padding:'0 24px 20px',
                      borderTop:'1px solid rgba(99,102,241,0.08)',
                    }}>
                      <p style={{ fontSize:'14px', color:'#6b7280', lineHeight:1.8, marginTop:'16px' }}>{faq.a}</p>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* CTA */}
        <div style={{ textAlign:'center', marginTop:'48px', padding:'36px', background:'linear-gradient(135deg,rgba(99,102,241,0.06),rgba(59,130,246,0.04))', borderRadius:'20px', border:'1.5px solid rgba(99,102,241,0.10)' }} className="reveal">
          <div style={{ fontSize:'40px', marginBottom:'12px' }}>💬</div>
          <p style={{ fontSize:'16px', fontWeight:700, color:'#1e1b4b', marginBottom:'6px' }}>Still have questions?</p>
          <p style={{ fontSize:'14px', color:'#9ca3af', marginBottom:'20px' }}>Our team is here to help you.</p>
          <Link to="/contact" style={{
            display:'inline-flex', alignItems:'center', gap:'8px',
            padding:'12px 28px', borderRadius:'14px', fontWeight:700, fontSize:'14px',
            background:'linear-gradient(135deg,#6366f1,#4f46e5)', color:'white',
            textDecoration:'none', boxShadow:'0 4px 14px rgba(99,102,241,0.30)',
            transition:'all 0.22s ease',
          }}
            onMouseEnter={e => { e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.boxShadow='0 8px 24px rgba(99,102,241,0.40)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform=''; e.currentTarget.style.boxShadow='0 4px 14px rgba(99,102,241,0.30)'; }}
          >
            <Mail size={15} /> Contact Support
          </Link>
        </div>
      </div>
    </div>
  )
}
