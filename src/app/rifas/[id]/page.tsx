import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@payload-config'
import { TicketForm } from '@/components/TicketForm'
import { ImageGallery } from '@/components/ImageGallery'

export const dynamic = 'force-dynamic'

export default async function RafflePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const payload = await getPayload({ config })
  const product = await payload.findByID({ collection: 'products', id })
  if (!product || product.status !== 'active') notFound()
  const soldTickets = await payload.find({ collection: 'tickets', where: { product: { equals: id }, paymentStatus: { not_equals: 'cancelled' } }, limit: 10000 })
  const sold = soldTickets.totalDocs
  const remaining = product.ticketsTotal - sold
  const unavailable = soldTickets.docs.map((ticket) => ticket.number)
  const gallery: string[] = ((product.gallery || []) as Array<{ imageUrl?: string }>).map((image) => image.imageUrl).filter((url: string | undefined): url is string => Boolean(url))
  return <main className="site"><nav><a className="brand" href="/">pura suerte<span>.</span></a></nav>
    <section className="detail"><ImageGallery images={gallery} /><div><p className="eyebrow">{remaining} BOLETOS DISPONIBLES</p><h1>{product.name}</h1><p className="detail-description">{product.description}</p><div className="stats"><div><small>PRECIO</small><b>${product.price.toLocaleString('es-MX')} MXN</b></div><div><small>SORTEO</small><b>{new Intl.DateTimeFormat('es-MX', { dateStyle: 'medium' }).format(new Date(product.raffleDate))}</b></div></div><TicketForm productId={id} price={product.price} remaining={remaining} total={product.ticketsTotal} unavailable={unavailable} /></div></section>
  </main>
}
