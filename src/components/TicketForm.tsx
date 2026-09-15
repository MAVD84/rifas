'use client'

import { FormEvent, useState } from 'react'

export function TicketForm({ productId, price, remaining, total, unavailable }: { productId: string; price: number; remaining: number; total: number; unavailable: number[] }) {
  const [selected, setSelected] = useState<number[]>([])
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setLoading(true); setMessage('')
    const form = new FormData(event.currentTarget)
    if (!selected.length) { setMessage('Elige al menos un número.'); setLoading(false); return }
    const response = await fetch('/api/tickets', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ productId, selectedNumbers: selected, buyerName: form.get('name'), buyerPhone: form.get('phone'), buyerEmail: form.get('email') }) })
    const result = await response.json()
    setLoading(false)
    setMessage(response.ok ? `¡Listo! ${selected.length === 1 ? 'Tu número es' : 'Tus números son'} ${selected.join(', ')}. Te contactaremos para confirmar el pago.` : result.error || 'No fue posible registrar tu compra.')
  }
  if (!remaining) return <div className="sold-out">Esta rifa ya agotó sus boletos.</div>
  const reserved = new Set(unavailable)
  const visibleNumbers = Array.from({ length: total }, (_, index) => index + 1)
  function toggle(number: number) { setSelected((current) => current.includes(number) ? current.filter((item) => item !== number) : current.length < 5 ? [...current, number] : current) }
  return <form className="ticket-form" onSubmit={submit}><h2>Elige tus números</h2><p className="number-help">Selecciona hasta 5 boletos. Los rojos ya están apartados.</p><div className="number-grid">{visibleNumbers.map((number) => <button type="button" key={number} disabled={reserved.has(number)} onClick={() => toggle(number)} className={selected.includes(number) ? 'number selected' : 'number'}>{String(number).padStart(2, '0')}</button>)}</div><div className="form-grid"><input name="name" placeholder="Tu nombre completo" required /><input name="phone" placeholder="WhatsApp" required /><input name="email" type="email" placeholder="Correo (opcional)" /></div><button className="button" disabled={loading}>{loading ? 'Apartando…' : `Apartar ${selected.length || ''} boleto${selected.length === 1 ? '' : 's'} por $${(price * selected.length).toLocaleString('es-MX')} MXN`}</button>{message && <p className="form-message">{message}</p>}</form>
}
