import type { CollectionConfig } from 'payload'

export const Products: CollectionConfig = {
  slug: 'products',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'price', 'ticketsTotal', 'status'],
    // Arrays such as the photo gallery cannot be reliably updated by Payload's
    // bulk editor. Keep authors in the document editor, where every gallery row
    // is saved as a normal product update.
    disableBulkEdit: true,
  },
  access: { read: () => true },
  fields: [
    { name: 'name', label: 'Producto', type: 'text', required: true },
    { name: 'description', label: 'Descripción', type: 'textarea', required: true },
    { name: 'price', label: 'Precio por boleto (MXN)', type: 'number', required: true, min: 1 },
    { name: 'ticketsTotal', label: 'Cantidad de boletos', type: 'number', required: true, min: 1 },
    { name: 'raffleDate', label: 'Fecha del sorteo', type: 'date', required: true },
    {
      name: 'status', type: 'select', required: true, defaultValue: 'draft', options: [
        { label: 'Borrador', value: 'draft' }, { label: 'Activa', value: 'active' }, { label: 'Finalizada', value: 'closed' },
      ],
    },
    {
      name: 'gallery', label: 'Galería de fotos', type: 'array',
      fields: [{ name: 'imageUrl', label: 'URL de imagen', type: 'text', required: true }],
    },
  ],
}
