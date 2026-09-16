'use client'

import { useState } from 'react'

type GalleryImage = { imageUrl: string; placement?: 'gallery' | 'first' | 'second' | 'third' }

const placementLabel: Record<string, string> = { first: '1ER LUGAR', second: '2DO LUGAR', third: '3ER LUGAR', gallery: 'RIFA ACTIVA' }

export function ImageGallery({ images }: { images: GalleryImage[] }) {
  const [selected, setSelected] = useState<string | null>(null)
  const [active, setActive] = useState(images[0])
  const displayURL = (url: string) => url.includes('ibb.co') ? `/api/image?url=${encodeURIComponent(url)}` : url
  if (!images.length) return <div className="image-empty"><span>Sin imágenes disponibles</span></div>
  return <><div className="ml-gallery"><div className="ml-thumbs">{images.map((image, index) => <button key={image.imageUrl} className={active.imageUrl === image.imageUrl ? 'thumb active' : 'thumb'} onClick={() => setActive(image)} aria-label={`Seleccionar foto ${index + 1}`}><img src={displayURL(image.imageUrl)} alt="Miniatura del producto" /></button>)}</div><button className="ml-main" onClick={() => setSelected(active.imageUrl)} aria-label="Ampliar imagen"><img src={displayURL(active.imageUrl)} alt="Imagen principal del producto" /><span>{placementLabel[active.placement || 'gallery']}</span></button></div>{selected && <div className="lightbox" onClick={() => setSelected(null)} role="dialog" aria-modal="true"><button type="button" className="close" aria-label="Cerrar"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18" /></svg></button><img src={displayURL(selected)} alt="Imagen ampliada del producto" onClick={(event) => event.stopPropagation()} /></div>}</>
}
