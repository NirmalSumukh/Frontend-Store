import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ShoppingCart,
  Heart,
  User,
  Search,
  Menu,
  X,
  ChevronDown,
  LogOut,
  Settings,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import CartDrawer from '@/components/cart/CartDrawer'
import SearchResults from '@/components/layout/SearchResults'
import LeemaLogo from '@/assets/Leema Logo.png'

interface NavItem {
  name: string
  href: string
  hasDropdown: boolean
}

interface Category {
  name: string
  slug: string
}

interface HeaderLayoutProps {
  // State
  isScrolled: boolean
  isMenuOpen: boolean
  isSearchOpen: boolean
  isUserMenuOpen: boolean
  activeDropdown: string | null

  // Data
  navItems: NavItem[]
  categories: Category[]
  categoriesLoading?: boolean
  totalItems: number
  user: any
  isAuthenticated: boolean
  isAdmin: boolean

  // Search Props
  searchQuery?: string
  onSearchChange?: (query: string) => void
  searchResults?: any[]
  isSearching?: boolean

  // Handlers
  onToggleMenu: () => void
  onToggleSearch: (isOpen: boolean) => void
  onToggleUserMenu: () => void
  onToggleCart: () => void
  onLogout: () => void
  onHoverNav: (name: string) => void
  onLeaveNav: () => void
  onNavigate: (path: string) => void

  // ✅ NEW: Handler to open the Auth Modal
  onOpenLogin: () => void
  
  // ✅ NEW PROP
  announcementText?: string | null
  isHomepage?: boolean
}

