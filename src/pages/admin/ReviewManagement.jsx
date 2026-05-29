import Badge from "../../components/common/Badge.jsx";
import Button from "../../components/common/Button.jsx";
import { reviews } from "../../data/mockData.js";

export default function ReviewManagement() {
  return (
    <div className="grid gap-4">
      {reviews.map((review) => (
        <article key={review.id} className="admin-card">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
            <div>
              <div className="mb-3 flex items-center gap-2">
                <h2 className="font-display text-2xl font-bold text-ink">{review.name}</h2>
                <Badge tone="success">Approved</Badge>
              </div>
              <p className="text-sm leading-7 text-muted">{review.comment}</p>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="secondary">Hide</Button>
              <Button size="sm" variant="ghost">Delete</Button>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
