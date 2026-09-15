import { RootPage, generateMetadata } from '@payloadcms/next/views'
import config from '@payload-config'
export { generateMetadata }
export default function Page({ params, searchParams }: { params: Promise<{ segments?: string[] }>; searchParams: Promise<Record<string, string | string[]>> }) { return RootPage({ config, params, searchParams }) }
