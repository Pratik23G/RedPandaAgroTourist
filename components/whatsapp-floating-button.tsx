import { WhatsAppCta } from "@/components/whatsapp-cta";

export function WhatsAppFloatingButton() {
  return (
    <div className="fixed bottom-[max(1rem,env(safe-area-inset-bottom))] right-[max(1rem,env(safe-area-inset-right))] z-50" data-wa-label="floating">
      <WhatsAppCta className="shadow-lg text-sm sm:text-base" aria-label="Chat with us on WhatsApp">
        Chat on WhatsApp
      </WhatsAppCta>
    </div>
  );
}
