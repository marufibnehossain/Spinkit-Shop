import Image from "next/image";
import Link from "next/link";

export interface CategoryTile {
  id: string;
  name: string;
  slug: string;
  image?: string | null;
}

interface DiscoverCategoriesSectionProps {
  categories: CategoryTile[];
}

export default function DiscoverCategoriesSection({ categories }: DiscoverCategoriesSectionProps) {
  if (!categories.length) return null;

  return (
    <section className="bg-bg py-[50px]" aria-labelledby="discover-categories-heading">
      <div className="mx-auto max-w-[1312px] px-4 md:px-6">
        <h2
          id="discover-categories-heading"
          className="font-display text-2xl md:text-3xl font-bold uppercase text-text text-center"
        >
          Discover{" "}
          <span className="text-[#2050FC]">Equipment</span>{" "}
          Categories
        </h2>
        <div className="mt-10 md:mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/products?category=${encodeURIComponent(cat.slug)}`}
              className="flex items-center justify-between gap-4 p-4 md:p-6 bg-[#E9E6E3] rounded-none hover:opacity-95 transition-opacity"
            >
              <span className="font-sans font-medium text-text shrink-0">{cat.name}</span>
              <div className="flex items-center gap-4">
                <div className="relative w-16 h-16 md:w-20 md:h-20 shrink-0 bg-white/60 rounded overflow-hidden">
                  {cat.image ? (
                    <Image
                      src={cat.image}
                      alt=""
                      fill
                      className="object-contain"
                      sizes="80px"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-muted text-2xl" aria-hidden>
                      —
                    </div>
                  )}
                </div>
                <span
                  className="w-10 h-10 shrink-0 rounded-full border-2 border-[#2050FC] bg-white flex items-center justify-center"
                  aria-hidden
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="text-[#2050FC]"
                  >
                    <path
                      d="M6 12L10 8L6 4"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
