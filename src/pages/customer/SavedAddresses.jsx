import Button from "../../components/common/Button.jsx";
import Input from "../../components/common/Input.jsx";

const addresses = [
  {
    title: "Home",
    recipient: "Customer Demo",
    detail: "Jl. Melati No. 29, Jakarta Selatan, DKI Jakarta 12560",
    default: true,
  },
  {
    title: "Office",
    recipient: "Customer Demo",
    detail: "Jl. Sudirman Kav. 8, Jakarta Pusat, DKI Jakarta 10220",
    default: false,
  },
];

export default function SavedAddresses() {
  return (
    <div className="grid gap-6">
      <div className="grid gap-4 lg:grid-cols-2">
        {addresses.map((address) => (
          <div key={address.title} className="admin-card">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="font-display text-2xl font-bold text-ink">{address.title}</h2>
                <p className="mt-2 text-sm font-bold text-clay">{address.recipient}</p>
              </div>
              {address.default && (
                <span className="rounded-full bg-sage px-3 py-1 text-xs font-extrabold uppercase tracking-[0.16em] text-white">
                  Default
                </span>
              )}
            </div>
            <p className="mt-4 text-sm leading-7 text-muted">{address.detail}</p>
            <div className="mt-5 flex gap-2">
              <Button variant="secondary" size="sm">Edit</Button>
              <Button variant="ghost" size="sm">Delete</Button>
            </div>
          </div>
        ))}
      </div>

      <form className="admin-card">
        <h2 className="font-display text-3xl font-bold text-ink">Add Address</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <Input label="Recipient name" />
          <Input label="Phone" />
          <Input label="Province" />
          <Input label="City" />
          <Input label="District" />
          <Input label="Postal code" />
        </div>
        <label className="mt-4 block">
          <span className="mb-2 block text-sm font-bold text-ink">Full address</span>
          <textarea className="input-field min-h-28 resize-none" />
        </label>
        <Button className="mt-5">Save Address</Button>
      </form>
    </div>
  );
}
