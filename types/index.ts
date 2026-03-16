export interface Product {
  id: string
  name: string
  brand: string
  price: number
  originalPrice?: number
  images: string[]          // multiple images for PDP gallery
  category: string
  subCategory?: string          // 'football-boots' | 'futsal' | 'turf'
  description: string
  longDescription: string
  sizes: string[]
  colors: string[]
  inStock: boolean
  featured?: boolean
  isNew?: boolean
  rating: number
  reviewCount: number
  tags: string[]
  createdAt?: string
}

export interface CartItem {
  product: Product
  quantity: number
  selectedSize: string
  selectedColor?: string
}

export interface Review {
  id: string
  productId: string
  name: string
  rating: number
  comment: string
  date: string
}
