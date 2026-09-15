import { RootLayout } from '@payloadcms/next/layouts'
import config from '@payload-config'
import '@payloadcms/next/css'

export default function PayloadLayout({ children }: { children: React.ReactNode }) {
  return RootLayout({ children, config })
}
