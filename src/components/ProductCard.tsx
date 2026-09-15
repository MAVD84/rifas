import Link from 'next/link'

type Product = { id: string; name: string; description: string; price: number; ticketsTotal: number; raffleDate: string; imageUrl?: string | null }

export function ProductCard({ product }: { product: Product }) {
  return <article className="card">
    <div className="card-image" style={product.imageUrl ? { backgroundImage: `url(${product.imageUrl})` } : undefined}><span>RIFA ACTIVA</span></div>
    <div className="card-body"><p className="date">Sorteo: {new Intl.DateTimeFormat('es-MX', { dateStyle: 'long' }).format(new Date(product.raffleDate))}</p><h3>{product.name}</h3><p className="description">{product.description}</p><div className="card-bottom"><div><small>BOLETO DESDE</small><strong>${product.price.toLocaleString('es-MX')} MXN</strong></div><Link href={`/rifas/${product.id}`} className="round-arrow" aria-label={`Ver ${product.name}`}>→</Link></div></div>
  </article>
}
