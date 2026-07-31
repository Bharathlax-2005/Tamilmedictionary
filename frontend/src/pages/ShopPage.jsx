import { useState, useEffect } from 'react'
import { listProducts } from '../services/api'
import LoadingSpinner from '../components/LoadingSpinner'
import PageHero from '../components/PageHero'
import useScrollReveal from '../hooks/useScrollReveal'
import { ShoppingBag, Star } from 'lucide-react'

function ProductCard({ product, index }) {
  const isFree = product.price === 0
  const hasDiscount = product.original_price && product.original_price > product.price
  const discountPct = hasDiscount ? Math.round((1 - product.price / product.original_price) * 100) : null

  return (
    <div className="reveal glass-card-light" style={{ overflow: 'hidden', animationDelay: `${index * 60}ms` }}>
      {/* Image */}
      <div style={{
        height: '180px', overflow: 'hidden',
        background: 'linear-gradient(135deg,rgba(99,102,241,0.08),rgba(59,130,246,0.06))',
        position: 'relative',
      }}>
        {product.image_url ? (
          <img src={product.image_url} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.45s ease' }}
            onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.06)'}
            onMouseLeave={e => e.currentTarget.style.transform = ''}
          />
        ) : (
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '56px' }}>📚</div>
        )}
        {hasDiscount && (
          <div style={{
            position: 'absolute', top: '12px', left: '12px',
            background: 'linear-gradient(135deg,#ef4444,#dc2626)', color: 'white',
            fontSize: '11px', fontWeight: 800, padding: '3px 10px', borderRadius: '999px',
            boxShadow: '0 2px 8px rgba(239,68,68,0.35)',
          }}>{discountPct}% OFF</div>
        )}
      </div>

      {/* Info */}
      <div style={{ padding: '20px' }}>
        {product.category && (
          <span style={{
            fontSize: '10px', fontWeight: 700, padding: '3px 10px', borderRadius: '999px',
            background: 'rgba(99,102,241,0.08)', color: '#6366f1',
            border: '1px solid rgba(99,102,241,0.15)', display: 'inline-block', marginBottom: '10px',
          }}>{product.category}</span>
        )}
        <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#1e1b4b', marginBottom: '6px', lineHeight: 1.35 }}>{product.name}</h3>
        <p style={{ fontSize: '12.5px', color: '#9ca3af', lineHeight: 1.65, marginBottom: '16px' }}>{product.description}</p>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
          <div>
            <span style={{ fontSize: '20px', fontWeight: 900, color: '#4f46e5' }}>
              {isFree ? 'Free' : `₹${product.price?.toLocaleString()}`}
            </span>
            {hasDiscount && (
              <span style={{ fontSize: '13px', color: '#9ca3af', textDecoration: 'line-through', marginLeft: '6px' }}>₹{product.original_price}</span>
            )}
          </div>
          <button style={{
            padding: '9px 18px', borderRadius: '12px', fontSize: '13px', fontWeight: 700,
            background: 'linear-gradient(135deg,#6366f1,#4f46e5)', color: 'white',
            border: 'none', cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(99,102,241,0.30)',
            transition: 'all 0.22s ease',
          }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 20px rgba(99,102,241,0.40)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 4px 12px rgba(99,102,241,0.30)'; }}
          >
            {isFree ? 'Download' : 'Buy Now'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function ShopPage() {
  useScrollReveal()
  const [products, setProducts] = useState([])
  const [loading, setLoading]   = useState(true)

  useEffect(() => {
    listProducts().then(r => setProducts(r.data.products || [])).finally(() => setLoading(false))
  }, [])

  return (
    <div style={{ paddingTop: '64px', minHeight: '100vh', background: '#fafbff' }}>
      <PageHero
        badge="Shop"
        badgeIcon={<ShoppingBag size={13} />}
        title={<>Medical <span style={{ background:'linear-gradient(135deg,#6366f1,#3b82f6)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>Resources</span></>}
        subtitle="Books, glossaries, and digital resources for medical professionals"
      />

      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '56px 24px' }}>
        {loading ? (
          <LoadingSpinner size="lg" text="Loading products..." />
        ) : products.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: '24px' }}>
            {products.map((product, i) => <ProductCard key={product.id || i} product={product} index={i} />)}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '80px 0' }} className="reveal-scale">
            <div style={{ fontSize: '64px', marginBottom: '16px' }}>📚</div>
            <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#1e1b4b' }}>Products coming soon</h3>
          </div>
        )}
      </div>
    </div>
  )
}
