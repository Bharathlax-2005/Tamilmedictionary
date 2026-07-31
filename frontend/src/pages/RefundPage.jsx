import { Award, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function RefundPage() {
  return (
    <div className="pt-16 min-h-screen bg-soft-bg text-slate-700">
      <div className="bg-gradient-hero py-16 border-b border-soft-border">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <span className="badge mb-4 inline-flex items-center gap-1.5 px-3 py-1 bg-primary-100 text-primary-700 font-semibold rounded-full text-xs uppercase tracking-wider">
            <Award size={14} /> Shop Guarantee
          </span>
          <h1 className="text-4xl font-extrabold text-slate-900 mb-3">
            Refund <span className="gradient-text">Policy</span>
          </h1>
          <p className="text-slate-500">Information regarding orders, print publications, and digital downloads.</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-16">
        <div className="soft-card bg-white border border-slate-200 rounded-3xl p-8 sm:p-12 space-y-8 leading-relaxed text-slate-600">
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900">1. Digital Glossaries & Downloads</h2>
            <p>Digital medical glossaries and PDF downloads are delivered immediately upon completion. If you experience technical difficulties accessing your file, please contact us for a replacement download.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900">2. Print Dictionary Books</h2>
            <p>If a print edition arrives damaged or defective, we offer replacement or full refunds within 14 days of receipt. Please inspect your parcel upon arrival in Chennai or via courier delivery.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900">3. Requesting a Refund</h2>
            <p>To request a return or refund, email <strong>Tamilmedictionary@gmail.com</strong> with your order number and issue details.</p>
          </section>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-400">Need help with an order?</span>
            <Link to="/contact" className="btn-primary text-xs py-2 px-4 inline-flex items-center gap-1.5">
              Contact Us <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
