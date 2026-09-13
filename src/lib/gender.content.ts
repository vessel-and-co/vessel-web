import type { ProductGender } from "@/lib/sanity/types";

export type GenderPageSlug =
  "perfumes-masculinos" | "perfumes-femeninos" | "perfumes-unisex";

type GenderPageContent = {
  gender: ProductGender;
  title: string;
  text: string;
  metaDescription: string;
  emptyMessage: string;
};

// Contenido SEO fijo por genero. No viene de Sanity: son tres paginas de
// destino con copy propio, pensadas para rankear "perfumes masculinos/
// femeninos/unisex paraguay".
export const GENDER_PAGES: Record<GenderPageSlug, GenderPageContent> = {
  "perfumes-masculinos": {
    gender: "masculino",
    title: "Perfumes masculinos en Paraguay",
    text: "Perfumes masculinos elegidos con criterio, para el día a día y para las ocasiones que valen la pena. Trabajamos amaderados, aromáticos, cítricos y orientales: fragancias con carácter y buena duración, sin gastar de más. Cada perfume de esta selección lo probamos antes de traerlo. Elegí el tuyo y coordinamos la compra por WhatsApp, con envíos a todo el Paraguay.",
    metaDescription:
      "Perfumes masculinos elegidos con criterio, para el día a día y para las ocasiones que valen la pena.",
    emptyMessage:
      "Todavía no tenemos perfumes masculinos cargados en el catálogo. Escribinos por WhatsApp y te avisamos apenas sumemos alguno.",
  },
  "perfumes-femeninos": {
    gender: "femenino",
    title: "Perfumes femeninos en Paraguay",
    text: "Perfumes femeninos seleccionados uno por uno, de los frescos y florales a los más dulces y envolventes. Buscamos fragancias que se sientan bien puestas, que duren y que valgan lo que cuestan. Todo lo que ofrecemos lo probamos primero. Encontrá el que va con vos y cerramos por WhatsApp, con envíos a todo el país.",
    metaDescription:
      "Perfumes femeninos seleccionados uno por uno, de los frescos y florales a los más dulces y envolventes.",
    emptyMessage:
      "Todavía no tenemos perfumes femeninos cargados en el catálogo. Escribinos por WhatsApp y te avisamos apenas sumemos alguno.",
  },
  "perfumes-unisex": {
    gender: "unisex",
    title: "Perfumes unisex en Paraguay",
    text: "Perfumes unisex para quienes eligen por el aroma y no por la etiqueta. Amaderados, cítricos, especiados: fragancias versátiles que funcionan en cualquiera. Una selección corta y probada, sin relleno. Elegí el tuyo y lo coordinamos por WhatsApp, con envíos a todo el Paraguay.",
    metaDescription:
      "Perfumes unisex para quienes eligen por el aroma y no por la etiqueta.",
    emptyMessage:
      "Todavía no tenemos perfumes unisex cargados en el catálogo. Escribinos por WhatsApp y te avisamos apenas sumemos alguno.",
  },
};
