# AGENTS.md - vessel-web

Documentacion de contexto para agentes de IA (Claude Code, GitHub Copilot, etc.)
que trabajen en este repositorio.

Version: 1.0
Rama de trabajo por defecto: main

---

## 1. Que es este repo

`vessel-web` es la tienda publica de Vessel Perfumes: el sitio Next.js que ven
los clientes. Consume el contenido del CMS (Sanity) por su API y cierra las
ventas por WhatsApp.

- Es el front publico. NO es el panel de administracion.
- El contenido (perfumes, marcas, categorias, paginas) vive en Sanity, en un
  proyecto y repo aparte (`vessel-cms`, Studio en `vessel.sanity.studio`). Este
  repo solo LEE de Sanity. No se edita el schema desde aca.
- No hay backend propio, ni base de datos, ni autenticacion de clientes.

## 2. Que es Vessel

Marca de retail de perfumeria para el mercado paraguayo. MVP sin pagos ni
carrito en el sitio: el cliente elige un perfume y el sitio lo lleva al WhatsApp
del negocio para cerrar la venta.

El objetivo numero uno del proyecto es SEO: rankear busquedas como "perfumes
paraguay", "perfumes arabes paraguay", "[marca] paraguay". Toda decision tecnica
se subordina a eso. El cuello de botella del negocio no es tecnico; es
validacion de mercado, margenes y adquisicion de clientes.

## 3. Stack tecnologico

Deliberadamente minimo. Cada dependencia que no esta aca fue descartada a
proposito.

- Next.js (App Router) en la version estable mas reciente
- TypeScript
- React
- pnpm
- Tailwind CSS (version estable mas reciente)
- Cliente de Sanity (`next-sanity`, `@sanity/image-url`) para leer contenido

Deliberadamente NO se usa (no instalar sin discutirlo primero):

- shadcn/ui ni Radix. El diseno se implementa con Tailwind puro. Los pocos
  componentes interactivos (drawer de filtros, acordeon de FAQ, galeria de la
  ficha) se hacen con React state local, sin libreria.
- TanStack Query, Axios, ni ningun cliente de fetching de cliente. El catalogo
  entra por el servidor (ISR). No hay fetching de datos en el cliente.
- NextAuth ni autenticacion. El cliente no se loguea.
- Zustand ni estado global. El poco estado que hay (drawer abierto, filtro
  activo) es local al componente.
- Carrito, checkout, pasarela de pago, ordenes. La venta es por WhatsApp.

Si una tarea parece necesitar una de estas, es casi seguro senal de que la
solucion esta sobredimensionada. Proponer la alternativa simple antes de
instalar nada.

## 4. SEO es la prioridad uno (leer antes de tocar cualquier pagina)

El SEO no es una feature al final; es la razon del proyecto. Reglas duras:

### Renderizado

- Las paginas de contenido (home, producto, marca, genero, paginas
  informativas) son SERVER COMPONENTS con ISR. HTML estatico servido desde el
  edge de Vercel, no JS que Google tenga que ejecutar.
- Usar `generateStaticParams` para pre-generar las rutas dinamicas (productos,
  marcas) en build.
- `export const revalidate = <segundos>` para ISR. Un valor del orden de una
  hora esta bien para el MVP.

### Server vs client (regla critica)

- Por defecto TODO es server component. Solo se marca `"use client"` la pieza
  interactiva concreta que lo necesita (el drawer de filtros, el acordeon, la
  galeria), y esa pieza va AISLADA como un componente chico dentro de una pagina
  que sigue siendo server.
- NUNCA convertir una pagina entera en client component para que "funcione" un
  componente interactivo. Eso mata el SEO. Se aisla el trozo interactivo, no se
  cliente-iza la pagina.

### Metadata

- Cada pagina exporta `generateMetadata` con `title`, `description` y
  `openGraph` propios, generados a partir de los datos. Una pagina sin metadata
  propia rankea mal y muestra preview vacia al compartir por WhatsApp/Instagram.
- La imagen de OpenGraph debe ser PNG o JPG con dimensiones estandar
  (1200x630). No usar SVG para OG (varias plataformas no lo renderizan).

### Datos estructurados

- Cada ficha de producto incluye JSON-LD `schema.org/Product` (nombre, marca,
  precio, disponibilidad). Esto hace que Google muestre precio y stock en el
  resultado de busqueda. La competencia local no lo tiene: es diferenciador.

