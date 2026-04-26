import { Button } from "@/components/Button";

export default function ContactPage() {
  const mapUrl = process.env.NEXT_PUBLIC_GOOGLE_MAPS_EMBED_URL ?? "https://www.google.com/maps?q=Lusaka%2C%20Zambia&output=embed";
  return (
    <section className="mx-auto max-w-7xl px-4 py-14">
      <div className="grid gap-8 lg:grid-cols-2">
        <div>
          <h1 className="font-display text-5xl font-bold">Contact Us</h1>
          <p className="mt-3 text-cocoa/65">Place a special request, ask about catering, or confirm delivery coverage.</p>
          <form className="mt-8 grid gap-4">
            <input className="focus-ring rounded-md border border-cocoa/15 bg-white p-3" placeholder="Name" />
            <input className="focus-ring rounded-md border border-cocoa/15 bg-white p-3" placeholder="Email" type="email" />
            <textarea className="focus-ring rounded-md border border-cocoa/15 bg-white p-3" placeholder="Message" rows={5} />
            <Button type="button">Send Message</Button>
          </form>
        </div>
        <iframe title="The Cake Gallery location" src={mapUrl} className="min-h-[420px] w-full rounded-lg border-0 shadow-premium" loading="lazy" />
      </div>
    </section>
  );
}

