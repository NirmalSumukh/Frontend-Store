import { Routes, Route, Link, useLocation, Navigate } from 'react-router-dom'
import { useAuth } from '@hooks/useAuth'
import Profile from '@components/account/Profile'
import OrderHistory from '@components/account/OrderHistory'
import AddressBook from '@components/account/AddressBook'
import {
  UserIcon,
  ShoppingBagIcon,
  MapPinIcon,
  ArrowRightOnRectangleIcon,
} from '@heroicons/react/24/outline'

const AccountPage = () => {
  const { isAuthenticated, user, logout } = useAuth()
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  const navigation = [
    { name: 'Profile', href: '/account', icon: UserIcon, end: true },
    { name: 'Orders', href: '/account/orders', icon: ShoppingBagIcon },
    { name: 'Addresses', href: '/account/addresses', icon: MapPinIcon },
  ]

  const isActive = (path: string, end?: boolean) => {
    if (end) {
      return location.pathname === path
    }
    return location.pathname.startsWith(path)
  }

  return (
    <div className="container-custom pt-28 pb-12 min-h-screen">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

        {/* Sidebar / Mobile Nav */}
        <div className="lg:col-span-1">
          <div className="card p-0 lg:p-6 sticky top-24 border-none shadow-none lg:border lg:shadow-sm bg-transparent lg:bg-white">

            {/* User Info (Desktop Only) */}
            <div className="hidden lg:block text-center mb-6 pb-6 border-b border-gray-100">
              <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                <UserIcon className="h-10 w-10 text-primary" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900">
                {user?.firstName} {user?.lastName}
              </h2>
              <p className="text-sm text-gray-500">{user?.email}</p>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:block space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${isActive(item.href, item.end)
                      ? 'bg-primary/5 text-primary font-medium'
                      : 'text-gray-600 hover:bg-gray-50'
                    }`}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </Link>
              ))}

              <button
                onClick={logout}
                className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors mt-4"
              >
                <ArrowRightOnRectangleIcon className="h-5 w-5" />
                <span>Logout</span>
              </button>
            </nav>

            {/* ✅ Mobile Navigation (No Scrollbar, No Grey Lines, Orange Active) */}
            <div className="lg:hidden mb-6 -mx-4 px-4 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
              <div className="flex space-x-2">
                {navigation.map((item) => {
                  const active = isActive(item.href, item.end)
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm whitespace-nowrap border transition-all ${active
                          ? 'bg-[#F97316] text-white border-[#F97316] font-medium shadow-md' // Active: Orange + White Text
                          : 'bg-white text-gray-700 border-transparent' // Inactive: No Grey Line (Transparent Border)
                        }`}
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.name}</span>
                    </Link>
                  )
                })}
                <button
                  onClick={logout}
                  className="flex items-center space-x-2 px-4 py-2 rounded-full text-sm whitespace-nowrap border border-transparent bg-red-50 text-red-600"
                >
                  <span>Logout</span>
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <Routes>
            <Route path="/" element={<Profile />} />
            <Route path="/orders/*" element={<OrderHistory />} />
            <Route path="/addresses" element={<AddressBook />} />
          </Routes>
        </div>
      </div>
    </div>
  )
}

export default AccountPage