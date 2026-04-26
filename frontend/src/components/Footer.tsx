import Link from "next/link";
import { Facebook, Instagram, Mail, MapPin, Phone } from "lucide-react";

function TikTokIcon({ size = 20 }: { size?: number }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5.8 20.1a6.34 6.34 0 0 0 10.86-4.43V8.71a8.16 8.16 0 0 0 4.78 1.52V6.78a4.85 4.85 0 0 1-1.85-.09Z" />
    </svg>
  );
}

export function Footer() {
  return (
    <footer className="bg-cocoa text-cream">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 md:grid-cols-4">
        <div>
          <h2 className="font-display text-3xl font-bold">The Cake Gallery</h2>
          <p className="mt-3 text-sm text-cream/75">Luxury cakes, pastries and cooked meals prepared with care in Lusaka.</p>
        </div>
        <div>
          <h3 className="font-semibold">Explore</h3>
          <div className="mt-3 grid gap-2 text-sm text-cream/75">
            <Link href="/menu">Menu</Link>
            <Link href="/tracking">Track Order</Link>
            <Link href="/contact">Contact</Link>
          </div>
        </div>
        <div>
          <h3 className="font-semibold">Contact</h3>
          <div className="mt-3 grid gap-2 text-sm text-cream/75">
            <span className="flex items-center gap-2"><Phone size={16} /> +260 97 4063136</span>
            <span className="flex items-center gap-2"><Mail size={16} /> waka.bk29@gmail.com</span>
            <span className="flex items-center gap-2"><MapPin size={16} /> Lusaka, Zambia</span>
          </div>
        </div>
        <div>
          <h3 className="font-semibold">Newsletter</h3>
          <form className="mt-3 flex gap-2">
            <input className="min-w-0 flex-1 rounded-md border-0 px-3 py-2 text-cocoa" placeholder="Email address" type="email" />
            <button className="rounded-md bg-honey px-4 py-2 font-semibold text-cocoa">Join</button>
          </form>
          <div className="mt-4 flex gap-3">
            <a
              href="https://www.instagram.com/thecakegalleryzm?igsh=MXNvODFzeWpyMHpjNQ%3D%3D&utm_source=qr"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="hover:text-honey"
            >
              <Instagram />
            </a>
            <a
              href="https://www.facebook.com/share/17zThJZeYz/?mibextid=wwXIfr"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="hover:text-honey"
            >
              <Facebook />
            </a>
            <a
              href="https://www.tiktok.com/@ms_bk29?_r=1&_t=ZS-95rAm3hBRuU"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="TikTok"
              className="hover:text-honey"
            >
              <TikTokIcon size={24} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
