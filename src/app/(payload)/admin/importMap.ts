import type { ImportMap } from 'payload'
import { CollectionCards } from '@payloadcms/next/rsc'

// Payload generates and extends this map when custom admin components are added.
export const importMap: ImportMap = {
  '@payloadcms/next/rsc#CollectionCards': CollectionCards,
}