### Sitemap y robots

- `app/sitemap.ts` genera el sitemap dinamico desde los productos, marcas y
  categorias visibles de Sanity.
- `app/robots.ts` genera el robots.txt.
- Un producto con `visible === false` NO va al sitemap, ni se genera su pagina
  estatica, ni aparece en listados. Los tres lugares, o se rompe: si esta en el
  sitemap pero no existe la pagina, le decimos a Google que indexe un 404.

### Contenido

- Ningun schema da SEO por si solo: el modelo habilita, el contenido rankea.
  Las descripciones de producto, marca y categoria deben tener texto real. No
  inventar contenido; si falta, dejar el campo y avisar, no rellenar con
  placeholder.

## 5. Datos: consumo de Sanity

- Proyecto Sanity (`projectId`) y `dataset` se leen de variables de entorno con
  prefijo `NEXT_PUBLIC_` (el front las necesita en el browser para las URLs de
  imagen). El `projectId` de Sanity es publico por diseno; no es un secreto y no
  hay que ocultarlo.
- Las queries se escriben en GROQ, centralizadas en `src/lib/sanity/` (cliente +
  queries), no dispersas por los componentes.
- Las imagenes se sirven con el builder de Sanity (`@sanity/image-url`),
  pidiendo el tamano y formato adecuados por render. No servir la imagen
  original sin dimensionar.
- El modelo de datos (los tipos y campos) es fuente de verdad de `vessel-cms`,
  no de este repo. Ver el documento de modelado del CMS si hay dudas de que
  campos existen. Los tipos que consume el front deben reflejar ese modelo.

Entidades que se consumen: `product`, `brand`, `category`, `page`, `settings`.
`settings` es un singleton (numero de WhatsApp, instagram, tagline, contacto):
leerlo una vez y usarlo; el numero de WhatsApp NUNCA se hardcodea en el codigo,
viene de `settings`.

## 6. Estados de producto y reglas de negocio

Cada producto tiene dos ejes independientes que NO son lo mismo:

- `available` (bool): hay stock ahora. Si es `false`, el producto se muestra
  igual, marcado como agotado.
- `visible` (bool): existe en el sitio. Si es `false`, no aparece en ningun
  lado (ni listado, ni sitemap, ni pagina). Es el borrador. Default `false` en
  el CMS.

Reglas:

- Producto agotado (`available: false`) NO se oculta. Se muestra en la
  coleccion y tiene su ficha. Sirve para medir demanda (analytics sobre quien
  entra a verlo) y ademas se puede pedir BAJO PEDIDO.
- Bajo pedido: en el MVP, todo producto agotado se ofrece bajo pedido por
  defecto (no hay campo que lo distinga). Decision de negocio tomada por los
  socios. Si en el futuro aparecen agotados que no se pueden conseguir, se
  agregara un campo para distinguirlos; hasta entonces, no modelar esa
  distincion.
- `usedInVideo` (bool) + `videoUrl`: algunos productos son una unidad especifica
  que aparecio en un video. Cuando `usedInVideo` es `true`, el video se muestra
  como contenido DESTACADO en la ficha (alto, visible), no como nota al pie.

## 7. WhatsApp reemplaza el carrito

- No hay carrito ni checkout. Cada producto tiene un boton que abre WhatsApp con
  un mensaje pre-cargado, usando el numero de `settings`.
- Formato del link: `https://wa.me/<numero>?text=<mensaje URL-encodeado>`. No se
  usa la API de WhatsApp Business; es un link `wa.me` simple.
- El mensaje cambia segun el estado del producto (dos plantillas):
  - Disponible: consulta de compra normal, con nombre, marca, referencia
    (URL de la ficha) y precio del producto. No hay campo SKU en el modelo
    de datos; si se agrega en el futuro, actualizar esta seccion y el
    generador del mensaje.
  - Agotado (bajo pedido): mensaje que indica que el producto esta agotado y
    pregunta si se puede conseguir bajo pedido.
- El generador del link vive en un helper unico (`src/lib/whatsapp.ts`), no
  repetido por los componentes.

## 8. Diseno y UI

- El diseno de referencia existe como HTML/CSS (mobile + desktop responsive).
  Implementarlo con Tailwind, respetando el layout, el breakpoint mobile/desktop
  y el comportamiento de los interactivos (drawer de filtros como bottom sheet
  en movil, acordeon de FAQ, galeria de la ficha).
