'use client'

import { useState } from 'react'

export function PrizeImage({ image, place }: { image: string; place: string }) {
  const [expanded, setExpanded] = useState(false)
  const src = image.includes('ibb.co') ? `/api/image?url=${encodeURIComponent(image)}` : image

  return <><button type="button" className="prize-image" onClick={() => setExpanded(true)} aria-label={`Ampliar imagen del ${place}`}><img src={src} alt={`Premio ${place}`} /></button>{expanded && <div className="lightbox" onClick={() => setExpanded(false)} role="dialog" aria-modal="true"><button type="button" className="close" aria-label="Cerrar"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18" /></svg></button><img src={src} alt={`Premio ${place}`} onClick={(event) => event.stopPropagation()} /></div>}</>
}
