import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@payload-config'
import { TicketForm } from '@/components/TicketForm'
import { ImageGallery } from '@/components/ImageGallery'
import { PrizeImage } from '@/components/PrizeImage'

export const dynamic = 'force-dynamic'

export default async function RafflePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const payload = await getPayload({ config })
  const product = await payload.findByID({ collection: 'products', id })
  if (!product || (product.status !== 'active' && product.status !== 'closed')) notFound()
  const soldTickets = await payload.find({ collection: 'tickets', where: { product: { equals: id }, paymentStatus: { not_equals: 'cancelled' } }, limit: 10000 })
  const sold = soldTickets.totalDocs
  const remaining = product.ticketsTotal - sold
  const unavailable = soldTickets.docs.map((ticket) => ticket.number)
  const galleryItems = ((product.gallery || []) as Array<{ imageUrl?: string; placement?: 'gallery' | 'first' | 'second' | 'third' }>).filter((image): image is { imageUrl: string; placement?: 'gallery' | 'first' | 'second' | 'third' } => Boolean(image.imageUrl))
  const imageFor = (placement: 'first' | 'second' | 'third') => galleryItems.find((image) => image.placement === placement)?.imageUrl
  const prizes = [
    { place: '1er lugar', name: product.firstPlace, image: imageFor('first') },
    { place: '2do lugar', name: product.secondPlace, image: imageFor('second') },
    { place: '3er lugar', name: product.thirdPlace, image: imageFor('third') },
  ].filter((prize) => Boolean(prize.name || prize.image))
  const winners = [
    { place: '1er lugar', number: product.winnerFirst },
    { place: '2do lugar', number: product.winnerSecond },
    { place: '3er lugar', number: product.winnerThird },
  ].filter((winner) => Boolean(winner.number))
  return <main className="site"><nav><a className="brand" href="/">tus rifas<span>.</span></a></nav>
    <section className="detail"><ImageGallery images={galleryItems} /><div><p className="eyebrow">{product.status === 'closed' ? 'RIFA FINALIZADA' : `${remaining} BOLETOS DISPONIBLES`}</p><h1>{product.name}</h1><p className="detail-description">{product.description}</p>{prizes.length > 0 && <section className="prizes"><p className="eyebrow">PREMIOS</p>{prizes.map((prize) => <div key={prize.place} className="prize">{prize.image && <PrizeImage image={prize.image} place={prize.place} />}<div><span>{prize.place}</span>{prize.name && <strong>{prize.name}</strong>}</div></div>)}</section>}{product.status === 'closed' && <section className="winners"><p className="eyebrow">NÚMEROS GANADORES</p>{winners.length ? winners.map((winner) => <div key={winner.place}><span>{winner.place}</span><strong>{String(winner.number).padStart(2, '0')}</strong></div>) : <p>Los números ganadores se publicarán pronto.</p>}</section>}<div className="stats"><div><small>PRECIO</small><b>${product.price.toLocaleString('es-MX')} MXN</b></div><div><small>SORTEO</small><b>{product.drawMode === 'sell_out' ? 'Hasta agotar boletos' : product.raffleDate ? new Intl.DateTimeFormat('es-MX', { dateStyle: 'medium' }).format(new Date(product.raffleDate)) : 'Por confirmar'}</b></div></div><TicketForm productId={id} price={product.price} remaining={remaining} total={product.ticketsTotal} unavailable={unavailable} isClosed={product.status === 'closed'} /></div></section><footer>© {new Date().getFullYear()} Tus Rifas. Compra responsablemente. <a href="/terminos">Términos y condiciones</a></footer>
  </main>
}
