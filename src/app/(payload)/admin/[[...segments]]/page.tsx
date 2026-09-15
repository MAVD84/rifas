import { RootPage, generatePageMetadata } from '@payloadcms/next/views'
import config from '@payload-config'
import { importMap } from '../importMap'
export const generateMetadata = ({ params, searchParams }: { params: Promise<{ segments?: string[] }>; searchParams: Promise<Record<string, string | string[]>> }) => generatePageMetadata({ config, params, searchParams })
export default function Page({ params, searchParams }: { params: Promise<{ segments?: string[] }>; searchParams: Promise<Record<string, string | string[]>> }) { return RootPage({ config, importMap, params: params as Promise<{ segments: string[] }>, searchParams }) }
