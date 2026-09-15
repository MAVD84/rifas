import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const source = request.nextUrl.searchParams.get('url')
  if (!source) return NextResponse.json({ error: 'URL requerida' }, { status: 400 })
  try {
    const url = new URL(source)
    if (!['ibb.co', 'i.ibb.co'].includes(url.hostname)) return NextResponse.json({ error: 'Origen no permitido' }, { status: 400 })
    if (url.hostname === 'i.ibb.co') return NextResponse.redirect(url)
    const page = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } })
    const html = await page.text()
    const image = html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i)?.[1]
    if (!image) return NextResponse.json({ error: 'No se encontró la imagen' }, { status: 422 })
    return NextResponse.redirect(image)
  } catch {
    return NextResponse.json({ error: 'No se pudo cargar la imagen' }, { status: 400 })
  }
}
