import { Instagram, Mail, MapPin, Phone } from "lucide-react";
import Button from "../../components/common/Button.jsx";
import Input from "../../components/common/Input.jsx";
import SectionHeader from "../../components/common/SectionHeader.jsx";

const contacts = [
  { label: "WhatsApp", value: "+62 812 2605 2900", icon: Phone },
  { label: "Email", value: "hello@lunahijab.id", icon: Mail },
  { label: "Instagram", value: "@lunahijab.studio", icon: Instagram },
  { label: "Address", value: "Jakarta, Indonesia", icon: MapPin },
];

export default function Contact() {
  return (
    <section className="section-shell py-10 sm:py-14">
      <SectionHeader
        eyebrow="Contact"
        title="Need help choosing a shade?"
        description="Contact page meniru kebutuhan toko fashion: konsultasi warna, pertanyaan order, dan dukungan customer."
      />
      <div className="grid gap-6 lg:grid-cols-[.8fr_1.2fr]">
        <div className="grid gap-4">
          {contacts.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.label} className="rounded-[2rem] border border-linen bg-white p-5 shadow-card">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-clay/10 text-clay">
                  <Icon size={20} />
                </div>
                <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-muted">{item.label}</p>
                <p className="mt-2 font-bold text-ink">{item.value}</p>
              </div>
            );
          })}
        </div>
        <form className="rounded-[2rem] border border-linen bg-white p-5 shadow-card sm:p-8">
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Full name" placeholder="Aisyah" />
            <Input label="Email" placeholder="aisyah@email.com" type="email" />
          </div>
          <label className="mt-4 block">
            <span className="mb-2 block text-sm font-bold text-ink">Message</span>
            <textarea
              className="input-field min-h-36 resize-none"
              placeholder="Saya ingin bertanya tentang warna hijab..."
            />
          </label>
          <Button className="mt-5" type="submit">
            Send Message
          </Button>
        </form>
      </div>
    </section>
  );
}
