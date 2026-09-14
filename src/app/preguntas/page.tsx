import type { Metadata } from "next";

import {
  FaqAccordion,
  type FaqItem,
} from "@/app/preguntas/__components/FaqAccordion";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { getSettings } from "@/lib/sanity/settings.query";
import {
  GENERAL_WHATSAPP_MESSAGE,
  buildGeneralWhatsAppLink,
} from "@/lib/whatsapp";

// Next.js exige que `revalidate` sea un literal (no acepta una referencia a
// una constante del modulo): 3600s = 1 hora, valor razonable para el MVP.
export const revalidate = 3600;

const TITLE = "Preguntas frecuentes";
const DESCRIPTION =
  "Respuestas rápidas sobre cómo comprar sin carrito, pagar, recibir tu pedido y más en Vessel Perfumes.";

const FAQ_ITEMS: FaqItem[] = [
  {
    question: "¿Cómo compro si no hay carrito?",
    answer:
      'Elegís el perfume acá y tocás "Consultar por WhatsApp". Se abre el chat con el producto ya cargado. Ahí coordinamos pago y envío.',
  },
  {
    question: "¿Los perfumes son originales?",
    answer:
      "Sí, todos. Trabajamos solo con productos auténticos y probamos todo lo que traemos.",
  },
  {
    question: "¿Cuánto tarda el envío?",
    answer:
      "Depende de tu ubicación. Te confirmamos tiempo y costo por WhatsApp antes de que pagues.",
  },
  {
    question: "¿Puedo probar antes de comprar?",
    answer:
      "No vendemos fraccionado, pero antes de que compres te ayudamos por WhatsApp: contanos qué usás hoy y te decimos si este te va a gustar.",
  },
  {
    question: "¿Qué pasa si el perfume está agotado?",
    answer:
      'Queda igual en la colección. Lo conseguimos bajo pedido: tocás "Hacer pedido" y coordinamos plazo y pago por WhatsApp antes de que confirmes.',
  },
  {
    question: "¿Cómo pago?",
    answer:
      "Por transferencia bancaria. Coordinamos los detalles por WhatsApp al cerrar la compra.",
  },
  {
    question: "¿Hacen envoltura para regalo?",
    answer:
      "Sí, cuidamos cómo llega cada pedido. Si es regalo, avisanos y lo preparamos para eso.",
  },
];

export function generateMetadata(): Metadata {
  return {
    title: TITLE,
    description: DESCRIPTION,
    openGraph: {
      title: TITLE,
      description: DESCRIPTION,
      images: ["/og.png"],
    },
  };
}

export default async function PreguntasPage() {
  const settings = await getSettings();
  const whatsappHref = settings
    ? buildGeneralWhatsAppLink(
        settings.whatsappNumber,
        GENERAL_WHATSAPP_MESSAGE
      )
    : null;

  return (
    <div className="mx-auto max-w-[760px] px-10 py-11 lg:px-16 lg:py-[72px]">
      <p className="text-xs tracking-[0.14em] text-ink-3 uppercase">
        Preguntas
      </p>
      <div className="mt-4 mb-4 h-px w-11 bg-brand-gold" />
      <h1 className="font-serif text-[38px] leading-[1.05] font-normal text-brand-green lg:text-[52px]">
        Lo que nos preguntan <em className="italic">siempre</em>
      </h1>
      <p className="mt-7 text-[15px] leading-relaxed text-ink-2">
        Si tu duda no está acá, escribinos: contestamos rápido y sin vueltas.
      </p>

      <FaqAccordion items={FAQ_ITEMS} />

      {whatsappHref ? (
        <div className="mt-10 rounded-lg bg-paper-2 px-6 py-8 lg:px-8">
          <h3 className="font-serif text-2xl text-brand-green">
            ¿Quedó algo sin responder?
          </h3>
          <p className="mt-3 max-w-[44ch] text-[15px] leading-relaxed text-ink-2">
            Escribinos y te contestamos en el día. Si no sabés qué elegir,
            contanos qué perfume usás hoy y arrancamos de ahí.
          </p>
          <WhatsAppButton href={whatsappHref} className="mt-5">
            Escribinos por WhatsApp
          </WhatsAppButton>
        </div>
      ) : null}
    </div>
  );
}
