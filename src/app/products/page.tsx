import ProductsPageContent from "./ProductsPageContent";

export const dynamic = "force-dynamic";

interface ProductsPageProps {
  searchParams?: { category?: string; sort?: string; minPrice?: string; maxPrice?: string; page?: string };
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const categorySlug = searchParams?.category ?? null;
  return (
    <ProductsPageContent
      categorySlug={categorySlug}
      searchParams={searchParams}
    />
  );
}
