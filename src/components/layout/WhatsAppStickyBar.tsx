import { WhatsAppButton } from "@/components/WhatsAppButton";
import type { Settings } from "@/lib/sanity/types";
import {
  GENERAL_WHATSAPP_MESSAGE,
  buildGeneralWhatsAppLink,
} from "@/lib/whatsapp";

type WhatsAppStickyBarProps = {
  settings: Settings | null;
};

export function WhatsAppStickyBar({ settings }: WhatsAppStickyBarProps) {
  if (!settings) {
    return null;
  }

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 mx-auto flex max-w-[1920px] gap-[10px] border-t border-line bg-paper/95 p-4 backdrop-blur-sm lg:hidden">
      <WhatsAppButton
        href={buildGeneralWhatsAppLink(
          settings.whatsappNumber,
          GENERAL_WHATSAPP_MESSAGE
        )}
        variant="primary"
        className="flex-1"
      >
        Consultar por WhatsApp
      </WhatsAppButton>
    </div>
  );
}
