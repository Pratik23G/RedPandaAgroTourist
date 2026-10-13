import { MessageCircle } from "lucide-react";
import { WhatsAppCta } from "@/components/whatsapp-cta";

export function WhatsAppFloatingButton() {
  return (
    <div
      className="fixed bottom-[max(1rem,env(safe-area-inset-bottom))] right-[max(1rem,env(safe-area-inset-right))] z-50"
      data-wa-label="floating"
    >
      <WhatsAppCta
        className="h-12 w-12 rounded-full px-0 text-sm shadow-lg ring-2 ring-cream-50 sm:h-auto sm:w-auto sm:rounded-lg sm:px-5 sm:text-base"
        aria-label="Chat with us on WhatsApp"
      >
        <MessageCircle aria-hidden className="h-6 w-6 sm:hidden" />
        <span className="sr-only sm:not-sr-only">Chat on WhatsApp</span>
      </WhatsAppCta>
    </div>
  );
}
