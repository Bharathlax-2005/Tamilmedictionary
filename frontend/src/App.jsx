import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import PageWrapper from './components/PageWrapper'

// Public pages
import HomePage from './pages/HomePage'
import DictionaryPage from './pages/DictionaryPage'
import AboutPage from './pages/AboutPage'
import ServicesPage from './pages/ServicesPage'
import BlogPage from './pages/BlogPage'
import BlogPostPage from './pages/BlogPostPage'
import ContributePage from './pages/ContributePage'
import ShopPage from './pages/ShopPage'
import ContactPage from './pages/ContactPage'
import FaqPage from './pages/FaqPage'
import TermsPage from './pages/TermsPage'
import PrivacyPage from './pages/PrivacyPage'
import RefundPage from './pages/RefundPage'
import LoginPage from './pages/LoginPage'
import CollectionsPage from './pages/CollectionsPage'
import NotFoundPage from './pages/NotFoundPage'

// Admin — imported from admin/src via @admin alias (admin folder stays untouched)
import { AuthProvider } from '@admin/context/AuthContext'
import ProtectedRoute from '@admin/components/ProtectedRoute'
import AdminLayout from '@admin/components/Layout'
import DashboardPage from '@admin/pages/DashboardPage'
import AdminTermsPage from '@admin/pages/TermsPage'
import AdminTeamPage from '@admin/pages/TeamPage'
import AdminBlogPage from '@admin/pages/BlogPage'
import AdminServicesPage from '@admin/pages/ServicesPage'
import AdminStatsPage from '@admin/pages/StatsPage'
import AdminContactsPage from '@admin/pages/ContactsPage'
import AdminShopPage from '@admin/pages/ShopPage'
import AdminPagesPage from '@admin/pages/PagesPage'
import CollectionsManagerPage from '@admin/pages/CollectionsManagerPage'

// Wrapper that hides Navbar/Footer on /admin routes
function PublicLayout({ children }) {
  const location = useLocation()
  const isAdmin = location.pathname.startsWith('/admin')
  if (isAdmin) return <>{children}</>
  return (
    <div className="min-h-screen flex flex-col bg-soft-bg">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <PublicLayout>
          <PageWrapper>
          <Routes>
            {/* ── Public routes ── */}
            <Route path="/"                 element={<HomePage />} />
            <Route path="/dictionary"       element={<DictionaryPage />} />
            <Route path="/about"            element={<AboutPage />} />
            <Route path="/services"         element={<ServicesPage />} />
            <Route path="/blog"             element={<BlogPage />} />
            <Route path="/blog/:slug"       element={<BlogPostPage />} />
            <Route path="/contribute"       element={<ContributePage />} />
            <Route path="/shop"             element={<ShopPage />} />
            <Route path="/contact"          element={<ContactPage />} />
            <Route path="/login"            element={<LoginPage />} />
            <Route path="/faq"              element={<FaqPage />} />
            <Route path="/terms-conditions" element={<TermsPage />} />
            <Route path="/privacy-policy"   element={<PrivacyPage />} />
            <Route path="/refund-policy"    element={<RefundPage />} />
            <Route path="/collections" element={<CollectionsPage />} />

            {/* ── Admin routes (protected, no Navbar/Footer) ── */}
            <Route
              path="/admin/*"
              element={
                <ProtectedRoute>
                  <AdminLayout>
                    <Routes>
                      <Route index              element={<DashboardPage />} />
                      <Route path="terms"       element={<AdminTermsPage />} />
                      <Route path="team"        element={<AdminTeamPage />} />
                      <Route path="blog"        element={<AdminBlogPage />} />
                      <Route path="services"    element={<AdminServicesPage />} />
                      <Route path="stats"       element={<AdminStatsPage />} />
                      <Route path="contacts"    element={<AdminContactsPage />} />
                      <Route path="shop"        element={<AdminShopPage />} />
                      <Route path="pages"       element={<AdminPagesPage />} />
                      <Route path="collections" element={<CollectionsManagerPage />} />
                    </Routes>
                  </AdminLayout>
                </ProtectedRoute>
              }
            />

            <Route path="*" element={<NotFoundPage />} />
          </Routes>
          </PageWrapper>
        </PublicLayout>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
