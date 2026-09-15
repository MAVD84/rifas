import type { Metadata } from 'next'
import './styles.css'

export const metadata: Metadata = {
  title: 'Tus Rifas | Rifas en línea',
  description: 'Compra boletos para tus rifas favoritas.',
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="es"><body>{children}</body></html>
}
