import { prisma } from "@/lib/prisma";
import type { Product, Category } from "@/lib/data";

const HAS_DATABASE_URL = !!process.env.DATABASE_URL;

function parseProduct(dbProduct: {
  id: string;
  slug: string;
  productCode: string | null;
  name: string;
  priceCents: number;
  compareAtCents: number | null;
  rating: number;
  reviewCount: number;
  images: string;
  category: { slug: string };
  tags: string;
  shortDesc: string;
  longDesc: string | null;
  ingredients: string | null;
  howToUse: string | null;
  stock: number;
}): Product {
  return {
    id: dbProduct.id,
    slug: dbProduct.slug,
    productCode: dbProduct.productCode ?? undefined,
    name: dbProduct.name,
    price: dbProduct.priceCents / 100,
    compareAt: dbProduct.compareAtCents ? dbProduct.compareAtCents / 100 : undefined,
    rating: dbProduct.rating,
    reviewCount: dbProduct.reviewCount,
    images: JSON.parse(dbProduct.images) as string[],
    category: dbProduct.category.slug,
    tags: JSON.parse(dbProduct.tags) as string[],
    shortDesc: dbProduct.shortDesc,
    longDesc: dbProduct.longDesc ?? undefined,
    ingredients: dbProduct.ingredients ?? undefined,
    howToUse: dbProduct.howToUse ?? undefined,
    stock: dbProduct.stock,
  };
}

export async function getProducts(): Promise<Product[]> {
  if (!HAS_DATABASE_URL) return [];

  const dbProducts = await (prisma as any).product.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      category: {
        select: { slug: true },
      },
    },
  }) as Array<{
    id: string;
    slug: string;
    productCode: string | null;
    name: string;
    priceCents: number;
    compareAtCents: number | null;
    rating: number;
    reviewCount: number;
    images: string;
    tags: string;
    shortDesc: string;
    longDesc: string | null;
    ingredients: string | null;
    howToUse: string | null;
    stock: number;
    trackInventory?: boolean;
    badge: string | null;
    category?: { slug: string } | null;
  }>;

  return dbProducts.map((p) =>
    parseProduct({
      id: p.id,
      slug: p.slug,
      productCode: p.productCode,
      name: p.name,
      priceCents: p.priceCents,
      compareAtCents: p.compareAtCents,
      rating: p.rating,
      reviewCount: p.reviewCount,
      images: p.images,
      category: { slug: p.category?.slug || "" },
      tags: p.tags,
      shortDesc: p.shortDesc,
      longDesc: p.longDesc,
      ingredients: p.ingredients,
      howToUse: p.howToUse,
      stock: p.stock,
    })
  );
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  if (!HAS_DATABASE_URL) return null;

  const p = await (prisma as any).product.findUnique({
    where: { slug },
    include: {
      category: { select: { slug: true } },
      attributes: true,
      variations: true,
    },
  }) as ({
    id: string;
    slug: string;
    productCode: string | null;
    name: string;
    priceCents: number;
    compareAtCents: number | null;
    rating: number;
    reviewCount: number;
    images: string;
    tags: string;
    shortDesc: string;
    longDesc: string | null;
    ingredients: string | null;
    howToUse: string | null;
    stock: number;
    trackInventory?: boolean;
    badge: string | null;
    category?: { slug: string } | null;
    attributes: Array<{ id: string; name: string; values: string }>;
    variations: Array<{
      id: string;
      attributes: string;
      priceCents: number | null;
      stock: number;
      sku: string | null;
      images: string | null;
    }>;
  } | null);

  if (!p) return null;

  const product: Product = {
    id: p.id,
    slug: p.slug,
    productCode: p.productCode ?? undefined,
    name: p.name,
    price: p.priceCents / 100,
    compareAt: p.compareAtCents ? p.compareAtCents / 100 : undefined,
    rating: p.rating,
    reviewCount: p.reviewCount,
    images: JSON.parse(p.images) as string[],
    category: p.category?.slug || "",
    tags: JSON.parse(p.tags) as string[],
    shortDesc: p.shortDesc,
    longDesc: p.longDesc ?? undefined,
    ingredients: p.ingredients ?? undefined,
    howToUse: p.howToUse ?? undefined,
    stock: p.stock,
    trackInventory: p.trackInventory !== false,
    badge: p.badge ?? undefined,
  };

  if (p.attributes.length > 0) {
    product.attributes = p.attributes.map((a) => ({
      id: a.id,
      name: a.name,
      values: JSON.parse(a.values) as string[],
    }));
  }

  if (p.variations.length > 0) {
    product.variations = p.variations.map((v) => ({
      id: v.id,
      attributes: JSON.parse(v.attributes) as Record<string, string>,
      price: v.priceCents ? v.priceCents / 100 : null,
      stock: v.stock,
      sku: v.sku ?? null,
      images: v.images ? (JSON.parse(v.images) as string[]) : null,
    }));
  }

  return product;
}

