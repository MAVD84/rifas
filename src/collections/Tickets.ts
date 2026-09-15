import type { CollectionConfig } from 'payload'

export const Tickets: CollectionConfig = {
  slug: 'tickets',
  admin: { useAsTitle: 'folio', defaultColumns: ['folio', 'product', 'buyerName', 'paymentStatus'] },
  fields: [
    { name: 'product', type: 'relationship', relationTo: 'products', required: true },
    { name: 'number', label: 'Número', type: 'number', required: true, min: 1 },
    { name: 'folio', label: 'Folio', type: 'text', required: true, unique: true },
    { name: 'buyerName', label: 'Comprador', type: 'text', required: true },
    { name: 'buyerPhone', label: 'WhatsApp', type: 'text', required: true },
    { name: 'buyerEmail', label: 'Correo', type: 'email' },
    { name: 'paymentStatus', type: 'select', required: true, defaultValue: 'pending', options: [
      { label: 'Pendiente', value: 'pending' }, { label: 'Pagado', value: 'paid' }, { label: 'Cancelado', value: 'cancelled' },
    ] },
  ],
}
