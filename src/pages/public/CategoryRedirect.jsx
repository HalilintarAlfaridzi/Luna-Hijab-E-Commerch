import { Navigate, useParams } from "react-router-dom";

export default function CategoryRedirect() {
  const { slug } = useParams();
  return <Navigate to={`/shop?category=${slug}`} replace />;
}
