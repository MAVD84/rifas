import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@payload-config'
import { TicketForm } from '@/components/TicketForm'

export const dynamic = 'force-dynamic'

export default async function RafflePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const payload = await getPayload({ config })
  const product = await payload.findByID({ collection: 'products', id })
  if (!product || product.status !== 'active') notFound()
  const sold = await payload.count({ collection: 'tickets', where: { product: { equals: id }, paymentStatus: { not_equals: 'cancelled' } } })
  const remaining = product.ticketsTotal - sold.totalDocs
  return <main><nav><a className="brand" href="/">suerte<span>.</span></a><a className="admin-link" href="/admin">Administrar</a></nav>
    <section className="detail"><div className="detail-image" style={product.imageUrl ? { backgroundImage: `url(${product.imageUrl})` } : undefined}><span>RIFA ACTIVA</span></div><div><p className="eyebrow">{remaining} BOLETOS DISPONIBLES</p><h1>{product.name}</h1><p className="detail-description">{product.description}</p><div className="stats"><div><small>PRECIO</small><b>${product.price.toLocaleString('es-MX')} MXN</b></div><div><small>SORTEO</small><b>{new Intl.DateTimeFormat('es-MX', { dateStyle: 'medium' }).format(new Date(product.raffleDate))}</b></div></div><TicketForm productId={id} price={product.price} remaining={remaining} /></div></section>
  </main>
}
