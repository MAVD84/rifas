import { RootLayout } from '@payloadcms/next/layouts'
import config from '@payload-config'
import '@payloadcms/next/css'
import { importMap } from './admin/importMap'
import { serverFunction } from './actions'

export default function PayloadLayout({ children }: { children: React.ReactNode }) {
  return RootLayout({
    children,
    config,
    importMap,
    serverFunction,
  })
}
