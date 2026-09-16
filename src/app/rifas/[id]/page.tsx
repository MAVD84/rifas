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
  const galleryItems = (product.gallery || []) as Array<{ imageUrl?: string; placement?: 'gallery' | 'first' | 'second' | 'third' }>
  const gallery: string[] = galleryItems.map((image) => image.imageUrl).filter((url: string | undefined): url is string => Boolean(url))
  const imageFor = (placement: 'first' | 'second' | 'third') => galleryItems.find((image) => image.placement === placement)?.imageUrl
  const prizes = [['1er lugar', product.firstPlace, imageFor('first')], ['2do lugar', product.secondPlace, imageFor('second')], ['3er lugar', product.thirdPlace, imageFor('third')]].filter(([, prize, image]) => Boolean(prize || image))
  return <main className="site"><nav><a className="brand" href="/">tus rifas<span>.</span></a></nav>
    <section className="detail"><ImageGallery images={gallery} /><div><p className="eyebrow">{remaining} BOLETOS DISPONIBLES</p><h1>{product.name}</h1><p className="detail-description">{product.description}</p>{prizes.length > 0 && <section className="prizes"><p className="eyebrow">PREMIOS</p>{prizes.map(([place, prize, image]) => <div key={place} className="prize"><>{image && <img src={image.includes('ibb.co') ? `/api/image?url=${encodeURIComponent(image)}` : image} alt={`Premio ${place}`} />}</><div><span>{place}</span>{prize && <strong>{prize}</strong>}</div></div>)}</section>}<div className="stats"><div><small>PRECIO</small><b>${product.price.toLocaleString('es-MX')} MXN</b></div><div><small>SORTEO</small><b>{product.drawMode === 'sell_out' ? 'Hasta agotar boletos' : product.raffleDate ? new Intl.DateTimeFormat('es-MX', { dateStyle: 'medium' }).format(new Date(product.raffleDate)) : 'Por confirmar'}</b></div></div><TicketForm productId={id} price={product.price} remaining={remaining} total={product.ticketsTotal} unavailable={unavailable} /></div></section><footer>© {new Date().getFullYear()} Tus Rifas. Compra responsablemente. <a href="/terminos">Términos y condiciones</a></footer>
  </main>
}
