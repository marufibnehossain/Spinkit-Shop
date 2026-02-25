import Image from "next/image";
import Link from "next/link";

type BlogCardProps = {
  slug: string;
  title: string;
  excerpt: string;
  image: string | null;
  categoryName: string;
  publishedAt: Date;
  authorName: string;
};

function formatDate(d: Date) {
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function BlogCard({
  slug,
  title,
  excerpt,
  image,
  categoryName,
  publishedAt,
  authorName,
}: BlogCardProps) {
  return (
    <Link
      href={`/blog/${slug}`}
      className="group block overflow-hidden bg-white hover:opacity-95 transition-opacity"
    >
      <div className="relative aspect-square w-full overflow-hidden bg-[#f5f5f5]">
        {image ? (
          <Image
            src={image}
            alt=""
            fill
            className="object-cover object-center"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-[#e5e5e5] text-[#9ca3af]">
            <span className="text-sm">No image</span>
          </div>
        )}
      </div>
      <div className="pt-4 md:pt-5">
        <p className="font-sans text-[11px] md:text-xs mb-2 flex items-center gap-2">
          <span className="text-[#2050FC] group-hover:underline">{categoryName}</span>
          <span
            className="inline-block h-1.5 w-1.5 rounded-full bg-[#2050FC]"
            aria-hidden
          />
          <span className="text-[#6B7280]">{formatDate(publishedAt)}</span>
        </p>
        <h3 className="font-sans text-base md:text-lg font-bold text-[#111827] leading-snug group-hover:underline">
          {title}
        </h3>
        <p className="mt-2 font-sans text-[13px] md:text-sm text-[#6B7280] leading-relaxed line-clamp-3">
          {excerpt}
        </p>
        <p className="mt-3 font-sans text-[13px] md:text-sm text-[#6B7280]">
          By {authorName}
        </p>
      </div>
    </Link>
  );
}
