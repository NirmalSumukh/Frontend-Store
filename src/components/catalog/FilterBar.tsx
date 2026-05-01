import { useState } from 'react'
import { SlidersHorizontal, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { FilterDropdown } from './FilterDropdown'

interface FilterOption {
  label: string
  value: string
  options: string[]
}

interface FilterBarProps {
  filters: FilterOption[]
  activeFilters: Record<string, string>
  onToggleFilter: (group: string, option: string) => void
  onClearFilters: () => void
  getChoiceNameBySlug: (attributeSlug: string, choiceSlug: string) => string
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      staggerChildren: 0.05,
      staggerDirection: -1,
      when: 'afterChildren',
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, x: -20, scale: 0.95 },
  visible: { opacity: 1, x: 0, scale: 1 },
  exit: { opacity: 0, x: -20, scale: 0.95, transition: { duration: 0.15 } },
}

export default function FilterBar({
  filters,
  activeFilters,
  onToggleFilter,
  onClearFilters,
  getChoiceNameBySlug,
}: FilterBarProps) {
  const [showFilters, setShowFilters] = useState(true)
  const activeCount = Object.values(activeFilters).filter(Boolean).length

  return (
    <div className="flex flex-wrap items-center gap-4">
      {/* ✅ Toggle Icon - Now Leema Orange */}
      <motion.button
        onClick={() => setShowFilters(!showFilters)}
        whileTap={{ scale: 0.95 }}
        className={`p-2.5 rounded-lg transition-colors focus:outline-none 
          ${showFilters
            ? 'bg-orange-50 text-orange-600'
            : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
        aria-label={showFilters ? 'Hide filters' : 'Show filters'}
      >
        <SlidersHorizontal className="w-5 h-5" />
      </motion.button>

      {/* ✅ Filters Area */}
      <AnimatePresence mode="wait">
        {showFilters && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="flex flex-wrap items-center gap-2"
          >
            {filters.map((filter) => (
              <motion.div key={filter.value} variants={itemVariants}>
                <FilterDropdown
                  label={filter.label}
                  options={filter.options}
                  activeOptionSlug={activeFilters[filter.value]}
                  getOptionName={(slug) => getChoiceNameBySlug(filter.value, slug)}
                  onSelectOption={(optionName) =>
                    onToggleFilter(filter.value, optionName)
                  }
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ✅ Clear All - Subtle Text Link */}
      <AnimatePresence>
        {activeCount > 0 && (
          <motion.button
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            onClick={onClearFilters}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors ml-auto sm:ml-0"
          >
            <X className="w-3 h-3" />
            CLEAR ALL
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  )
}