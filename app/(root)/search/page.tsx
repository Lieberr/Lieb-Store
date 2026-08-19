import { getAllProducts, getAllCategories } from "@/actions/product.actions";
import { Button } from "@/components/ui/button";
import ProductCard from "@/components/ui/shared/header/product/product-card";
import Link from "next/link";
import {
  SlidersHorizontal,
  Star,
  X,
  Search,
  PackageOpen,
  ChevronRight,
} from "lucide-react";

const prices = [
  {
    name: "$1 – $50",
    value: "1-50",
  },
  {
    name: "$51 – $100",
    value: "51-100",
  },
  {
    name: "$101 – $200",
    value: "101-200",
  },
  {
    name: "$201 – $500",
    value: "201-500",
  },
  {
    name: "$501 – $1000",
    value: "501-1000",
  },
];

const ratings = [4, 3, 2, 1];

const sortOrders = [
  {
    label: "Newest",
    value: "newest",
  },
  {
    label: "Price: Low to High",
    value: "lowest",
  },
  {
    label: "Price: High to Low",
    value: "highest",
  },
  {
    label: "Top Rated",
    value: "rating",
  },
];

export async function generateMetadata(props: {
  searchParams: Promise<{
    q?: string;
    category?: string;
    price?: string;
    rating?: string;
  }>;
}) {
  const {
    q = "all",
    category = "all",
    price = "all",
    rating = "all",
  } = await props.searchParams;

  const filters = [];

  if (q && q !== "all" && q.trim() !== "") {
    filters.push(`"${q}"`);
  }

  if (category && category !== "all") {
    filters.push(category);
  }

  if (price && price !== "all") {
    filters.push(`$${price}`);
  }

  if (rating && rating !== "all") {
    filters.push(`${rating}+ stars`);
  }

  return {
    title:
      filters.length > 0
        ? `Search: ${filters.join(" · ")}`
        : "Search Products",
  };
}

