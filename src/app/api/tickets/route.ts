import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export async function POST(request: NextRequest) {
  try {
    const { productId, quantity, buyerName, buyerPhone, buyerEmail } = await request.json()
    if (!productId || !buyerName || !buyerPhone || !Number.isInteger(quantity) || quantity < 1 || quantity > 5) return NextResponse.json({ error: 'Revisa los datos de compra.' }, { status: 400 })
    const payload = await getPayload({ config })
    const product = await payload.findByID({ collection: 'products', id: productId })
    if (!product || product.status !== 'active') return NextResponse.json({ error: 'Esta rifa no está disponible.' }, { status: 404 })
    const existing = await payload.find({ collection: 'tickets', where: { product: { equals: productId }, paymentStatus: { not_equals: 'cancelled' } }, limit: 0 })
    if (existing.totalDocs + quantity > product.ticketsTotal) return NextResponse.json({ error: 'Ya no quedan suficientes boletos.' }, { status: 409 })
    const folios: string[] = []
    for (let offset = 0; offset < quantity; offset++) {
      const ticket = await payload.create({ collection: 'tickets', data: { product: productId, number: existing.totalDocs + offset + 1, folio: `R-${productId.slice(-5).toUpperCase()}-${String(existing.totalDocs + offset + 1).padStart(4, '0')}`, buyerName, buyerPhone, buyerEmail: buyerEmail || undefined, paymentStatus: 'pending' } })
      folios.push(ticket.folio)
    }
    return NextResponse.json({ folios })
  } catch {
    return NextResponse.json({ error: 'Ocurrió un error al registrar los boletos.' }, { status: 500 })
  }
}
