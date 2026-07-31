import { ShieldCheck } from 'lucide-react'

export default function PrivacyPage() {
  return (
    <div className="pt-16 min-h-screen bg-soft-bg text-slate-700">
      <div className="bg-gradient-hero py-16 border-b border-soft-border">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <span className="badge mb-4 inline-flex items-center gap-1.5 px-3 py-1 bg-primary-100 text-primary-700 font-semibold rounded-full text-xs uppercase tracking-wider">
            <ShieldCheck size={14} /> Data Protection
          </span>
          <h1 className="text-4xl font-extrabold text-slate-900 mb-3">
            Privacy <span className="gradient-text">Policy</span>
          </h1>
          <p className="text-slate-500">How we collect, protect, and handle your information at TamilMeDictionary.</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-16">
        <div className="soft-card bg-white border border-slate-200 rounded-3xl p-8 sm:p-12 space-y-8 leading-relaxed text-slate-600">
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900">1. Information Collection</h2>
            <p>We collect information you provide directly to us when contacting us, subscribing, or ordering dictionary publications (e.g. name, email, company, and message details).</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900">2. How We Use Information</h2>
            <p>Your details are used strictly to fulfill dictionary requests, respond to user inquiries, improve search functionality, and deliver updates on new medical terminology releases.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900">3. Data Security</h2>
            <p>We implement strict security measures to keep your personal details protected and never sell your personal information to third parties.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900">4. Contact Privacy Officer</h2>
            <p>If you have questions about privacy, please contact <strong>Tamilmedictionary@gmail.com</strong>.</p>
          </section>
        </div>
      </div>
    </div>
  )
}
