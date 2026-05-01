import { useQuery, gql } from '@apollo/client'
import { Link } from 'react-router-dom'
import { format } from 'date-fns'
import { ShoppingBagIcon } from '@heroicons/react/24/outline'

// ✅ FIXED QUERY: Removed 'sortBy' argument
const GET_CUSTOMER_ORDERS = gql`
  query CustomerOrders {
    me {
      orders(first: 20) {
        edges {
          node {
            id
            number
            created
            status
            total {
              gross {
                amount
                currency
              }
            }
            lines {
              id
              productName
              thumbnail {
                url
              }
              quantity
            }
          }
        }
      }
    }
  }
`

const OrderHistory = () => {
  const { data, loading, error } = useQuery(GET_CUSTOMER_ORDERS, {
    fetchPolicy: 'cache-and-network' // Ensures data stays fresh
  })

  if (loading && !data) return (
    <div className="space-y-4">
      {[1, 2, 3].map(i => <div key={i} className="h-32 bg-gray-100 rounded-lg animate-pulse" />)}
    </div>
  )

  if (error) {
    console.error("Order fetch error:", error)
    return <div className="text-red-500">Failed to load orders.</div>
  }

  // ✅ Client-side sorting (Newest first)
  const orders = data?.me?.orders?.edges
    .map((edge: any) => edge.node)
    .sort((a: any, b: any) => new Date(b.created).getTime() - new Date(a.created).getTime()) || []

  if (orders.length === 0) {
    return (
      <div className="card py-16 text-center bg-white border-dashed border-2 border-gray-200">
        <div className="h-16 w-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <ShoppingBagIcon className="h-8 w-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No orders yet</h3>
        <p className="text-gray-500 mb-6">Looks like you haven't made any purchases.</p>
        <Link to="/catalog" className="btn-primary inline-block">
          Start Shopping
        </Link>
      </div>
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'FULFILLED': return 'bg-green-100 text-green-800'
      case 'UNFULFILLED': return 'bg-yellow-100 text-yellow-800'
      case 'CANCELED': return 'bg-red-100 text-red-800'
      case 'PARTIALLY_FULFILLED': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Order History</h2>

      <div className="space-y-4">
        {orders.map((order: any) => (
          <div key={order.id} className="card bg-white p-0 overflow-hidden border border-gray-100 hover:shadow-md transition-shadow">

            {/* Header */}
            <div className="p-4 bg-gray-50/50 border-b border-gray-100 flex flex-wrap justify-between items-center gap-4">
              <div className="flex gap-4">
                <div>
                  <p className="text-xs text-gray-500 uppercase font-medium">Order Placed</p>
                  <p className="text-sm font-medium text-gray-900">
                    {format(new Date(order.created), 'MMM dd, yyyy')}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase font-medium">Total</p>
                  <p className="text-sm font-medium text-gray-900">
                    {order.total.gross.currency} {order.total.gross.amount.toFixed(2)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium uppercase tracking-wide ${getStatusColor(order.status)}`}>
                  {order.status.replace(/_/g, ' ')}
                </span>
                <p className="text-sm text-gray-500">#{order.number}</p>
              </div>
            </div>

            {/* Items */}
            <div className="p-4">
              {order.lines.map((line: any) => (
                <div key={line.id} className="flex items-center gap-4 py-2 first:pt-0 last:pb-0">
                  <div className="h-16 w-16 bg-gray-100 rounded-md overflow-hidden flex-shrink-0 border border-gray-200">
                    {line.thumbnail?.url ? (
                      <img src={line.thumbnail.url} alt={line.productName} className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex items-center justify-center h-full text-gray-300">
                        <ShoppingBagIcon className="h-6 w-6" />
                      </div>
                    )}
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 text-sm">{line.productName}</h4>
                    <p className="text-sm text-gray-500">Qty: {line.quantity}</p>
                  </div>
                </div>
              ))}
            </div>

          </div>
        ))}
      </div>
    </div>
  )
}

export default OrderHistory