export async function getFeaturedProducts(limit = 3): Promise<Product[]> {
  if (!HAS_DATABASE_URL) return [];

  const dbProducts = await (prisma as any).product.findMany({
    orderBy: { createdAt: "desc" },
    take: limit,
    include: {
      category: {
        select: { slug: true },
      },
    },
  }) as Array<{
    id: string;
    slug: string;
    productCode: string | null;
    name: string;
    priceCents: number;
    compareAtCents: number | null;
    rating: number;
    reviewCount: number;
    images: string;
    tags: string;
    shortDesc: string;
    longDesc: string | null;
    ingredients: string | null;
    howToUse: string | null;
    stock: number;
    trackInventory?: boolean;
    badge: string | null;
    category?: { slug: string } | null;
  }>;

  return dbProducts.map((p) => ({
    id: p.id,
    slug: p.slug,
    productCode: p.productCode ?? undefined,
    name: p.name,
    price: p.priceCents / 100,
    compareAt: p.compareAtCents ? p.compareAtCents / 100 : undefined,
    rating: p.rating,
    reviewCount: p.reviewCount,
    images: JSON.parse(p.images) as string[],
    category: p.category?.slug || "",
    tags: JSON.parse(p.tags) as string[],
    shortDesc: p.shortDesc,
    longDesc: p.longDesc ?? undefined,
    ingredients: p.ingredients ?? undefined,
    howToUse: p.howToUse ?? undefined,
    stock: p.stock,
    trackInventory: p.trackInventory !== false,
    badge: p.badge ?? undefined,
  }));
}

export async function getRelatedProducts(product: Product, limit = 4): Promise<Product[]> {
  if (!HAS_DATABASE_URL) return [];

  const categorySlug = product.category || null;
  const firstTag = product.tags[0] || null;

  const orConditions: any[] = [];
  if (categorySlug) {
    orConditions.push({ category: { slug: categorySlug } });
  }
  if (firstTag) {
    orConditions.push({
      tags: { contains: firstTag, mode: "insensitive" as const },
    });
  }

  const where: any = {
    id: { not: product.id },
  };
  if (orConditions.length > 0) {
    where.OR = orConditions;
  }

  const dbProducts = await (prisma as any).product.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: limit,
    include: {
      category: { select: { slug: true } },
    },
  }) as Array<{
    id: string;
    slug: string;
    productCode: string | null;
    name: string;
    priceCents: number;
    compareAtCents: number | null;
    rating: number;
    reviewCount: number;
    images: string;
    tags: string;
    shortDesc: string;
    longDesc: string | null;
    ingredients: string | null;
    howToUse: string | null;
    stock: number;
    trackInventory?: boolean;
    badge: string | null;
    category?: { slug: string } | null;
  }>;

  return dbProducts.map((p) =>
    parseProduct({
      id: p.id,
      slug: p.slug,
      productCode: p.productCode,
      name: p.name,
      priceCents: p.priceCents,
      compareAtCents: p.compareAtCents,
      rating: p.rating,
      reviewCount: p.reviewCount,
      images: p.images,
      category: { slug: p.category?.slug || "" },
      tags: p.tags,
      shortDesc: p.shortDesc,
      longDesc: p.longDesc,
      ingredients: p.ingredients,
      howToUse: p.howToUse,
      stock: p.stock,
    })
  );
}

