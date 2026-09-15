# Suerte — plataforma de rifas

Web app en Next.js + Payload CMS + PostgreSQL (Neon) para administrar productos/rifas y registrar la venta de boletos.

## Incluye

- Panel de Payload en `/admin` para crear, editar y eliminar productos y boletos.
- Catálogo público de rifas activas.
- Apartado de 1 a 5 boletos con datos del comprador, número y folio.
- Estados de rifa y de pago para operar la venta.

## Ejecutar localmente

1. Copia `.env.example` como `.env` y configura una base PostgreSQL de Neon y un `PAYLOAD_SECRET` seguro.
2. Instala dependencias con `npm install`.
3. Ejecuta `npm run dev` y abre `http://localhost:3000`.
4. Entra a `http://localhost:3000/admin` y crea el primer usuario administrador.
5. Crea productos y pon su estado en **Activa** para publicarlos.

## Vercel + Neon

1. Crea un proyecto de Postgres en Neon y copia su cadena de conexión con SSL.
2. Importa este repositorio en Vercel.
3. Añade `DATABASE_URI`, `PAYLOAD_SECRET` y `NEXT_PUBLIC_APP_URL` a las variables de entorno de Vercel.
4. Despliega. Payload crea las tablas al iniciar con la configuración de Postgres.

> Para pagos reales, conecta un proveedor (por ejemplo Stripe o Mercado Pago) y cambia el estado del boleto a `paid` únicamente después del webhook verificado.
