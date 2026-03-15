import { db } from './firebase'
import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot, query, orderBy, serverTimestamp } from 'firebase/firestore'
import { Product } from '@/types'

const COL = 'products'

function removeUndefined(obj: any): any {
  if (Array.isArray(obj)) return obj.map(removeUndefined)
  if (obj !== null && typeof obj === 'object') {
    return Object.fromEntries(
      Object.entries(obj).filter(([_, v]) => v !== undefined).map(([k, v]) => [k, removeUndefined(v)])
    )
  }
  return obj
}

export async function addProduct(data: Omit<Product, 'id'>): Promise<string> {
  const ref = await addDoc(collection(db, COL), removeUndefined({ ...data, createdAt: serverTimestamp() }))
  return ref.id
}

export async function updateProduct(id: string, data: Partial<Product>) {
  await updateDoc(doc(db, COL, id), removeUndefined(data))
}

export async function deleteProduct(id: string) {
  await deleteDoc(doc(db, COL, id))
}

// Real-time listener — replaces static lib/data.ts in production
export function subscribeProducts(callback: (products: Product[]) => void) {
  const q = query(collection(db, COL), orderBy('createdAt', 'desc'))
  return onSnapshot(q, snap => {
    const products = snap.docs.map(d => ({ id: d.id, ...d.data() } as Product))
    callback(products)
  }, err => { console.error(err); callback([]) })
}
