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
          className="font-display text-2xl md:text-3xl font-medium capitalize text-text text-center"
        >
          Discover{" "}
          <span className="text-[#7546FF] font-bold italic">Equipment</span>{" "}
          Categories
        </h2>
        <div className="mt-10 md:mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/products?category=${encodeURIComponent(cat.slug)}`}
              className="group flex items-center justify-between gap-4 p-4 bg-[#E9EBDD] rounded-none hover:opacity-95 transition-opacity"
            >
              <span className="font-sans font-medium text-text shrink-0">{cat.name}</span>
              <div className="flex items-center gap-4">
                <div className="relative w-16 h-16 md:w-20 md:h-20 shrink-0 bg-white/60 rounded-none overflow-hidden">
                  {cat.image ? (
                    <Image
                      src={cat.image}
                      alt=""
                      fill
                      className="object-contain rounded-none"
                      sizes="80px"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-muted text-2xl" aria-hidden>
                      —
                    </div>
                  )}
                </div>
                <span
                  className="w-10 h-10 shrink-0 rounded-full border border-[#2A2B2A] bg-transparent flex items-center justify-center transition-colors group-hover:border-[#7546FF] group-hover:bg-[#7546FF]"
                  aria-hidden
                >
                  <svg
                    width="18"
                    height="14"
                    viewBox="0 0 18 14"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="text-[#7546FF] shrink-0 transition-colors group-hover:text-white"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M17.2802 7.29877C17.4206 7.15814 17.4995 6.96752 17.4995 6.76877C17.4995 6.57002 17.4206 6.37939 17.2802 6.23877L11.2802 0.238767C11.2115 0.16508 11.1287 0.105978 11.0367 0.0649862C10.9447 0.0239944 10.8454 0.00195312 10.7447 0.00017643C10.644 -0.00160027 10.544 0.0169239 10.4506 0.0546446C10.3572 0.0923653 10.2724 0.148511 10.2011 0.219729C10.1299 0.290948 10.0738 0.375782 10.036 0.469171C9.99833 0.562559 9.9798 0.662586 9.98158 0.763289C9.98336 0.863993 10.0054 0.963307 10.0464 1.05531C10.0874 1.14731 10.1465 1.23011 10.2202 1.29877L14.9402 6.01877L0.750172 6.01877C0.55126 6.01877 0.360493 6.09779 0.219841 6.23844C0.0791893 6.37909 0.000171661 6.56986 0.000171661 6.76877C0.000171661 6.96768 0.0791893 7.15844 0.219841 7.2991C0.360493 7.43975 0.55126 7.51877 0.750172 7.51877L14.9402 7.51877L10.2202 12.2388C10.1465 12.3074 10.0874 12.3902 10.0464 12.4822C10.0054 12.5742 9.98336 12.6735 9.98158 12.7742C9.9798 12.8749 9.99833 12.975 10.036 13.0684C10.0738 13.1618 10.1299 13.2466 10.2011 13.3178C10.2724 13.389 10.3572 13.4452 10.4506 13.4829C10.544 13.5206 10.644 13.5391 10.7447 13.5374C10.8454 13.5356 10.9447 13.5135 11.0367 13.4725C11.1287 13.4316 11.2115 13.3725 11.2802 13.2988L17.2802 7.29877Z"
                      fill="currentColor"
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
