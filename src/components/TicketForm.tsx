'use client'

import { FormEvent, useState } from 'react'

export function TicketForm({ productId, price, remaining }: { productId: string; price: number; remaining: number }) {
  const [quantity, setQuantity] = useState(1)
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setLoading(true); setMessage('')
    const form = new FormData(event.currentTarget)
    const response = await fetch('/api/tickets', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ productId, quantity, buyerName: form.get('name'), buyerPhone: form.get('phone'), buyerEmail: form.get('email') }) })
    const result = await response.json()
    setLoading(false)
    setMessage(response.ok ? `¡Listo! Tus folios: ${result.folios.join(', ')}. Te contactaremos para confirmar el pago.` : result.error || 'No fue posible registrar tu compra.')
  }
  if (!remaining) return <div className="sold-out">Esta rifa ya agotó sus boletos.</div>
  return <form className="ticket-form" onSubmit={submit}><h2>Compra tus boletos</h2><label>¿Cuántos? <select value={quantity} onChange={(e) => setQuantity(Number(e.target.value))}>{[1,2,3,4,5].filter(n => n <= remaining).map(n => <option key={n} value={n}>{n} boleto{n > 1 ? 's' : ''} — ${(n * price).toLocaleString('es-MX')} MXN</option>)}</select></label><div className="form-grid"><input name="name" placeholder="Tu nombre completo" required /><input name="phone" placeholder="WhatsApp" required /><input name="email" type="email" placeholder="Correo (opcional)" /></div><button className="button" disabled={loading}>{loading ? 'Apartando…' : `Apartar por $${(price * quantity).toLocaleString('es-MX')} MXN`}</button>{message && <p className="form-message">{message}</p>}</form>
}
