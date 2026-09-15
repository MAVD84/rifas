import { getPayload } from 'payload'
import config from '@payload-config'
import { ProductCard } from '@/components/ProductCard'

export const dynamic = 'force-dynamic'

export default async function Home() {
  const payload = await getPayload({ config })
  const { docs } = await payload.find({ collection: 'products', where: { status: { equals: 'active' } }, sort: '-createdAt', limit: 24 })

  return (
    <main className="site">
      <nav><a className="brand" href="/">suerte<span>.</span></a></nav>
      <section className="hero"><p className="eyebrow">RIFAS QUE EMOCIONAN</p><h1>Tu próximo golpe<br />de suerte.</h1><p>Elige tu premio, compra tus boletos y sigue el sorteo desde un solo lugar.</p><a className="button" href="#rifas">Ver rifas activas</a></section>
      <section className="raffles" id="rifas"><div className="section-heading"><div><p className="eyebrow">DISPONIBLES AHORA</p><h2>Rifas activas</h2></div><span>{docs.length} disponibles</span></div>
        {docs.length ? <div className="grid">{docs.map((product) => <ProductCard key={product.id} product={product as never} />)}</div> : <div className="empty">Aún no hay rifas activas. Crea una desde el panel de administración.</div>}
      </section>
      <footer>© {new Date().getFullYear()} Suerte. Compra responsablemente.</footer>
    </main>
  )
}
