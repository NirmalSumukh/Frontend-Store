import { useState, useEffect, useMemo } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useCart } from '@/hooks/useCart'
import { useAuth } from '@/hooks/useAuth'
import { useCategories, useProductSearch } from '@/hooks/useSaleor'
import HeaderLayout from './templates/HeaderLayout'
import AuthModal from '@/components/auth/AuthModal'
import { useQuery } from '@apollo/client'
import { GET_ANNOUNCEMENT_BAR } from '@/lib/content-queries'

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')

  const { getTotalItems, toggleCart } = useCart()
  const { isAuthenticated, user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation() // ✅ Get current path
  const { data: categoryData, loading: categoriesLoading } = useCategories()
  const { data: searchData, loading: searchLoading } = useProductSearch(debouncedQuery)

  // ✅ Fetch Announcement Bar Data
  const { data: announcementData } = useQuery(GET_ANNOUNCEMENT_BAR, {
    fetchPolicy: 'cache-first'
  })

  const announcementText = useMemo(() => {
    // Only parse and show announcement if on the homepage
    if (location.pathname !== '/') return null;

    const page = announcementData?.pages?.edges?.[0]?.node
    if (!page?.attributes) return null
    // Matches attributes named 'text', 'announcement', or 'message'
    const attr = page.attributes.find((a: any) =>
      a.attribute.slug.includes('text') || a.attribute.slug.includes('announcement') || a.attribute.slug.includes('message')
    )
    return attr?.values?.[0]?.value || attr?.values?.[0]?.name || null
  }, [announcementData, location.pathname])

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(searchQuery), 500)
    return () => clearTimeout(timer)
  }, [searchQuery])

  const searchResults = useMemo(() => {
    if (!searchData?.products?.edges) return []
    return searchData.products.edges.map((edge: any) => edge.node)
  }, [searchData])

  const totalItems = getTotalItems()
  const isAdmin = user?.isStaff ?? false

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleLogout = () => {
    logout()
    setIsUserMenuOpen(false)
    navigate('/')
  }

  const handleNavigate = (path: string) => {
    setIsUserMenuOpen(false)
    setIsMenuOpen(false)
    navigate(path)
  }

  const handleHoverNav = (name: string) => {
    const item = navItems.find(i => i.name === name)
    if (item?.hasDropdown) setActiveDropdown(name)
  }

  const handleToggleSearch = (isOpen: boolean) => {
    setIsSearchOpen(isOpen)
    if (!isOpen) {
      setSearchQuery('')
      setDebouncedQuery('')
    }
  }

  const navItems = [
    { name: 'Shop', href: '/catalog', hasDropdown: false },
    { name: 'Categories', href: '#', hasDropdown: true },
    { name: 'Deals', href: '/deals', hasDropdown: false },
    { name: 'About', href: '/about', hasDropdown: false },
  ]

  const categories = useMemo(() => {
    return categoryData?.categories?.edges?.map((edge: any) => ({
      name: edge.node.name,
      slug: edge.node.slug,
    })) || []
  }, [categoryData])

  return (
    <>
      <HeaderLayout
        isScrolled={isScrolled}
        isMenuOpen={isMenuOpen}
        isSearchOpen={isSearchOpen}
        isUserMenuOpen={isUserMenuOpen}
        activeDropdown={activeDropdown}
        navItems={navItems}
        categories={categories}
        categoriesLoading={categoriesLoading}
        totalItems={totalItems}
        user={user}
        isAuthenticated={isAuthenticated}
        isAdmin={isAdmin}
        onToggleMenu={() => setIsMenuOpen(!isMenuOpen)}
        onToggleSearch={handleToggleSearch}
        onToggleUserMenu={() => setIsUserMenuOpen(!isUserMenuOpen)}
        onToggleCart={toggleCart}
        onLogout={handleLogout}
        onHoverNav={handleHoverNav}
        onLeaveNav={() => setActiveDropdown(null)}
        onNavigate={handleNavigate}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchResults={searchResults}
        isSearching={searchLoading}
        onOpenLogin={() => setIsAuthModalOpen(true)}
        announcementText={announcementText} // ✅ Pass the text to the Layout
        isHomepage={location.pathname === '/'}
      />

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </>
  )
}

export default Header