export async function searchProducts(query: string): Promise<Product[]> {
  if (!HAS_DATABASE_URL) return [];
  const q = query.toLowerCase().trim();
  if (!q) return getProducts();

  const dbProducts = await (prisma as any).product.findMany({
    where: {
      OR: [
        { name: { contains: q, mode: "insensitive" } },
        { shortDesc: { contains: q, mode: "insensitive" } },
        { tags: { contains: q, mode: "insensitive" } },
        { category: { slug: { contains: q, mode: "insensitive" } } },
      ],
    },
    orderBy: { createdAt: "desc" },
    include: {
      category: { select: { slug: true } },
    },
  }) as Array<{
    id: string;
    slug: string;
    productCode: string | null;
    name: string;
    priceCents: number;
    compareAtCents: number | null;
    rating: number;
    reviewCount: number;
    images: string;
    tags: string;
    shortDesc: string;
    longDesc: string | null;
    ingredients: string | null;
    howToUse: string | null;
    stock: number;
    trackInventory?: boolean;
    badge: string | null;
    category?: { slug: string } | null;
  }>;

  return dbProducts.map((p) =>
    parseProduct({
      id: p.id,
      slug: p.slug,
      productCode: p.productCode,
      name: p.name,
      priceCents: p.priceCents,
      compareAtCents: p.compareAtCents,
      rating: p.rating,
      reviewCount: p.reviewCount,
      images: p.images,
      category: { slug: p.category?.slug || "" },
      tags: p.tags,
      shortDesc: p.shortDesc,
      longDesc: p.longDesc,
      ingredients: p.ingredients,
      howToUse: p.howToUse,
      stock: p.stock,
    })
  );
}

export async function getProductsBySlugs(slugs: string[]): Promise<Product[]> {
  if (!HAS_DATABASE_URL) return [];
  if (slugs.length === 0) return [];

  const dbProducts = await (prisma as any).product.findMany({
    where: {
      slug: { in: slugs },
    },
    include: {
      category: { select: { slug: true } },
    },
  }) as Array<{
    id: string;
    slug: string;
    productCode: string | null;
    name: string;
    priceCents: number;
    compareAtCents: number | null;
    rating: number;
    reviewCount: number;
    images: string;
    tags: string;
    shortDesc: string;
    longDesc: string | null;
    ingredients: string | null;
    howToUse: string | null;
    stock: number;
    trackInventory?: boolean;
    badge: string | null;
    category?: { slug: string } | null;
  }>;

  return dbProducts.map((p) =>
    parseProduct({
      id: p.id,
      slug: p.slug,
      productCode: p.productCode,
      name: p.name,
      priceCents: p.priceCents,
      compareAtCents: p.compareAtCents,
      rating: p.rating,
      reviewCount: p.reviewCount,
      images: p.images,
      category: { slug: p.category?.slug || "" },
      tags: p.tags,
      shortDesc: p.shortDesc,
      longDesc: p.longDesc,
      ingredients: p.ingredients,
      howToUse: p.howToUse,
      stock: p.stock,
    })
  );
}

export async function getCategories(): Promise<Category[]> {
  if (!HAS_DATABASE_URL) return [];

  const dbCategories = await (prisma as any).category.findMany({
    orderBy: { name: "asc" },
    select: {
      id: true,
      name: true,
      slug: true,
      image: true,
      parentId: true,
    },
  }) as Array<{
    id: string;
    name: string;
    slug: string;
    image?: string | null;
    parentId?: string | null;
  }>;

  return dbCategories.map((c) => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
    image: c.image ?? null,
    parentId: c.parentId ?? null,
  }));
}
