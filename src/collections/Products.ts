import type { CollectionConfig } from 'payload'

export const Products: CollectionConfig = {
  slug: 'products',
  admin: { useAsTitle: 'name', defaultColumns: ['name', 'price', 'ticketsTotal', 'status'] },
  access: { read: () => true },
  fields: [
    { name: 'name', label: 'Producto', type: 'text', required: true },
    { name: 'description', label: 'Descripción', type: 'textarea', required: true },
    { name: 'firstPlace', label: 'Premio: 1er lugar', type: 'text', admin: { description: 'Opcional. Ejemplo: Pulsera de oro 14k.' } },
    { name: 'secondPlace', label: 'Premio: 2do lugar', type: 'text', admin: { description: 'Opcional.' } },
    { name: 'thirdPlace', label: 'Premio: 3er lugar', type: 'text', admin: { description: 'Opcional.' } },
    { name: 'price', label: 'Precio por boleto (MXN)', type: 'number', required: true, min: 1 },
    { name: 'ticketsTotal', label: 'Cantidad de boletos', type: 'number', required: true, min: 1 },
    {
      name: 'drawMode', label: 'Modalidad del sorteo', type: 'select', required: true, defaultValue: 'scheduled', options: [
        { label: 'Fecha programada', value: 'scheduled' }, { label: 'Hasta agotar boletos', value: 'sell_out' },
      ],
    },
    { name: 'raffleDate', label: 'Fecha del sorteo', type: 'date', admin: { condition: (_, siblingData) => siblingData.drawMode !== 'sell_out' } },
    {
      name: 'status', type: 'select', required: true, defaultValue: 'draft', options: [
        { label: 'Borrador', value: 'draft' }, { label: 'Activa', value: 'active' }, { label: 'Finalizada', value: 'closed' },
      ],
    },
    { name: 'winnerFirst', label: 'Número ganador: 1er lugar', type: 'number', min: 1, admin: { condition: (_, siblingData) => siblingData.status === 'closed' } },
    { name: 'winnerSecond', label: 'Número ganador: 2do lugar', type: 'number', min: 1, admin: { condition: (_, siblingData) => siblingData.status === 'closed' } },
    { name: 'winnerThird', label: 'Número ganador: 3er lugar', type: 'number', min: 1, admin: { condition: (_, siblingData) => siblingData.status === 'closed' } },
    {
      name: 'gallery', label: 'Galería de fotos', type: 'array',
      fields: [
        { name: 'imageUrl', label: 'URL de imagen', type: 'text', required: true },
        {
          name: 'placement', label: 'Mostrar como', type: 'select', required: true, defaultValue: 'gallery', options: [
            { label: 'Galería general', value: 'gallery' },
            { label: 'Imagen del 1er lugar', value: 'first' },
            { label: 'Imagen del 2do lugar', value: 'second' },
            { label: 'Imagen del 3er lugar', value: 'third' },
          ],
        },
      ],
    },
  ],
}
