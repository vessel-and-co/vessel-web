import { formatGuaranies } from "@/lib/format";

export type WhatsAppProductInfo = {
  name: string;
  brandName: string;
  productUrl: string;
  price: number;
};

export const GENERAL_WHATSAPP_MESSAGE =
  "Hola! Tengo una consulta sobre los perfumes de Vessel.";

const WHATSAPP_BASE_URL = "https://wa.me";

function sanitizeWhatsAppNumber(whatsappNumber: string): string {
  return whatsappNumber.replace(/\D/g, "");
}

function buildWhatsAppLink(whatsappNumber: string, message: string): string {
  const sanitizedNumber = sanitizeWhatsAppNumber(whatsappNumber);
  return `${WHATSAPP_BASE_URL}/${sanitizedNumber}?text=${encodeURIComponent(message)}`;
}

function buildAvailableProductMessage(product: WhatsAppProductInfo): string {
  return `Hola! Quiero consultar por ${product.name} de ${product.brandName} (ref. ${product.productUrl}), ${formatGuaranies(product.price)}. ¿Está disponible?`;
}

function buildSoldOutProductMessage(product: WhatsAppProductInfo): string {
  return `Hola! Vi que ${product.name} de ${product.brandName} (ref. ${product.productUrl}) está agotado. ¿Lo pueden conseguir bajo pedido?`;
}

export function buildAvailableProductWhatsAppLink(
  whatsappNumber: string,
  product: WhatsAppProductInfo
): string {
  return buildWhatsAppLink(
    whatsappNumber,
    buildAvailableProductMessage(product)
  );
}

export function buildSoldOutProductWhatsAppLink(
  whatsappNumber: string,
  product: WhatsAppProductInfo
): string {
  return buildWhatsAppLink(whatsappNumber, buildSoldOutProductMessage(product));
}

export function buildGeneralWhatsAppLink(
  whatsappNumber: string,
  message: string
): string {
  return buildWhatsAppLink(whatsappNumber, message);
}
