import { NotFoundPage, generateMetadata } from '@payloadcms/next/views'
import config from '@payload-config'
export { generateMetadata }
export default function NotFound() { return NotFoundPage({ config }) }
