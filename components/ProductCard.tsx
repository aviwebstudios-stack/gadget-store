import Image from "next/image";
import Link from "next/link";
import { formatNaira } from "@/lib/products";

type Product = {
  slug: string;
  name: string;
  image: string;
  priceMin: number;
};

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link href={`/shop/${product.slug}`} className="group block">
      <div className="aspect-square overflow-hidden rounded-lg bg-fg/5">
        <Image
          src={product.image}
          alt={product.name}
          width={400}
          height={400}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <p className="mt-2 line-clamp-2 text-[11px] leading-snug text-fg-90 sm:mt-3 sm:text-sm">
        {product.name}
      </p>
      <p className="mt-0.5 text-[10px] text-fg-50 sm:mt-1 sm:text-xs">
        {formatNaira(product.priceMin)}
      </p>
    </Link>
  );
}