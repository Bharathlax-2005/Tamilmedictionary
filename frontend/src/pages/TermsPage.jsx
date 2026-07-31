import { FileText, ShieldCheck } from 'lucide-react'

export default function TermsPage() {
  return (
    <div className="pt-16 min-h-screen bg-soft-bg text-slate-700">
      <div className="bg-gradient-hero py-16 border-b border-soft-border">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <span className="badge mb-4 inline-flex items-center gap-1.5 px-3 py-1 bg-primary-100 text-primary-700 font-semibold rounded-full text-xs uppercase tracking-wider">
            <FileText size={14} /> Legal
          </span>
          <h1 className="text-4xl font-extrabold text-slate-900 mb-3">
            Terms & <span className="gradient-text">Conditions</span>
          </h1>
          <p className="text-slate-500">Effective Date: January 2024 • TamilMeDictionary</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-16">
        <div className="soft-card bg-white border border-slate-200 rounded-3xl p-8 sm:p-12 space-y-8 leading-relaxed text-slate-600">
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900">1. Acceptance of Terms</h2>
            <p>By accessing or using TamilMeDictionary, you agree to comply with and be bound by these Terms and Conditions. If you do not agree, please refrain from using our services.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900">2. Medical Information Disclaimer</h2>
            <p>The translations, dictionary definitions, and glossaries provided on TamilMeDictionary are intended for educational, linguistic, and informational purposes. They do not constitute official medical advice, diagnosis, or clinical treatment recommendations.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900">3. Intellectual Property Rights</h2>
            <p>All content, including medical term translations, articles, graphics, and glossary collections, are protected by copyright and intellectual property laws of India and international treaties.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900">4. Contact & Inquiries</h2>
            <p>For questions regarding terms of use, contact us at <strong>Tamilmedictionary@gmail.com</strong>.</p>
          </section>
        </div>
      </div>
    </div>
  )
}
