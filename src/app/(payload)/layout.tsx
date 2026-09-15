import { RootLayout, handleServerFunctions } from '@payloadcms/next/layouts'
import config from '@payload-config'
import '@payloadcms/next/css'
import { importMap } from './admin/importMap'

export default function PayloadLayout({ children }: { children: React.ReactNode }) {
  return RootLayout({ children, config, importMap, serverFunction: handleServerFunctions })
}
