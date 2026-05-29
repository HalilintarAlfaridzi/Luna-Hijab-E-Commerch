import { Instagram, Mail, MapPin, Phone } from "lucide-react";
import { Link } from "react-router-dom";

const footerLinks = [
  ["Shop", "/shop"],
  ["New Arrivals", "/new-arrivals"],
  ["Best Sellers", "/best-sellers"],
  ["FAQ", "/faq"],
  ["Contact", "/contact"],
];

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-linen bg-[#2B2118] text-white">
      <div className="section-shell grid gap-10 py-14 lg:grid-cols-[1.2fr_.8fr_.8fr]">
        <div>
          <div className="flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-sand font-display text-2xl font-bold text-ink">
              L
            </span>
            <div>
              <p className="font-display text-3xl font-bold">Luna Hijab</p>
              <p className="text-xs font-extrabold uppercase tracking-[0.28em] text-sand">
                Modern Daily Essentials
              </p>
            </div>
          </div>
          <p className="mt-5 max-w-md text-sm leading-7 text-white/70">
            Modern hijab brand with elegant daily essentials for confident muslim women.
            Built as a fullstack e-commerce portfolio with premium UX and realistic commerce flow.
          </p>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-extrabold uppercase tracking-[0.24em] text-sand">Navigation</h3>
          <div className="grid gap-3">
            {footerLinks.map(([label, to]) => (
              <Link key={to} to={to} className="text-sm font-semibold text-white/70 transition hover:text-white">
                {label}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-extrabold uppercase tracking-[0.24em] text-sand">Contact</h3>
          <div className="grid gap-3 text-sm text-white/70">
            <p className="flex items-center gap-3">
              <Phone size={16} /> +62 812 2605 2900
            </p>
            <p className="flex items-center gap-3">
              <Mail size={16} /> hello@lunahijab.id
            </p>
            <p className="flex items-center gap-3">
              <Instagram size={16} /> @lunahijab.studio
            </p>
            <p className="flex items-center gap-3">
              <MapPin size={16} /> Jakarta, Indonesia
            </p>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 py-5 text-center text-xs font-semibold text-white/50">
        (c) 2026 Luna Hijab. Portfolio demo, no real card payment stored.
      </div>
    </footer>
  );
}
