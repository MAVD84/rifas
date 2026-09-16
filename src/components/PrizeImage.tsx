export function PrizeImage({ image, place }: { image: string; place: string }) {
  const src = image.includes('ibb.co') ? `/api/image?url=${encodeURIComponent(image)}` : image

  return <div className="prize-image"><img src={src} alt={`Premio ${place}`} /></div>
}
