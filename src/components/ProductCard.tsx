import Link from 'next/link'

type Product = { id: string; name: string; description: string; price: number; ticketsTotal: number; raffleDate: string; gallery?: { imageUrl?: string }[] }

export function ProductCard({ product }: { product: Product }) {
  return <article className="card">
    <div className="card-image" style={product.gallery?.[0]?.imageUrl ? { backgroundImage: `url(${product.gallery[0].imageUrl})` } : undefined}><span>RIFA ACTIVA</span></div>
    <div className="card-body"><p className="date">Sorteo: {new Intl.DateTimeFormat('es-MX', { dateStyle: 'long' }).format(new Date(product.raffleDate))}</p><h3>{product.name}</h3><p className="description">{product.description}</p><div className="card-bottom"><div><small>BOLETO DESDE</small><strong>${product.price.toLocaleString('es-MX')} MXN</strong></div><Link href={`/rifas/${product.id}`} className="round-arrow" aria-label={`Ver ${product.name}`}><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h13M13 6l6 6-6 6" /></svg></Link></div></div>
  </article>
}
