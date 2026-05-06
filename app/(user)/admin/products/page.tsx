import { ProductsContent } from "./ProductsContent";
import {
  getCategories,
  getRubriques,
  getPromotions,
  getProducts,
} from "./actions";
import { redirect } from "next/navigation";

export default async function ProductsPage() {
  const [categories, rubriques, promotions, products] = await Promise.all([
    getCategories(),
    getRubriques(),
    getPromotions(),
    getProducts(),
  ]);
  if (
    categories === null ||
    rubriques === null ||
    promotions === null ||
    products === null
  )
    redirect("/");

  const serializedProducts = products.map((p) => ({
    ...p,
    price: Number(p.price),
  }));

  return (
    <ProductsContent
      categories={categories}
      rubriques={rubriques}
      promotions={promotions}
      products={serializedProducts}
    />
  );
}
