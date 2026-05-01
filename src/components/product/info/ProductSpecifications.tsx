interface Spec {
  label: string
  value: string
}

interface ProductSpecificationsProps {
  specifications: Spec[]
}

export default function ProductSpecifications({ specifications }: ProductSpecificationsProps) {
  return (
    <div className="border-t border-gray-200 pt-10 mt-10">
      <h2 className="mb-8 text-2xl lg:text-3xl font-bold text-gray-900">
        Product Specifications
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-8">
        {specifications.length > 0 ? (
          specifications.map((spec, index) => (
            <div
              key={index}
              className="flex flex-col border-b border-gray-100 pb-4"
            >
              {/* ✅ THE FIX: Bold, Uppercase, and Darker Label */}
              <dt className="font-bold text-gray-900 text-xs uppercase tracking-wider mb-2">
                {spec.label}
              </dt>

              {/* The Value: Slightly larger, softer gray for contrast */}
              <dd className="text-gray-700 text-base font-medium">
                {spec.value}
              </dd>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-sm italic">
            No additional specifications for this variant.
          </p>
        )}
      </div>

      {/* Static Footer Info - Styled to match */}
      <div className="mt-16 pt-8 border-t border-gray-200 text-sm text-gray-500 space-y-2">
        <p>For consumer complaints contact us at: <span className="text-gray-900 font-semibold">1800 9848 8892</span></p>
        <p>info@leemasmart.com | Leema Mobiles Private Limited</p>
        <p>2nd Floor, SCO 18, Sector 12A, Gurgaon, Haryana - 122001</p>
      </div>
    </div>
  )
}