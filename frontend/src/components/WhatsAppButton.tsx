import { MessageCircle } from "lucide-react";

export function WhatsAppButton() {
  const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "260974063136";
  return (
    <a
      href={`https://wa.me/${number}?text=Hello%20The%20Cake%20Gallery%2C%20I%20would%20like%20to%20place%20an%20order.`}
      className="fixed bottom-5 right-5 z-40 inline-flex h-14 w-14 items-center justify-center rounded-full bg-basil text-white shadow-premium"
      aria-label="Quick order on WhatsApp"
    >
      <MessageCircle />
    </a>
  );
}

