import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import BlogCard from "@/components/BlogCard";

interface PageProps {
  searchParams: Promise<{ category?: string }> | { category?: string };
}

export default async function BlogPage(props: PageProps) {
  const searchParams = await Promise.resolve(props.searchParams);
  const categorySlug = searchParams.category?.trim() || null;

  let categories: Array<{ id: string; name: string; slug: string }> = [];
  let posts: Array<{
    id: string;
    slug: string;
    title: string;
    excerpt: string;
    image: string | null;
    authorName: string;
    publishedAt: Date | null;
    category: { id: string; name: string; slug: string };
  }> = [];

  try {
    if (typeof (prisma as { blogCategory?: { findMany: unknown } }).blogCategory?.findMany !== "function") {
      throw new Error("Prisma client missing blog models — run: npx prisma generate");
    }
    const [categoriesData, categoryFilteredData] = await Promise.all([
      prisma.blogCategory.findMany({
        orderBy: { name: "asc" },
        select: { id: true, name: true, slug: true },
      }),
      categorySlug
        ? prisma.blogCategory.findUnique({
            where: { slug: categorySlug },
            select: { id: true },
          })
        : null,
    ]);
    categories = categoriesData;
    const categoryIdFilter = categoryFilteredData?.id ?? null;
    posts = await prisma.blogPost.findMany({
      where: {
        publishedAt: { not: null },
        ...(categoryIdFilter ? { categoryId: categoryIdFilter } : {}),
      },
      orderBy: { publishedAt: "desc" },
      include: {
        category: { select: { id: true, name: true, slug: true } },
      },
    });
  } catch (e) {
    console.error("[BlogPage]", e);
    // Page still renders with empty categories and posts
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero — dark blue, white nav over it via transparent header */}
      <section className="relative overflow-hidden text-white">
        <div className="relative h-[400px] flex items-center">
          <Image
            src="/images/page-banner.png"
            alt="Blog - Spinkit Shop"
            fill
            priority
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-[#1e3a5f]/60 mix-blend-multiply" aria-hidden />
          <div className="relative z-10 w-full container mx-auto px-4 md:px-6 lg:px-10 flex flex-col items-center justify-center text-center">
            <h1 className="font-sans text-[44px] md:text-[64px] lg:text-[72px] font-black leading-none text-[#CFFF40]">
              BLOGS
            </h1>
            <p className="mt-4 max-w-xl font-sans text-sm md:text-base text-white">
              Expert tips, training guides, and the latest news from the world of
              table tennis.
            </p>
          </div>
        </div>
      </section>

      {/* Blogs section — centered title, rounded category pills, 3-col grid */}
      <section className="bg-white py-12 md:py-16 lg:py-20">
        <div className="container mx-auto px-4 md:px-6 lg:px-10 max-w-[1312px]">
          <h2 className="font-sans text-2xl md:text-3xl lg:text-4xl font-bold text-[#111827] text-center">
            Blogs
          </h2>
          <p className="mt-2 font-sans text-sm md:text-base text-[#374151] text-center max-w-2xl mx-auto">
            Tips, techniques, and news from the world of table tennis.
          </p>

          {/* Category filter — sharp corners; All = dark blue, others = light beige */}
          <div className="mt-8 flex flex-wrap justify-center gap-2 md:gap-3" role="tablist" aria-label="Blog categories">
            <Link
              href="/blog"
              className={`inline-flex items-center justify-center px-5 py-2.5 rounded-none font-sans text-sm font-medium transition-colors ${
                !categorySlug
                  ? "bg-[#2050FC] text-white"
                  : "bg-[#F5F0E8] text-[#111827] hover:bg-[#EDE6DC]"
              }`}
            >
              All
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/blog?category=${encodeURIComponent(cat.slug)}`}
                className={`inline-flex items-center justify-center px-5 py-2.5 rounded-none font-sans text-sm font-medium transition-colors ${
                  categorySlug === cat.slug
                    ? "bg-[#2050FC] text-white"
                    : "bg-[#F5F0E8] text-[#111827] hover:bg-[#EDE6DC]"
                }`}
              >
                {cat.name}
              </Link>
            ))}
          </div>

          {/* Blog grid */}
          <div className="mt-10 md:mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
            {posts.length === 0 ? (
              <p className="col-span-full font-sans text-[#6B7280] text-center py-12">
                No posts yet. Check back soon.
              </p>
            ) : (
              posts.map((post) => (
                <BlogCard
                  key={post.id}
                  slug={post.slug}
                  title={post.title}
                  excerpt={post.excerpt}
                  image={post.image}
                  categoryName={post.category.name}
                  publishedAt={post.publishedAt!}
                  authorName={post.authorName}
                />
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
