'use client'

import { useState } from 'react'

export function ImageGallery({ images }: { images: string[] }) {
  const [selected, setSelected] = useState<string | null>(null)
  const [active, setActive] = useState(images[0])
  const displayURL = (url: string) => url.includes('ibb.co') ? `/api/image?url=${encodeURIComponent(url)}` : url
  if (!images.length) return <div className="image-empty"><span>Sin imágenes disponibles</span></div>
  return <><div className="ml-gallery"><div className="ml-thumbs">{images.map((src, index) => <button key={src} className={active === src ? 'thumb active' : 'thumb'} onClick={() => setActive(src)} aria-label={`Ver foto ${index + 1}`}><img src={displayURL(src)} alt="Miniatura del producto" /></button>)}</div><button className="ml-main" onClick={() => setSelected(active)} aria-label="Ampliar imagen"><img src={displayURL(active)} alt="Imagen principal del producto" /><span>RIFA ACTIVA</span></button></div>{selected && <div className="lightbox" onClick={() => setSelected(null)} role="dialog" aria-modal="true"><button className="close" aria-label="Cerrar"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18" /></svg></button><img src={displayURL(selected)} alt="Imagen del producto" onClick={(event) => event.stopPropagation()} /></div>}</>
}
