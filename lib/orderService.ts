import { db } from './firebase'
import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot, query, orderBy, serverTimestamp, Timestamp } from 'firebase/firestore'
import { CartItem } from '@/types'

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'

export interface SerializedItem {
  productId: string
  productName: string
  productBrand: string
  productImage: string
  price: number
  quantity: number
  selectedSize: string
  selectedColor: string
}

export interface Order {
  id: string
  customer: string
  email: string
  phone: string
  city: string
  address: string
  pincode: string
  date: string
  status: OrderStatus
  items: SerializedItem[]
  total: number
  itemCount: number
  paymentId?: string
  paymentStatus?: 'paid' | 'pending' | 'failed'
  awbId?: string
  trackingUrl?: string
  createdAt?: Timestamp
}

function removeUndefined(obj: any): any {
  if (Array.isArray(obj)) return obj.map(removeUndefined)
  if (obj !== null && typeof obj === 'object') {
    return Object.fromEntries(
      Object.entries(obj)
        .filter(([_, v]) => v !== undefined)
        .map(([k, v]) => [k, removeUndefined(v)])
    )
  }
  return obj
}

function serializeItems(items: CartItem[]): SerializedItem[] {
  return items.map(i => ({
    productId: i.product.id ?? '',
    productName: i.product.name ?? '',
    productBrand: i.product.brand ?? '',
    productImage: i.product.images?.[0] ?? '',
    price: i.product.price ?? 0,
    quantity: i.quantity ?? 1,
    selectedSize: i.selectedSize ?? '',
    selectedColor: i.selectedColor ?? '',
  }))
}

const COL = 'orders'

export async function placeOrder(data: {
  customer: string; email: string; phone: string
  city: string; address: string; pincode: string
  items: CartItem[]; total: number; itemCount: number
  awbId?: string
  trackingUrl?: string
  paymentId?: string; paymentStatus?: string
  userId?: string
}): Promise<string> {
  const payload = removeUndefined({
    ...data,
    items: serializeItems(data.items),
    status: 'pending',
    date: new Date().toISOString().split('T')[0],
    createdAt: serverTimestamp(),
  })
  const ref = await addDoc(collection(db, COL), payload)
  return ref.id
}

export function subscribeOrders(callback: (orders: Order[]) => void) {
  const q = query(collection(db, COL), orderBy('createdAt', 'desc'))
  return onSnapshot(q, snap => {
    callback(snap.docs.map(d => ({ id: d.id, ...d.data() } as Order)))
  }, err => { console.error(err); callback([]) })
}

export async function updateOrderStatus(id: string, status: OrderStatus) {
  await updateDoc(doc(db, COL, id), { status })
}

export async function deleteOrder(id: string) {
  await deleteDoc(doc(db, COL, id))
}
// Fetch orders for a specific logged-in customer
export function subscribeOrdersByUser(userId: string, callback: (orders: Order[]) => void) {
  const q = query(collection(db, COL), orderBy('createdAt', 'desc'))
  return onSnapshot(q, snap => {
    const orders = snap.docs
      .map(d => ({ id: d.id, ...d.data() } as Order))
      .filter(o => (o as any).userId === userId)
    callback(orders)
  }, err => { console.error(err); callback([]) })
}

export async function updateOrderAWB(id: string, awbId: string) {
  const trackingUrl = `https://www.delhivery.com/track/package/${awbId}`
  await updateDoc(doc(db, COL, id), { awbId, trackingUrl, status: 'shipped' as OrderStatus })
}