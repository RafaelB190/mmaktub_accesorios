import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { whatsappLink } from "@/lib/config";

export function WhatsAppBubble() {
  const link = whatsappLink();

  if (!link) return null;

  return (
    <a
      href={link}
      target="_blank"
      rel="noreferrer"
      aria-label="Escribinos por WhatsApp"
      className="group fixed bottom-5 right-5 z-40 flex items-center gap-3 rounded-full bg-[#25D366] p-3.5 text-white shadow-[0_10px_30px_rgba(37,211,102,0.35)] transition-transform duration-200 hover:scale-105 sm:bottom-7 sm:right-7"
    >
      <WhatsAppIcon className="h-6 w-6" />
      <span className="hidden max-w-0 overflow-hidden whitespace-nowrap text-sm font-medium transition-all duration-300 group-hover:max-w-40 group-hover:pr-2 sm:block">
        ¿Te ayudo?
      </span>
      <span className="absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full border-2 border-cream bg-clay" />
    </a>
  );
}
