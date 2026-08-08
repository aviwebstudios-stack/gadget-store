import { prisma } from "@/lib/prisma";

export type DbProduct = {
  id: string;
  name: string;
  image: string;
  priceMin: number;
  priceMax: number;
  category: string;
  inStock: boolean;
};

export async function getAllProductsDb(): Promise<DbProduct[]> {
  return prisma.product.findMany({ orderBy: { createdAt: "asc" } });
}

export async function getCategoriesDb() {
  const products = await getAllProductsDb();
  const map = new Map<string, DbProduct[]>();
  for (const p of products) {
    if (!map.has(p.category)) map.set(p.category, []);
    map.get(p.category)!.push(p);
  }
  return Array.from(map.entries()).map(([name, products]) => ({ name, products }));
}

export async function getProductBySlugDb(slug: string) {
  return prisma.product.findUnique({ where: { slug } });
}
