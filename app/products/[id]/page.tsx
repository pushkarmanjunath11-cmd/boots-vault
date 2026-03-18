import { products as staticProducts } from '@/lib/data'
import ClientProduct from './ClientProduct'

export async function generateMetadata({ params }: { params: { id: string } }) {
  const product = staticProducts.find(p => p.id === params.id)

  if (!product) {
    return {
      title: 'Product Not Found | Boots Vault',
      description: 'This product does not exist',
    }
  }

  return {
    title: `${product.name} - Buy Online in India`,
    description: product.description,
  }
}

export default function ProductPage({ params }: { params: { id: string } }) {
  const product = staticProducts.find(p => p.id === params.id)

  if (!product) return <div>Product not found</div>

  return <ClientProduct product={product} />
}