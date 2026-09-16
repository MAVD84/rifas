import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

async function notifyTelegram({ productName, numbers, buyerName, buyerPhone }: { productName: string; numbers: number[]; buyerName: string; buyerPhone: string }) {
  const token = process.env.TELEGRAM_BOT_TOKEN
  const chatId = process.env.TELEGRAM_CHAT_ID
  if (!token || !chatId) return

  const text = [
    '🎟️ Nuevo apartado en Tus Rifas',
    `Producto: ${productName}`,
    `Número${numbers.length === 1 ? '' : 's'}: ${numbers.join(', ')}`,
    `Cliente: ${buyerName}`,
    `WhatsApp: ${buyerPhone}`,
  ].join('\n')

  try {
    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text }),
    })
  } catch (error) {
    // A notification problem must never prevent a customer from reserving tickets.
    console.error('Telegram notification failed:', error)
  }
}

export async function POST(request: NextRequest) {
  try {
    const { productId, selectedNumbers, buyerName, buyerPhone, buyerEmail } = await request.json()
    if (!productId || !buyerName || !buyerPhone || !Array.isArray(selectedNumbers) || !selectedNumbers.length || selectedNumbers.length > 5 || selectedNumbers.some((number) => !Number.isInteger(number))) return NextResponse.json({ error: 'Revisa los datos de compra.' }, { status: 400 })
    const payload = await getPayload({ config })
    const product = await payload.findByID({ collection: 'products', id: productId })
    if (!product || product.status !== 'active') return NextResponse.json({ error: 'Esta rifa no está disponible.' }, { status: 404 })
    const existing = await payload.find({ collection: 'tickets', where: { product: { equals: productId }, paymentStatus: { not_equals: 'cancelled' } }, limit: 10000 })
    if (selectedNumbers.some((number) => number < 1 || number > product.ticketsTotal) || existing.docs.some((ticket) => selectedNumbers.includes(ticket.number))) return NextResponse.json({ error: 'Uno de esos números ya fue apartado. Actualiza la página y elige otro.' }, { status: 409 })
    for (const number of selectedNumbers) {
      await payload.create({ collection: 'tickets', data: { product: Number(productId), number, folio: `R-${productId.slice(-5).toUpperCase()}-${String(number).padStart(4, '0')}`, buyerName, buyerPhone, buyerEmail: buyerEmail || undefined, paymentStatus: 'pending' } })
    }
    await notifyTelegram({ productName: product.name, numbers: selectedNumbers, buyerName, buyerPhone })
    return NextResponse.json({ numbers: selectedNumbers })
  } catch (error) {
    console.error('Ticket purchase failed:', error)
    return NextResponse.json({ error: 'Ocurrió un error al registrar los boletos.' }, { status: 500 })
  }
}
