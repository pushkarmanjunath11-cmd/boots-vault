import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { CartItem, Product } from '@/types'

interface CartStore {
  items: CartItem[]
  isOpen: boolean
  addItem: (product: Product, size: string, color?: string) => void
  removeItem: (productId: string, size: string) => void
  updateQuantity: (productId: string, size: string, qty: number) => void
  clearCart: () => void
  openCart: () => void
  closeCart: () => void
  toggleCart: () => void
  total: () => number
  itemCount: () => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      addItem: (product, size, color) => {
        set((state) => {
          const existing = state.items.find(i => i.product.id === product.id && i.selectedSize === size)
          if (existing) {
            return { items: state.items.map(i => i.product.id === product.id && i.selectedSize === size ? { ...i, quantity: i.quantity + 1 } : i) }
          }
          return { items: [...state.items, { product, quantity: 1, selectedSize: size, selectedColor: color }] }
        })
      },
      removeItem: (id, size) => set(s => ({ items: s.items.filter(i => !(i.product.id === id && i.selectedSize === size)) })),
      updateQuantity: (id, size, qty) => {
        if (qty <= 0) { get().removeItem(id, size); return }
        set(s => ({ items: s.items.map(i => i.product.id === id && i.selectedSize === size ? { ...i, quantity: qty } : i) }))
      },
      clearCart: () => set({ items: [] }),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set(s => ({ isOpen: !s.isOpen })),
      total: () => get().items.reduce((s, i) => s + i.product.price * i.quantity, 0),
      itemCount: () => get().items.reduce((s, i) => s + i.quantity, 0),
    }),
    { name: 'bv-cart' }
  )
)
