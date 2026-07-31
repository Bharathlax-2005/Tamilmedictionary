import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Layout from './components/Layout'

import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import TermsPage from './pages/TermsPage'
import BlogPage from './pages/BlogPage'
import ServicesPage from './pages/ServicesPage'
import StatsPage from './pages/StatsPage'
import ContactsPage from './pages/ContactsPage'
import ShopPage from './pages/ShopPage'
import PagesPage from './pages/PagesPage'
import TeamPage from './pages/TeamPage'
import CollectionsManagerPage from './pages/CollectionsManagerPage'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <Layout>
                  <Routes>
                    <Route path="/" element={<DashboardPage />} />
                    <Route path="/terms" element={<TermsPage />} />
                    <Route path="/team" element={<TeamPage />} />
                    <Route path="/blog" element={<BlogPage />} />
                    <Route path="/services" element={<ServicesPage />} />
                    <Route path="/stats" element={<StatsPage />} />
                    <Route path="/contacts" element={<ContactsPage />} />
                    <Route path="/shop" element={<ShopPage />} />
                    <Route path="/pages" element={<PagesPage />} />
                    <Route path="/collections" element={<CollectionsManagerPage />} />
                  </Routes>
                </Layout>
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

