# Cotizador de avisos destacados

MVP en **Next.js 15 (App Router) + React 19 + Supabase**, con cotizador paso a paso y base de SEO lista para posicionar en Google.

Funciona apenas lo abrís (con datos de respaldo) y, cuando conectás Supabase, los precios salen de la base de datos.

---

## 1. Requisitos

- Node.js 18.18+ o 20+
- Cuenta en [Supabase](https://supabase.com) (gratis)
- Cuenta en [Vercel](https://vercel.com) para publicar (gratis)

## 2. Instalar y correr (local)

```bash
npm install
cp .env.local.example .env.local   # luego completá los valores
npm run dev
```

Abrí http://localhost:3000 — ya funciona con los datos de Skokka de respaldo.

> Tip Cursor + Claude Code: abrí la carpeta en Cursor y pedile a Claude Code que corra `npm install` y `npm run dev`. Para tareas largas, usá Claude Code; para componentes y diseño, Cursor.

## 3. Conectar Supabase

1. Creá un proyecto en Supabase.
2. **SQL Editor → New query**, pegá y ejecutá `supabase/schema.sql`.
3. Repetí con `supabase/seed.sql` (datos iniciales de Skokka + sitios "pronto").
4. **Project Settings → API**, copiá `Project URL` y `anon public key`.
5. Pegalos en `.env.local`:

```
NEXT_PUBLIC_SITE_URL=https://tudominio.cl
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
```

6. Reiniciá `npm run dev`. Ahora los precios vienen de Supabase.

> 🔒 **Seguridad:** usá SOLO la `anon key` en el front. **Nunca** pongas el `SERVICE_ROLE_KEY` con prefijo `NEXT_PUBLIC` ni lo subas al repo. La lectura pública está protegida con RLS (solo `select`).

## 4. Editar precios y sitios

- **Con Supabase conectado:** editás las tablas `sitios`, `niveles`, `horarios`, `precios` desde el panel de Supabase. La web se actualiza sola (cache de 1 hora, ver `revalidate`).
- **Sin Supabase:** editás el respaldo en `src/lib/sitios.ts` (objeto `FALLBACK`).

Para agregar un sitio nuevo (Chimbis, Locanto, SimpleEscorts): replicás la estructura de Skokka en el seed (o en las tablas) con su `slug`, `color`, descripción y precios. Cada sitio queda en su propia URL: `tudominio.cl/chimbis`, etc., con su color de marca.

## 5. SEO y palabras clave

- **Palabras clave:** se editan en **un solo lugar** → `src/lib/seo.ts`, en el objeto `KEYWORDS`. Agregá las que quieras posicionar por sitio.
- **Título y descripción por sitio:** en `SEO_OVERRIDES` del mismo archivo (o se generan solos).
- Ya viene incluido:
  - Metadata dinámica por página (`title`, `description`, `keywords`, Open Graph, Twitter, canonical).
  - **JSON-LD**: `Service` + `Offer` (precios), `FAQPage` y `BreadcrumbList` → habilita resultados enriquecidos en Google.
  - **H1 + tablas de precios + FAQ renderizados en el servidor** (texto real que Google indexa, no escondido detrás del cotizador).
  - `sitemap.xml` y `robots.txt` automáticos.

**Pasos para posicionar:**
1. Poné tu dominio real en `NEXT_PUBLIC_SITE_URL`.
2. Publicá (paso 6).
3. Registrá el sitio en [Google Search Console](https://search.google.com/search-console) y enviá `https://tudominio.cl/sitemap.xml`.
4. Cargá tus palabras clave en `src/lib/seo.ts`.
5. Probá los datos estructurados en el [Rich Results Test](https://search.google.com/test/rich-results).

## 6. Publicar (Vercel + dominio propio)

1. Subí el proyecto a GitHub.
2. En Vercel: **New Project → Import** el repo.
3. En **Settings → Environment Variables**, cargá las 3 variables de `.env.local`.
4. Deploy.
5. **Settings → Domains**: agregá tu dominio y seguí las instrucciones de DNS.

## 7. WhatsApp

En `src/components/Cotizador.tsx`, arriba, está la constante `NUMERO_WHATSAPP`. Poné tu número con código país y sin signos (ej: `"56912345678"`). El botón verde del resultado abre tu chat con el pedido ya escrito.

---

## Estructura

```
src/
  app/
    layout.tsx            Fuente, metadata base
    page.tsx              Home (lista de sitios)
    [slug]/page.tsx       Página por sitio: SEO + JSON-LD + cotizador + catálogo
    sitemap.ts, robots.ts SEO técnico
    globals.css           Estilos (el look del cotizador)
  components/
    Cotizador.tsx         Asistente paso a paso (client)
    CatalogoSEO.tsx       Tablas + FAQ indexables (server)
    JsonLd.tsx            Datos estructurados
  lib/
    sitios.ts             Datos + carga desde Supabase (con respaldo)
    precios.ts            Cálculo de precios
    supabase.ts           Cliente Supabase
    seo.ts                ⭐ Palabras clave y textos SEO
  types/sitio.ts          Tipos
supabase/
  schema.sql              Tablas + RLS
  seed.sql                Datos iniciales
```

## Modelo de precios

- **Diurno (06–00):** el precio guardado es **por horario**. Total = precio × cantidad de horarios elegidos.
- **Madrugada (00–06):** valor **plano** (6 subidas incluidas), no se multiplica.
