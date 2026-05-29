import { useEffect, useState } from "react";
import { getCategories, getProducts } from "../services/productService.js";

export function useProducts(filters = {}) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;

    async function loadData() {
      try {
        setLoading(true);
        const [productData, categoryData] = await Promise.all([
          getProducts(filters),
          getCategories(),
        ]);
        if (!active) return;
        setProducts(productData);
        setCategories(categoryData);
      } catch (caughtError) {
        if (active) setError(caughtError);
      } finally {
        if (active) setLoading(false);
      }
    }

    loadData();

    return () => {
      active = false;
    };
  }, [filters.category, filters.search, filters.sort, filters.featured, filters.bestSeller, filters.newest]);

  return { products, categories, loading, error };
}