const SearchPage = async (props: {
  searchParams: Promise<{
    q?: string;
    category?: string;
    price?: string;
    rating?: string;
    sort?: string;
    page?: string;
  }>;
}) => {
  const {
    q = "all",
    category = "all",
    price = "all",
    rating = "all",
    sort = "newest",
    page = "1",
  } = await props.searchParams;

  const getFilterUrl = ({
    c,
    s,
    p,
    r,
    pg,
  }: {
    c?: string;
    s?: string;
    p?: string;
    r?: string;
    pg?: string;
  }) => {
    const params = {
      q,
      category,
      price,
      rating,
      sort,
      page,
    };

    if (c) params.category = c;
    if (s) params.sort = s;
    if (p) params.price = p;
    if (r) params.rating = r;
    if (pg) params.page = pg;

    return `/search?${new URLSearchParams(params).toString()}`;
  };

  const products = await getAllProducts({
    query: q,
    category,
    price,
    rating,
    sort,
    page: Number(page),
  });

  const categories = await getAllCategories();

  const hasFilters =
    (q !== "all" && q !== "") ||
    category !== "all" ||
    price !== "all" ||
    rating !== "all";

  const currentSort =
    sortOrders.find((item) => item.value === sort)?.label ??
    "Newest";

  return (
    <div className="min-h-screen py-6 md:py-8">
      <div className="space-y-6">

        {/* PAGE HEADER */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link
              href="/"
              className="transition-colors hover:text-foreground"
            >
              Home
            </Link>

            <ChevronRight className="h-4 w-4" />

            <span>Search</span>
          </div>

          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
                {q !== "all" && q !== "" ? (
                  <>
                    Search results for{" "}
                    <span className="text-primary">
                      &quot;{q}&quot;
                    </span>
                  </>
                ) : (
                  "All Products"
                )}
              </h1>

              <p className="mt-1 text-sm text-muted-foreground">
                Discover products that match your preferences.
              </p>
            </div>

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <PackageOpen className="h-4 w-4" />

              <span>
                {products.data.length}{" "}
                {products.data.length === 1
                  ? "product"
                  : "products"}
              </span>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[240px_1fr]">

          {/* FILTER SIDEBAR */}
          <aside className="hidden self-start lg:block">
            <div className="sticky top-24 h-fit rounded-xl border bg-card p-5 shadow-sm">

              <div className="mb-5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="h-4 w-4" />

                  <h2 className="font-semibold">
                    Filters
                  </h2>
                </div>

                {hasFilters && (
                  <Link
                    href="/search"
                    className="text-xs font-medium text-primary hover:underline"
                  >
                    Clear all
                  </Link>
                )}
              </div>

              {/* CATEGORY */}
              <div className="border-t pt-5">
                <h3 className="mb-3 text-sm font-semibold">
                  Department
                </h3>

                <div className="space-y-1">
                  <Link
                    href={getFilterUrl({ c: "all" })}
                    className={`flex items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors ${
                      category === "all" || category === ""
                        ? "bg-primary/10 font-semibold text-primary"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    <span>All Categories</span>

                    {category === "all" && (
                      <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                    )}
                  </Link>

                  {categories.map((item) => {
                    const active =
                      category === item.category;

                    return (
                      <Link
                        key={item.category}
                        href={getFilterUrl({
                          c: item.category,
                        })}
                        className={`flex items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors ${
                          active
                            ? "bg-primary/10 font-semibold text-primary"
                            : "text-muted-foreground hover:bg-muted hover:text-foreground"
                        }`}
                      >
                        <span>{item.category}</span>

                        {active && (
                          <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                        )}
                      </Link>
                    );
                  })}
                </div>
              </div>

              {/* PRICE */}
              <div className="mt-6 border-t pt-5">
                <h3 className="mb-3 text-sm font-semibold">
                  Price
                </h3>

                <div className="space-y-1">
                  <Link
                    href={getFilterUrl({ p: "all" })}
                    className={`block rounded-lg px-3 py-2 text-sm transition-colors ${
                      price === "all"
                        ? "bg-primary/10 font-semibold text-primary"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    Any Price
                  </Link>

                  {prices.map((item) => (
                    <Link
                      key={item.value}
                      href={getFilterUrl({
                        p: item.value,
                      })}
                      className={`block rounded-lg px-3 py-2 text-sm transition-colors ${
                        price === item.value
                          ? "bg-primary/10 font-semibold text-primary"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      }`}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              </div>

              {/* RATING */}
              <div className="mt-6 border-t pt-5">
                <h3 className="mb-3 text-sm font-semibold">
                  Customer Rating
                </h3>

                <div className="space-y-1">
                  <Link
                    href={getFilterUrl({ r: "all" })}
                    className={`block rounded-lg px-3 py-2 text-sm transition-colors ${
                      rating === "all"
                        ? "bg-primary/10 font-semibold text-primary"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    All Ratings
                  </Link>

                  {ratings.map((item) => {
                    const active =
                      rating === item.toString();

                    return (
                      <Link
                        key={item}
                        href={getFilterUrl({
                          r: item.toString(),
                        })}
                        className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors ${
                          active
                            ? "bg-primary/10 font-semibold text-primary"
                            : "text-muted-foreground hover:bg-muted hover:text-foreground"
                        }`}
                      >
                        <div className="flex">
                          {Array.from({
                            length: 5,
                          }).map((_, index) => (
                            <Star
                              key={index}
                              className={`h-3.5 w-3.5 ${
                                index < item
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "text-muted-foreground/30"
                              }`}
                            />
                          ))}
                        </div>

                        <span>& up</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
          </aside>

          {/* PRODUCTS AREA */}
          <section className="min-w-0">

            {/* TOOLBAR */}
            <div className="mb-5 rounded-xl border bg-card p-3 shadow-sm">

              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

                {/* ACTIVE FILTERS */}
                <div className="flex flex-wrap items-center gap-2">

                  <span className="text-sm font-medium">
                    Filters:
                  </span>

                  {!hasFilters && (
                    <span className="text-sm text-muted-foreground">
                      None
                    </span>
                  )}

                  {q !== "all" && q !== "" && (
                    <Link
                      href={getFilterUrl({})}
                      className="inline-flex items-center gap-1 rounded-full bg-muted px-3 py-1 text-xs font-medium"
                    >
                      <Search className="h-3 w-3" />
                      {q}
                    </Link>
                  )}

                  {category !== "all" && (
                    <Link
                      href={getFilterUrl({ c: "all" })}
                      className="inline-flex items-center gap-1 rounded-full bg-muted px-3 py-1 text-xs font-medium"
                    >
                      {category}
                      <X className="h-3 w-3" />
                    </Link>
                  )}

                  {price !== "all" && (
                    <Link
                      href={getFilterUrl({ p: "all" })}
                      className="inline-flex items-center gap-1 rounded-full bg-muted px-3 py-1 text-xs font-medium"
                    >
                      ${price}
                      <X className="h-3 w-3" />
                    </Link>
                  )}

                  {rating !== "all" && (
                    <Link
                      href={getFilterUrl({ r: "all" })}
                      className="inline-flex items-center gap-1 rounded-full bg-muted px-3 py-1 text-xs font-medium"
                    >
                      {rating}+ stars
                      <X className="h-3 w-3" />
                    </Link>
                  )}

                  {hasFilters && (
                    <Link
                      href="/search"
                      className="ml-1 text-xs font-medium text-destructive hover:underline"
                    >
                      Clear
                    </Link>
                  )}
                </div>

                {/* SORT */}
                <div className="flex items-center gap-2">
                  <span className="whitespace-nowrap text-sm text-muted-foreground">
                    Sort by
                  </span>

                  <div className="flex rounded-lg border bg-background p-1">
                    {sortOrders.map((item) => (
                      <Link
                        key={item.value}
                        href={getFilterUrl({
                          s: item.value,
                        })}
                        className={`hidden rounded-md px-3 py-1.5 text-xs font-medium transition-colors sm:block ${
                          sort === item.value
                            ? "bg-primary text-primary-foreground"
                            : "text-muted-foreground hover:bg-muted hover:text-foreground"
                        }`}
                      >
                        {item.label}
                      </Link>
                    ))}

                    <span className="px-3 py-1.5 text-xs font-medium sm:hidden">
                      {currentSort}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* PRODUCTS */}
            {products.data.length === 0 ? (
              <div className="flex min-h-[400px] flex-col items-center justify-center rounded-xl border border-dashed bg-card px-6 text-center">

                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                  <PackageOpen className="h-8 w-8 text-muted-foreground" />
                </div>

                <h2 className="text-lg font-semibold">
                  No products found
                </h2>

                <p className="mt-1 max-w-md text-sm text-muted-foreground">
                  We couldn&apos;t find any products matching
                  your current filters. Try adjusting your
                  search or removing some filters.
                </p>

                <Button
                  asChild
                  variant="outline"
                  className="mt-5"
                >
                  <Link href="/search">
                    Clear all filters
                  </Link>
                </Button>

              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {products.data.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                  />
                ))}
              </div>
            )}

          </section>
        </div>
      </div>
    </div>
  );
};

export default SearchPage;