// src/App.tsx
import { Routes, Route, Navigate } from 'react-router-dom'
import { useEffect } from 'react'
import Header from '@/components/layout/Header'
import HomePage from '@/pages/index'
import ErrorBoundary from '@/components/error/ErrorBoundary'
import { useUserChannel } from '@/hooks/useUserChannel'
import { useCartValidation } from '@/hooks/useCartValidation'

// --- Page Imports ---
import CatalogPage from '@/pages/catalog'
import ProductPage from '@/pages/product'
import CartPage from '@/pages/cart'
import AccountPage from '@/pages/account'
import AccountConfirmPage from '@/pages/account-confirm'
import GeometricBackground from '@/components/layout/GeometricBackground'
import DealsPage from '@/pages/deals'

// --- Static CMS Pages Imports ---
import FAQPage from '@/pages/faq'
import ContactPage from '@/pages/contact'
import WarrantyGuidelinesPage from '@/pages/warranty-guidelines'
import WarrantyFormPage from '@/pages/warranty-form'
import AboutPage from '@/pages/about'
import EWasteManagementPage from '@/pages/e-waste-management'
import CsrPolicyPage from '@/pages/csr-policy'
import ShippingAndDeliveryPage from '@/pages/shipping-and-delivery'
import ReturnReplacementPage from '@/pages/return-replacement'
import TermsConditionsPage from '@/pages/terms-conditions'
import PrivacyPolicyPage from '@/pages/privacy-policy'
import HomepagePopupBanner from '@/components/content/HomepagePopupBanner'

function App() {
  useUserChannel()
  useCartValidation()

  useEffect(() => {
    // ✅ Smooth scrolling
    document.documentElement.style.scrollBehavior = 'smooth'

    return () => {
      document.documentElement.style.scrollBehavior = 'auto'
    }
  }, [])

  return (
    <ErrorBoundary>
      <div className="w-full min-h-screen bg-background text-foreground">
        <GeometricBackground />
        <Header />
        <main className="flex-1 w-full">
          <Routes>
            {/* ✅ Public Routes */}
            <Route path="/" element={<HomePage />} />

            {/* ✅ E-Commerce Routes */}
            <Route path="/catalog" element={<CatalogPage />} />
            <Route path="/product/:slug" element={<ProductPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/deals" element={<DealsPage />} />
            <Route path="/account/*" element={<AccountPage />} />
            <Route path="/account-confirm" element={<AccountConfirmPage />} />

            {/* ✅ Static CMS Routes */}
            <Route path="/faq" element={<FAQPage />} />
            <Route path="/contact-us" element={<ContactPage />} />
            <Route path="/about-us" element={<AboutPage />} />
            <Route path="/warranty-guidelines" element={<WarrantyGuidelinesPage />} />
            <Route path="/warranty-form" element={<WarrantyFormPage />} />
            <Route path="/e-waste-management" element={<EWasteManagementPage />} />
            <Route path="/csr-policy" element={<CsrPolicyPage />} />
            <Route path="/shipping-and-delivery" element={<ShippingAndDeliveryPage />} />
            <Route path="/return-replacement" element={<ReturnReplacementPage />} />
            <Route path="/terms-conditions" element={<TermsConditionsPage />} />
            <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />

            {/* ✅ Catch-all - redirect to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <HomepagePopupBanner />
        </main>
      </div>
    </ErrorBoundary>
  )
}

export default App