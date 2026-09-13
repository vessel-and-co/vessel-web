import { createClient } from "next-sanity";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION;
const token = process.env.SANITY_API_READ_TOKEN;

if (!projectId || !dataset || !apiVersion || !token) {
  throw new Error(
    "Faltan variables de entorno de Sanity. Revisa NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET, NEXT_PUBLIC_SANITY_API_VERSION y SANITY_API_READ_TOKEN en .env.local."
  );
}

export const sanityClient = createClient({
  projectId,
  dataset,
  apiVersion,
  token,
  // El dataset staging es privado: el token de lectura es obligatorio y no
  // podemos servir desde la CDN de Sanity (no soporta datasets privados).
  useCdn: false,
  // Nunca mostrar borradores en el sitio publico.
  perspective: "published",
});
