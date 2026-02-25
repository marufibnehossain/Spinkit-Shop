import Image from "next/image";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { BreadcrumbLabel } from "@/components/BreadcrumbContext";

interface PageProps {
  params: Promise<{ slug: string }>;
}

function formatDate(d: Date) {
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default async function BlogPostPage(props: PageProps) {
  const { slug } = await props.params;

  const post = await prisma.blogPost.findFirst({
    where: { slug, publishedAt: { not: null } },
    include: { category: { select: { name: true, slug: true } } },
  });

  if (!post) {
    notFound();
  }

  const publishedAt = post.publishedAt!;

  return (
    <div className="min-h-screen bg-[#F0F0F0]">
      <BreadcrumbLabel label={post.title} />
      <article className="max-w-3xl mx-auto px-4 md:px-6 py-12 md:py-16">
        {post.image && (
          <div className="relative aspect-[16/10] w-full rounded-none overflow-hidden bg-[#f5f5f5] mb-8">
            <Image
              src={post.image}
              alt=""
              fill
              className="object-cover"
              priority
              sizes="(max-width: 1024px) 100vw, 896px"
            />
          </div>
        )}
        <p className="font-sans text-sm text-[#2050FC] mb-2">
          {post.category.name} • {formatDate(publishedAt)}
        </p>
        <h1 className="font-sans text-2xl md:text-3xl lg:text-4xl font-bold text-[#111827]">
          {post.title}
        </h1>
        <p className="mt-2 font-sans text-sm text-[#6B7280]">By {post.authorName}</p>
        <div className="mt-8 font-sans text-[#4B5563] leading-relaxed prose prose-sage max-w-none">
          {post.body ? (
            <div
              className="whitespace-pre-wrap"
              dangerouslySetInnerHTML={{ __html: post.body }}
            />
          ) : (
            <p>{post.excerpt}</p>
          )}
        </div>
      </article>
    </div>
  );
}
