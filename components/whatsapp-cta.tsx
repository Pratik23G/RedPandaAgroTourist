import { cn } from "@/lib/utils";

const OFFICES = {
  tumling: { label: "Tumling Office", phone: "917063727464" },
  kathmandu: { label: "Kathmandu Office", phone: "9779823808506" },
} as const;

interface WhatsAppCtaProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  office?: keyof typeof OFFICES;
  message?: string;
}

export function WhatsAppCta({
  office = "tumling",
  message = "Hi! I'd like to know more about your red panda tour packages.",
  className,
  children,
  ...anchorProps
}: WhatsAppCtaProps) {
  const { phone } = OFFICES[office];
  const href = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "tap-target rounded-lg bg-forest-700 px-5 font-medium text-cream-50 transition-colors hover:bg-forest-600",
        className,
      )}
      {...anchorProps}
    >
      {children ?? "Chat on WhatsApp"}
    </a>
  );
}

export { OFFICES };
