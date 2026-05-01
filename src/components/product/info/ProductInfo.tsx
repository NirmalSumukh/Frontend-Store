
interface ProductInfoProps {
  title: string
  description: string // JSON string or plain text
}

export default function ProductInfo({ title, description }: ProductInfoProps) {
  const renderDescription = () => {
    if (!description) return <p className="text-muted-foreground italic">No description available.</p>

    try {
      const parsed = JSON.parse(description)

      // Handle Editor.js format
      if (parsed.blocks && Array.isArray(parsed.blocks)) {
        return (
          <div className="space-y-6">
            {parsed.blocks.map((block: any, idx: number) => {
              switch (block.type) {
                case 'paragraph':
                  return block.data?.text ? (
                    <p key={idx} className="text-gray-600 leading-7 text-lg">
                      {block.data.text}
                    </p>
                  ) : null

                case 'header':
                  const level = block.data?.level || 3
                  const HeaderTag = `h${level}` as keyof JSX.IntrinsicElements
                  const fontSize = level === 2 ? 'text-2xl' : 'text-xl'

                  return block.data?.text ? (
                    <HeaderTag
                      key={idx}
                      className={`${fontSize} font-bold text-gray-900 mt-8 mb-4`}
                    >
                      {block.data.text}
                    </HeaderTag>
                  ) : null

                case 'list':
                  if (!block.data?.items?.length) return null


                  return (
                    <div key={idx} className="my-6 pl-2">
                      {block.data.items.map((item: string, i: number) => (
                        <div key={i} className="flex items-start gap-3 mb-3">
                          {/* Custom Orange Bullet/Number */}
                          <span className="flex-shrink-0 mt-2 w-2 h-2 rounded-full bg-[#f97316]" />
                          <span
                            className="text-gray-700 leading-relaxed"
                            dangerouslySetInnerHTML={{ __html: item }}
                          />
                        </div>
                      ))}
                    </div>
                  )

                default:
                  return block.data?.text ? (
                    <p key={idx} className="text-gray-600">
                      {block.data.text}
                    </p>
                  ) : null
              }
            })}
          </div>
        )
      }

      return <p className="text-gray-600 leading-relaxed text-lg">{parsed}</p>
    } catch {
      return <p className="text-gray-600 leading-relaxed whitespace-pre-line text-lg">{description}</p>
    }
  }

  return (
    <div className="prose max-w-none">
      {/* Title is handled in layout, but if passed empty, we skip it */}
      {title && (
        <h1 className="mb-6 text-3xl font-bold text-gray-900">
          {title}
        </h1>
      )}
      <div>
        {renderDescription()}
      </div>
    </div>
  )
}