export default function HeaderLayout({
  isMenuOpen,
  isSearchOpen,
  isUserMenuOpen,
  activeDropdown,
  navItems,
  categories,
  categoriesLoading,
  totalItems,
  user,
  isAuthenticated,
  isAdmin,
  // Search Props
  searchQuery = '',
  onSearchChange,
  searchResults = [],
  isSearching = false,

  onToggleMenu,
  onToggleSearch,
  onToggleUserMenu,
  onToggleCart,
  onLogout,
  onHoverNav,
  onLeaveNav,
  onNavigate,

  // ✅ Destructure new prop
  onOpenLogin,
  announcementText, // ✅ Destructure
  isHomepage,
}: HeaderLayoutProps) {
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null)

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.3 }}
        className={cn(
          isHomepage ? 'sticky top-0 z-50 w-full' : 'fixed top-0 left-0 right-0 z-50',
          'transition-all duration-300 bg-white border-b border-gray-200 shadow-sm'
        )}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">

            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2 group">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center space-x-2"
              >
                <img src={LeemaLogo} alt="Leema Logo" className="h-12 md:h-14 object-contain" />
              </motion.div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
              {navItems.map((item) => (
                <div
                  key={item.name}
                  className="relative"
                  onMouseEnter={() => onHoverNav(item.name)}
                  onMouseLeave={onLeaveNav}
                >
                  <Link
                    to={item.href}
                    className={cn(
                      'px-3 lg:px-4 py-2 text-sm lg:text-base transition-all duration-200 relative',
                      'font-bold',
                      'text-[#222222] hover:text-[#222222]',
                      'flex items-center gap-1',
                      'after:content-[""] after:absolute after:bottom-1 after:left-3 after:right-3 after:h-0.5 after:bg-[#FF6B35] after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-200'
                    )}
                  >
                    {item.name}
                    {item.hasDropdown && (
                      <ChevronDown className="w-4 h-4 transition-transform duration-200" />
                    )}
                  </Link>

                  <AnimatePresence>
                    {activeDropdown === item.name && item.hasDropdown && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full left-0 mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden"
                      >
                        {categoriesLoading && (
                          <span className="block px-4 py-3 text-sm text-muted-foreground opacity-50">
                            Loading...
                          </span>
                        )}

                        {!categoriesLoading && categories.map((category) => (
                          <Link
                            key={category.slug}
                            to={`/catalog?category=${category.slug}`}
                            className="block px-4 py-3 text-sm font-medium text-[#222222] hover:bg-gray-50 hover:text-[#FF6B35] transition-colors duration-200"
                          >
                            {category.name}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </nav>

            {/* Right Icons */}
            <div className="flex items-center space-x-2 lg:space-x-4">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => onToggleSearch(true)}
                className="p-2 text-[#222222] hover:text-[#FF6B35] transition-all duration-200"
              >
                <Search className="w-5 h-5 stroke-[1.5]" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => onNavigate('/account/wishlist')}
                className="hidden sm:block p-2 text-[#222222] hover:text-[#FF6B35] transition-all duration-200"
              >
                <Heart className="w-5 h-5 stroke-[1.5]" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onToggleCart}
                className="relative p-2 text-[#222222] hover:text-[#FF6B35] transition-all duration-200"
              >
                <ShoppingCart className="w-5 h-5 stroke-[1.5]" />
                {totalItems > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 bg-[#FF6B35] text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-sm"
                  >
                    {totalItems}
                  </motion.span>
                )}
              </motion.button>

              {isAuthenticated ? (
                <div className="relative">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={onToggleUserMenu}
                    className="p-2 text-[#222222] hover:text-[#FF6B35] transition-all duration-200"
                  >
                    <User className="w-5 h-5 stroke-[1.5]" />
                  </motion.button>

                  <AnimatePresence>
                    {isUserMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden"
                      >
                        <div className="px-4 py-3 border-b border-gray-200">
                          <p className="text-sm font-medium text-[#222222]">
                            {user?.firstName} {user?.lastName}
                          </p>
                          <p className="text-xs text-gray-500 truncate">
                            {user?.email}
                          </p>
                        </div>

                        <div className="py-2">
                          <Link
                            to="/account"
                            onClick={onToggleUserMenu}
                            className="flex items-center gap-3 px-4 py-2 text-sm text-[#222222] hover:bg-gray-50 hover:text-[#FF6B35] transition-colors duration-200"
                          >
                            <User className="w-4 h-4" />
                            My Account
                          </Link>

                          {isAdmin && (
                            <Link
                              to="/admin/dashboard"
                              onClick={onToggleUserMenu}
                              className="flex items-center gap-3 px-4 py-2 text-sm text-[#222222] hover:bg-gray-50 hover:text-[#FF6B35] transition-colors duration-200"
                            >
                              <Settings className="w-4 h-4" />
                              Admin Dashboard
                            </Link>
                          )}

                          <button
                            onClick={onLogout}
                            className="w-full flex items-center gap-3 px-4 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors duration-200"
                          >
                            <LogOut className="w-4 h-4" />
                            Logout
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Button
                  variant="default"
                  size="sm"
                  // ✅ CHANGED: Opens modal instead of navigating to /login
                  onClick={onOpenLogin}
                  className="hidden sm:inline-flex font-bold hover:scale-105 transition-transform bg-[#FF6B35] hover:bg-[#FF5722] text-white px-6 min-w-[90px]"
                >
                  Login
                </Button>
              )}

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onToggleMenu}
                className="md:hidden p-2 text-[#222222] hover:text-[#FF6B35] transition-all duration-200"
              >
                {isMenuOpen ? (
                  <X className="w-6 h-6 stroke-[1.5]" />
                ) : (
                  <Menu className="w-6 h-6 stroke-[1.5]" />
                )}
              </motion.button>
            </div>
          </div>
        </div>

        {announcementText && (
          <div className="w-full bg-white border-t border-gray-100 py-1.5 sm:py-2 text-center shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
            <p className="text-[#FF6B35] font-bold text-xs sm:text-sm uppercase tracking-wider">
              {announcementText}
            </p>
          </div>
        )}

        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden absolute w-full bg-white border-b border-gray-200 shadow-lg top-full left-0"
            >
              <nav className="container mx-auto px-4 py-4 space-y-2">
                {/* ✅ Mobile Only Home Button */}
                <Link
                  to="/"
                  onClick={onToggleMenu}
                  className="block px-4 py-3 rounded-lg font-bold text-[#222222] hover:text-[#FF6B35] hover:bg-gray-50 transition-all duration-200"
                >
                  Home
                </Link>
                {navItems.map((item) => (
                  <div key={item.name}>
                    {item.hasDropdown ? (
                      <button
                        onClick={() => setMobileExpanded(mobileExpanded === item.name ? null : item.name)}
                        className="w-full flex items-center justify-between px-4 py-3 rounded-lg font-bold text-[#222222] hover:text-[#FF6B35] hover:bg-gray-50 transition-all duration-200"
                      >
                        {item.name}
                        <ChevronDown
                          className={cn(
                            "w-5 h-5 transition-transform duration-200",
                            mobileExpanded === item.name && "rotate-180"
                          )}
                        />
                      </button>
                    ) : (
                      <Link
                        to={item.href}
                        onClick={onToggleMenu}
                        className="block px-4 py-3 rounded-lg font-bold text-[#222222] hover:text-[#FF6B35] hover:bg-gray-50 transition-all duration-200"
                      >
                        {item.name}
                      </Link>
                    )}
                    
                    {/* Render dropdown items if expanded */}
                    <AnimatePresence>
                      {item.hasDropdown && mobileExpanded === item.name && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="overflow-hidden bg-gray-50/50 rounded-lg mx-2"
                        >
                          {categoriesLoading && (
                            <span className="block px-4 py-3 text-sm text-muted-foreground opacity-50">
                              Loading...
                            </span>
                          )}
                          {!categoriesLoading && categories.map((category) => (
                            <Link
                              key={category.slug}
                              to={`/catalog?category=${category.slug}`}
                              onClick={onToggleMenu}
                              className="block px-6 py-3 text-sm font-medium text-[#222222] hover:text-[#FF6B35] transition-colors duration-200"
                            >
                              {category.name}
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
                {!isAuthenticated && (
                  <button
                    // ✅ CHANGED: Mobile Link converted to button to trigger modal
                    onClick={() => {
                      onToggleMenu()
                      onOpenLogin()
                    }}
                    className="block w-full text-left px-4 py-3 rounded-lg font-bold text-white bg-[#FF6B35] hover:bg-[#FF5722] transition-all duration-200"
                  >
                    Login
                  </button>
                )}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Search Modal Integration */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => onToggleSearch(false)}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 overflow-y-auto"
          >
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              onClick={(e) => e.stopPropagation()}
              className="relative top-4 sm:top-10 mx-auto max-w-5xl px-4 mb-10"
            >
              <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200">
                {/* Search Header */}
                <div className="relative p-4 border-b border-gray-200">
                  <Search className="absolute left-7 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => onSearchChange?.(e.target.value)}
                    placeholder="Search products..."
                    className="w-full pl-12 pr-12 py-3 rounded-xl bg-gray-50 border border-transparent focus:bg-white focus:border-[#FF6B35] text-[#222222] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/20 transition-all font-medium"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === 'Escape') onToggleSearch(false)
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => onToggleSearch(false)}
                    className="absolute right-7 top-1/2 -translate-y-1/2 text-gray-400 hover:text-destructive transition-colors"
                    aria-label="Close search"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Results Display */}
                {searchQuery && searchQuery.length >= 2 && (
                  <div className="bg-white">
                    <SearchResults
                      results={searchResults || []}
                      loading={isSearching || false}
                      onResultClick={() => onToggleSearch(false)}
                    />
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <CartDrawer />
    </>
  )
}