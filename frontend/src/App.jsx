import { BrowserRouter, Routes, Route } from 'react-router-dom'
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
import ContactPage from './pages/ContactPage'
import ContributePage from './pages/ContributePage'
import FaqPage from './pages/FaqPage'
import TermsPage from './pages/TermsPage'
import PrivacyPage from './pages/PrivacyPage'
import RefundPage from './pages/RefundPage'
import NotFoundPage from './pages/NotFoundPage'

function PublicLayout({ children }) {
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
      <PublicLayout>
        <PageWrapper>
          <Routes>
            <Route path="/"                 element={<HomePage />} />
            <Route path="/dictionary"       element={<DictionaryPage />} />
            <Route path="/about"            element={<AboutPage />} />
            <Route path="/services"         element={<ServicesPage />} />
            <Route path="/blog"             element={<BlogPage />} />
            <Route path="/blog/:slug"       element={<BlogPostPage />} />
            <Route path="/contact"          element={<ContactPage />} />
            <Route path="/contribute"       element={<ContributePage />} />
            <Route path="/faq"              element={<FaqPage />} />
            <Route path="/terms-conditions" element={<TermsPage />} />
            <Route path="/privacy-policy"   element={<PrivacyPage />} />
            <Route path="/refund-policy"    element={<RefundPage />} />
            <Route path="*"                 element={<NotFoundPage />} />
          </Routes>
        </PageWrapper>
      </PublicLayout>
    </BrowserRouter>
  )
}

export default App
