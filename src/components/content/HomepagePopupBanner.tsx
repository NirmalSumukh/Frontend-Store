import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useHomepageContent } from '@/hooks/useHomepageContent'
import PopupBannerLayout from './layouts/PopupBannerLayout'

export default function HomepagePopupBanner() {
  const { content, loading } = useHomepageContent()
  const location = useLocation()

  const [shouldShow, setShouldShow] = useState(false)
  const [popupKey, setPopupKey] = useState(0)

  useEffect(() => {
    if (loading || !content.popupBanner) return

    // Rule 1: NEVER show while actively looking at a specific product
    if (location.pathname.includes('/product/')) {
      sessionStorage.setItem('visited_product', 'true')
      setShouldShow(false)
      return
    }

    const popupCount = parseInt(sessionStorage.getItem('popup_count') || '0', 10)

    // Rule 2: Limit to exactly 2 times max per session
    if (popupCount >= 2) return

    let trigger = false

    // Condition C: Show on first visit to the homepage
    if (location.pathname === '/') {
      if (!sessionStorage.getItem('popup_home_triggered')) {
        trigger = true
        sessionStorage.setItem('popup_home_triggered', 'true')
      }
    }

    // Condition A: Specifically visiting a category / catalog page
    if (location.pathname.includes('/catalog')) {
      if (!sessionStorage.getItem('popup_catalog_triggered')) {
        trigger = true
        sessionStorage.setItem('popup_catalog_triggered', 'true')
      }
    }

    // Condition B: Coming back from watching a product (to home or catalog)
    const visitedProduct = sessionStorage.getItem('visited_product') === 'true'
    if (visitedProduct) {
      if (!sessionStorage.getItem('popup_return_triggered')) {
        trigger = true
        sessionStorage.setItem('popup_return_triggered', 'true')
      }
    }

    // ✅ KEY FIX: Only ever SHOW here — never hide via an else-block.
    // React Strict Mode runs effects twice; on the second run the sessionStorage
    // flags already exist so `trigger` stays false. Without an else-block the
    // banner that appeared on the first run stays visible instead of being
    // immediately hidden by the second run.
    if (trigger) {
      setShouldShow(true)
      setPopupKey(prev => prev + 1)
      sessionStorage.setItem('popup_count', (popupCount + 1).toString())
    }

  }, [location.pathname, content.popupBanner, loading])

  if (!shouldShow || !content.popupBanner) {
    return null
  }

  return (
    <PopupBannerLayout
      key={popupKey}
      banner={content.popupBanner}
      onClose={() => setShouldShow(false)}
    />
  )
}