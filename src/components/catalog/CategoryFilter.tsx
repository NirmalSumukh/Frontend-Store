import { Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { XMarkIcon, FunnelIcon } from '@heroicons/react/24/outline'
import { useCategories } from '@hooks/useSaleor'

interface CategoryFilterProps {
  isOpen: boolean
  onClose: () => void
  selectedCategory?: string
  onCategoryChange: (categorySlug: string) => void
  priceRange?: { min: number; max: number }
  onPriceChange?: (range: { min: number; max: number }) => void
}

const CategoryFilter = ({
  isOpen,
  onClose,
  selectedCategory,
  onCategoryChange,
}: CategoryFilterProps) => {
  const { data, loading } = useCategories()
  const categories = data?.categories?.edges?.map((edge: any) => edge.node) || []

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-in-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in-out duration-300"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          {/* MODIFICATION: Changed overlay */}
          <div className="fixed inset-0 bg-black/50 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 left-0 flex max-w-full pr-10">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-300"
                enterFrom="-translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-300"
                leaveFrom="translate-x-0"
                leaveTo="-translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                  {/* This is already bg-white, so it's fine */}
                  <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
                    {/* Header */}
                    <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
                      <Dialog.Title className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                        <FunnelIcon className="h-5 w-5" />
                        <span>Filters</span>
                      </Dialog.Title>
                      <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-500 transition-colors"
                        aria-label="Close filters"
                      >
                        <XMarkIcon className="h-6 w-6" />
                      </button>
                    </div>

                    {/* Filter Content */}
                    <div className="flex-1 px-6 py-6 space-y-6">
                      {/* Categories */}
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-4">Categories</h3>
                        {loading ? (
                          <div className="space-y-2">
                            {[...Array(5)].map((_, i) => (
                              // MODIFICATION: Use 'muted' color
                              <div key={i} className="h-8 bg-muted rounded animate-pulse" />
                            ))}
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <button
                              onClick={() => {
                                onCategoryChange('')
                                onClose()
                              }}
                              className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                                !selectedCategory
                                  ? 'bg-primary-50 text-primary-700 font-medium'
                                  : 'hover:bg-accent' // MODIFICATION: use 'accent'
                              }`}
                            >
                              All Categories
                            </button>
                            {categories.map((category: any) => (
                              <button
                                key={category.id}
                                onClick={() => {
                                  onCategoryChange(category.slug)
                                  onClose()
                                }}
                                className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                                  selectedCategory === category.slug
                                    ? 'bg-primary-50 text-primary-700 font-medium'
                                    : 'hover:bg-accent' // MODIFICATION: use 'accent'
                                }`}
                              >
                                {category.name}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="border-t border-gray-200 px-6 py-4">
                      <button
                        onClick={onClose}
                        className="w-full btn-primary"
                      >
                        Apply Filters
                      </button>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}

export default CategoryFilter