- Colores de marca (definir en la config de Tailwind como tokens del tema):
  - verde de fondo: `#143324`
  - dorado: `#c59f55`
  - blanco: `#ffffff`
- Mobile-first SIEMPRE. Disenar para movil primero (el trafico es mayormente
  movil) y expandir con los breakpoints de Tailwind (`sm:`, `md:`, `lg:`).
- Los componentes son estrictamente visuales cuando se puede. La logica de un
  interactivo (estado del drawer, del acordeon) va en el componente client
  aislado, no derramada por la pagina server.

### Filtros y busqueda

- La coleccion muestra todos los productos y permite filtrar por precio y
  genero, mas un buscador por nombre y marca.
- El filtro y el buscador operan sobre los datos YA cargados por el servidor
  (estado local). NO hacen fetching a Sanity en el cliente.
- OJO SEO: un filtro que solo reordena en pantalla no genera URL indexable. Las
  paginas con URL propia (marca, genero) son las que rankean. El filtro
  interactivo es para experiencia de usuario, no sustituye a esas paginas. No
  confundir "filtro bonito" con "pagina que Google indexa".

## 9. Convenciones de codigo

### TypeScript

- SIEMPRE `type` sobre `interface`.
- SIEMPRE `??` sobre `||` para defaults (maneja `0` y `""` correctamente).
- Path aliases con `@/`.

### Nombres de archivo

- Punto como separador, no guion: `sanity.client.ts`, `product.query.ts`,
  `whatsapp.ts`. No `sanity-client.ts`.

### Carpetas privadas en app/

- Cualquier carpeta dentro de `app/` que NO sea una ruta lleva prefijo `__`
  (doble guion bajo): `__components`, `__lib`, `__hooks`, `__utils`. Sin el
  prefijo, Next.js la trata como segmento de ruta.
- Criterio: componentes visuales privados de una ruta en `__components`; hooks
  con estado/efectos en `__hooks`; funciones puras en `__utils`. Si algo se usa
  en 2+ rutas, mover a `src/lib/`.

### Numeros magicos y naming

- Sin numeros magicos: toda literal numerica no obvia va a una constante
  nombrada a nivel de modulo (`const REVALIDATE_SECONDS = 3600`).
- Sin variables de un solo caracter salvo `i`/`j` de loop y `_` para parametros
  ignorados. `const dayOfWeek = ...`, no `const d = ...`.
- Para fecha/hora usar `date-fns` (`startOfDay`, `format`, `addDays`), no
  manipulacion manual con `setHours`/`slice`.

### Componentes

- Revisar `src/components/` y los `__components/` de la ruta antes de escribir
  un componente nuevo. No reescribir lo que ya existe.
- No instalar librerias de UI. El diseno se hace con Tailwind. Si algo parece
  necesitar una libreria, proponerlo y explicar por que antes de instalar.

### Formateo

- Ejecutar el formateo (`pnpm format` o el script configurado) despues de cada
  edicion. Comillas dobles. Correr la suite de checks antes de push.

## 10. Estructura de directorios (orientativa)

```
src/
  app/
    layout.tsx              # layout raiz, fuentes, metadata base
    page.tsx                # HOME (server, ISR)
    sitemap.ts              # sitemap dinamico
    robots.ts               # robots.txt
    perfumes/
      [slug]/
        page.tsx            # ficha (server, ISR, generateStaticParams, JSON-LD)
        __components/       # galeria, video (client aislado donde haga falta)
    marcas/
      [slug]/
        page.tsx            # pagina de marca (server, ISR)
    (paginas)/              # paginas informativas (nosotros, envios, faq, etc.)
    coleccion/
      page.tsx              # listado (server) + filtros/buscador (client aislado)
      __components/         # drawer de filtros, grilla
  components/               # componentes compartidos (Card, WhatsAppButton, etc.)
  lib/
    sanity/                 # cliente + queries GROQ
    whatsapp.ts             # generador del link wa.me
```

Las paginas de genero (masculino/femenino/unisex) se arman filtrando por el
campo `gender`; su texto SEO puede vivir en codigo o en `settings`. Las paginas
de categoria se difieren (el campo existe, la pagina se construye mas adelante).

