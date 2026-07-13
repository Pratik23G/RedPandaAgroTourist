import { WhatsAppCta } from "@/components/whatsapp-cta";

export function WhatsAppFloatingButton() {
  return (
    <div className="fixed bottom-4 right-4 z-50">
      <WhatsAppCta className="shadow-lg" aria-label="Chat with us on WhatsApp">
        Chat on WhatsApp
      </WhatsAppCta>
    </div>
  );
}
