'use client'

import { useState } from 'react'

export function ImageGallery({ images }: { images: string[] }) {
  const [selected, setSelected] = useState<string | null>(null)
  if (!images.length) return <div className="detail-image"><span>RIFA ACTIVA</span></div>
  return <><div className="gallery">{images.map((src, index) => <button key={src} className={index === 0 ? 'gallery-main' : 'gallery-thumb'} onClick={() => setSelected(src)} style={{ backgroundImage: `url(${src})` }} aria-label="Ver imagen completa">{index === 0 && <span>RIFA ACTIVA</span>}</button>)}</div>{selected && <div className="lightbox" onClick={() => setSelected(null)} role="dialog" aria-modal="true"><button className="close" aria-label="Cerrar"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18" /></svg></button><img src={selected} alt="Imagen del producto" onClick={(event) => event.stopPropagation()} /></div>}</>
}
