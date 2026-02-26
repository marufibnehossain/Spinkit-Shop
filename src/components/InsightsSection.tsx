import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function InsightsSection() {
  let posts:
    | Array<{
        slug: string;
        title: string;
        image: string | null;
        publishedAt: Date | null;
      }>
    = [];

  try {
    // Guard for environments where blog models might not exist yet
    if (typeof (prisma as { blogPost?: { findMany?: unknown } }).blogPost?.findMany === "function") {
      posts = await prisma.blogPost.findMany({
        where: { publishedAt: { not: null } },
        orderBy: { publishedAt: "desc" },
        take: 3,
        select: {
          slug: true,
          title: true,
          image: true,
          publishedAt: true,
        },
      });
    }
  } catch (e) {
    console.error("[InsightsSection] Failed to load blog posts", e);
  }

  const hasPosts = posts.length > 0;

  return (
    <section
      className="py-[50px] bg-bg"
      aria-labelledby="insights-heading"
    >
      <div className="mx-auto max-w-[1312px] px-4 md:px-6">
        <h2
          id="insights-heading"
          className="font-display text-[24px] font-bold italic text-center text-[#7546FF] mb-10 md:mb-12"
        >
          Table Tennis Insights
        </h2>
        {hasPosts ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
            {posts.map((post) => {
              const dateLabel =
                post.publishedAt &&
                post.publishedAt.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                });

            return (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group block rounded-none overflow-hidden hover:opacity-95 transition-opacity"
              >
                <div className="relative aspect-square w-full overflow-hidden bg-sage-1 rounded-none">
                  {post.image ? (
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      className="object-cover object-center"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-[#e5e5e5] text-[#9ca3af]">
                      <span className="font-sans text-xs">No image</span>
                    </div>
                  )}
                </div>
                <h3 className="mt-4 font-sans font-bold text-text text-base leading-tight group-hover:underline">
                  {post.title}
                </h3>
                {dateLabel && (
                  <p className="mt-2 font-sans text-sm text-muted">
                    {dateLabel}
                  </p>
                )}
              </Link>
            );
            })}
          </div>
        ) : (
          <p className="font-sans text-sm text-muted text-center">
            No articles yet. Check back soon.
          </p>
        )}
      </div>
    </section>
  );
}
