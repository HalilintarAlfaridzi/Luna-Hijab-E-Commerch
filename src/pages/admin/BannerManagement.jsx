import Button from "../../components/common/Button.jsx";
import Input from "../../components/common/Input.jsx";

const banners = [
  ["Homepage Hero", "hero", "Active", "Modern Hijab for Everyday Elegance"],
  ["Shop Promo", "shop", "Scheduled", "Free shipping over Rp250.000"],
  ["Flash Sale", "promo", "Inactive", "Weekend Soft Shade Deals"],
];

export default function BannerManagement() {
  return (
    <div className="grid gap-6 xl:grid-cols-[360px_1fr]">
      <form className="admin-card">
        <h2 className="font-display text-3xl font-bold text-ink">Create Banner</h2>
        <div className="mt-5 grid gap-4">
          <Input label="Title" />
          <Input label="Placement" placeholder="hero / shop / promo" />
          <Input label="Link URL" />
          <Input label="Sort order" type="number" />
        </div>
        <Button className="mt-5 w-full">Save Banner</Button>
      </form>
      <div className="grid gap-4">
        {banners.map(([title, placement, status, subtitle]) => (
          <div key={title} className="admin-card">
            <div className="mb-4 h-40 rounded-[1.5rem] bg-linen-radial" />
            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
              <div>
                <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-clay">{placement}</p>
                <h2 className="font-display text-3xl font-bold text-ink">{title}</h2>
                <p className="text-sm text-muted">{subtitle}</p>
              </div>
              <span className="rounded-full bg-ivory px-4 py-2 text-sm font-bold text-muted">{status}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
