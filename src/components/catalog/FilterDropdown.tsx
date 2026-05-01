import { ChevronDown } from 'lucide-react'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface FilterDropdownProps {
  label: string
  options: string[]
  activeOptionSlug: string | undefined
  getOptionName: (slug: string) => string
  onSelectOption: (optionName: string) => void
}

export function FilterDropdown({
  label,
  options,
  activeOptionSlug,
  getOptionName,
  onSelectOption,
}: FilterDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)

  const activeOptionName = activeOptionSlug ? getOptionName(activeOptionSlug) : undefined
  const displayLabel = activeOptionName || label
  const isActive = !!activeOptionName

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`
          inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200
          ${isActive
            ? 'bg-gray-900 text-white shadow-md shadow-gray-900/10' // Active: Tech Black
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900' // Inactive: Soft Grey
          }
        `}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className="truncate max-w-[150px]">{displayLabel}</span>
        <ChevronDown
          className={`w-3.5 h-3.5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''} ${isActive ? 'text-gray-400' : 'text-gray-400'}`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setIsOpen(false)}
              aria-hidden="true"
            />

            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.96 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              className="absolute left-0 mt-2 w-56 bg-white rounded-xl shadow-xl ring-1 ring-black/5 py-1 z-20 max-h-64 overflow-y-auto"
              role="listbox"
            >
              {/* Tiny Leema Orange Accent Line on Dropdown */}
              <div className="absolute top-0 left-4 right-4 h-0.5 bg-orange-500/20 rounded-full"></div>

              <button
                type="button"
                onClick={() => {
                  onSelectOption('')
                  setIsOpen(false)
                }}
                className={`
                  w-full text-left px-4 py-2.5 text-sm transition-colors mt-1
                  ${!activeOptionName ? 'text-orange-600 font-bold bg-orange-50' : 'text-gray-600 hover:bg-gray-50'}
                `}
                role="option"
                aria-selected={!activeOptionName}
              >
                All {label}
              </button>

              {options.map((option) => {
                const isSelected = activeOptionName === option

                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => {
                      onSelectOption(option)
                      setIsOpen(false)
                    }}
                    className={`
                      w-full text-left px-4 py-2.5 text-sm transition-colors border-l-2
                      ${isSelected
                        ? 'border-orange-500 bg-gray-50 text-gray-900 font-semibold'
                        : 'border-transparent text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }
                    `}
                    role="option"
                    aria-selected={isSelected}
                  >
                    {option}
                  </button>
                )
              })}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}