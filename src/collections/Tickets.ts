import type { CollectionConfig } from 'payload'

export const Tickets: CollectionConfig = {
  slug: 'tickets',
  access: {
    // Anyone may request a ticket from the public raffle page.
    create: () => true,
    // Only an authenticated Payload administrator can modify or remove tickets.
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  admin: { useAsTitle: 'number', defaultColumns: ['number', 'product', 'buyerName', 'paymentStatus'] },
  fields: [
    { name: 'product', type: 'relationship', relationTo: 'products', required: true },
    { name: 'number', label: 'Número de boleto', type: 'number', required: true, min: 1 },
    { name: 'folio', label: 'Folio interno', type: 'text', required: true, unique: true, admin: { hidden: true } },
    { name: 'buyerName', label: 'Comprador', type: 'text', required: true },
    { name: 'buyerPhone', label: 'WhatsApp', type: 'text', required: true },
    { name: 'buyerEmail', label: 'Correo', type: 'email' },
    { name: 'paymentStatus', type: 'select', required: true, defaultValue: 'pending', options: [
      { label: 'Pendiente', value: 'pending' }, { label: 'Pagado', value: 'paid' }, { label: 'Cancelado', value: 'cancelled' },
    ] },
  ],
}
