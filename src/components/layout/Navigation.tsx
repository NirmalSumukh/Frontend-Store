import { Link } from 'react-router-dom'
import { useCategories } from '@hooks/useSaleor'
import { ChevronDownIcon } from '@heroicons/react/24/outline'
import { Fragment } from 'react'
import { Menu, Transition } from '@headlessui/react'

interface NavigationProps {
  mobile?: boolean
  onClose?: () => void
}

const Navigation = ({ mobile = false, onClose }: NavigationProps) => {
  const { data, loading } = useCategories()

  const categories = data?.categories?.edges?.map((edge: any) => edge.node) || []

  const mainLinks = [
    { name: 'Home', href: '/' },
    { name: 'Shop', href: '/catalog' },
    { name: 'Blog', href: '/blog' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ]

  if (mobile) {
    return (
      <nav className="flex flex-col space-y-4">
        {mainLinks.map((link) => (
          <Link
            key={link.name}
            to={link.href}
            onClick={onClose}
            className="text-gray-700 hover:text-primary-600 font-medium transition-colors"
          >
            {link.name}
          </Link>
        ))}

        {!loading && categories.length > 0 && (
          <>
            <div className="border-t border-gray-200 my-4" />
            <p className="text-sm font-semibold text-gray-500 uppercase">Categories</p>
            {categories.slice(0, 8).map((category: any) => (
              <Link
                key={category.id}
                to={`/catalog/${category.slug}`}
                onClick={onClose}
                className="text-gray-700 hover:text-primary-600 transition-colors pl-4"
              >
                {category.name}
              </Link>
            ))}
          </>
        )}
      </nav>
    )
  }

  return (
    <nav className="flex items-center justify-center space-x-8">
      {mainLinks.map((link) => (
        <Link
          key={link.name}
          to={link.href}
          className="text-gray-700 hover:text-primary-600 font-medium transition-colors"
        >
          {link.name}
        </Link>
      ))}

      {/* Categories Dropdown */}
      {!loading && categories.length > 0 && (
        <Menu as="div" className="relative">
          <Menu.Button className="flex items-center space-x-1 text-gray-700 hover:text-primary-600 font-medium transition-colors">
            <span>Categories</span>
            <ChevronDownIcon className="h-4 w-4" />
          </Menu.Button>

          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="absolute left-0 mt-2 w-56 origin-top-left bg-white rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none divide-y divide-gray-100">
              <div className="py-1">
                {categories.slice(0, 10).map((category: any) => (
                  <Menu.Item key={category.id}>
                    {({ active }) => (
                      <Link
                        to={`/catalog/${category.slug}`}
                        className={`${
                          active ? 'bg-gray-100 text-primary-600' : 'text-gray-700'
                        } block px-4 py-2 text-sm transition-colors`}
                      >
                        {category.name}
                      </Link>
                    )}
                  </Menu.Item>
                ))}
              </div>
              <div className="py-1">
                <Menu.Item>
                  {({ active }) => (
                    <Link
                      to="/catalog"
                      className={`${
                        active ? 'bg-gray-100 text-primary-600' : 'text-gray-700'
                      } block px-4 py-2 text-sm font-medium transition-colors`}
                    >
                      View All Categories
                    </Link>
                  )}
                </Menu.Item>
              </div>
            </Menu.Items>
          </Transition>
        </Menu>
      )}
    </nav>
  )
}

export default Navigation