## 11. Fuera del alcance (decisiones explicitas de NO hacer)

- Login/registro de clientes. La venta es por WhatsApp.
- Carrito, checkout, pagos.
- Ordenes o pedidos como entidad en el front.
- Fetching de datos en el cliente (TanStack Query, SWR, Axios).
- Estado global (Zustand, Redux).
- Librerias de componentes (shadcn, Radix, MUI).
- Paginas de categoria (diferidas; el campo se consume, la pagina no se
  construye todavia).

## 12. Tabla de decisiones rapidas

| Pregunta                                     | Respuesta                                            | Razon                                                    |
| -------------------------------------------- | ---------------------------------------------------- | -------------------------------------------------------- |
| Una pagina de contenido, server o client     | Server component con ISR                             | Es el SEO; el HTML estatico es lo que Google indexa      |
| Un componente interactivo (drawer, acordeon) | Client component chico y aislado                     | Se cliente-iza el trozo, nunca la pagina entera          |
| Fetching de catalogo                         | En el servidor (ISR), nunca en el cliente            | El cliente no hace fetching; mata el SEO y no hace falta |
| Necesito cache/refetch de datos              | No aplica                                            | Sin TanStack Query; el dato entra por el servidor        |
| Filtro por genero/precio                     | Estado local sobre datos ya cargados                 | El filtro no pide a Sanity en el cliente                 |
| Numero de WhatsApp                           | Desde `settings` de Sanity                           | Nunca hardcodear; cambia sin redeploy                    |
| Producto agotado                             | Se muestra, sin compra directa, ofrecido bajo pedido | Mide demanda y permite venta puntual                     |
| Producto invisible (`visible:false`)         | Fuera de listado, sitemap y generacion estatica      | Los tres lugares o se rompe el SEO                       |
| Imagen de OpenGraph                          | PNG/JPG 1200x630, no SVG                             | Varias plataformas no renderizan SVG como OG             |
| type o interface                             | Siempre `type`                                       | Convencion del proyecto                                  |
| ?? o pipe-pipe                               | Siempre `??`                                         | El OR trata `0`/`""` como falsy                          |
| Necesito una libreria de UI                  | Preguntar antes; por defecto no                      | El diseno se hace con Tailwind puro                      |
| Numero literal en el codigo                  | Constante nombrada a nivel de modulo                 | Sin numeros magicos                                      |
| Variable de un caracter                      | Solo `i`/`j` de loop y `_`                           | Nombres descriptivos siempre                             |
| Fecha/hora                                   | `date-fns`                                           | No manipular con `setHours`/`slice`                      |
| Carpeta no-ruta en `app/`                    | Prefijo `__`                                         | Sin el prefijo Next la trata como ruta                   |
| Nombre de archivo                            | Punto como separador                                 | `product.query.ts`, no `product-query.ts`                |

## 13. Reglas de oro

1. El SEO es la prioridad uno. Ante cualquier duda, la opcion que preserva el
   server rendering y la indexabilidad gana.
2. Paginas de contenido: server components con ISR, `generateStaticParams`,
   `generateMetadata` y JSON-LD en las fichas.
3. NUNCA cliente-izar una pagina entera por un componente interactivo. Aislar el
   trozo interactivo.
4. Sin fetching de datos en el cliente. El catalogo entra por el servidor.
5. Stack minimo: Next + Tailwind + cliente de Sanity. No instalar shadcn, Query,
   Axios, NextAuth ni estado global sin discutirlo.
6. El diseno se implementa con Tailwind puro, mobile-first, respetando el HTML
   de referencia y los colores de marca.
7. `visible === false` se respeta en listado, sitemap y generacion estatica.
8. Producto agotado se muestra, mide demanda y se ofrece bajo pedido.
9. El numero de WhatsApp y demas config vienen de `settings`, nunca hardcodeados.
10. Convenciones: `type` sobre `interface`, `??` sobre el OR, archivos con punto,
    carpetas `__` para no-rutas, sin numeros magicos, sin variables de un
    caracter, `date-fns` para fechas.
11. Revisar componentes existentes antes de crear. Ejecutar el formateo despues
    de cada edicion y la suite de checks antes de push.
12. El modelo de datos es fuente de verdad de `vessel-cms`. Este repo solo lee.
13. Actualizar este archivo cuando se agregue una convencion o decision
    arquitectural relevante.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
