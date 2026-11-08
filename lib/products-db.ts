import { prisma } from "@/lib/prisma";

export type DbProduct = {
  id: string;
  slug: string;
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

// Shop tabs follow the order set under Admin > Content > Shop Tabs. Empty
// categories are skipped. Products whose category is not in that list still
// show, in extra tabs at the end, so nothing disappears from the shop.
export async function getCategoriesDb() {
  const [products, categories] = await Promise.all([
    getAllProductsDb(),
    prisma.category.findMany({ orderBy: { order: "asc" } }),
  ]);

  const byCategory = new Map<string, DbProduct[]>();
  for (const p of products) {
    if (!byCategory.has(p.category)) byCategory.set(p.category, []);
    byCategory.get(p.category)!.push(p);
  }

  const known = categories.map((c) => c.name).filter((name) => byCategory.has(name));
  const extra = Array.from(byCategory.keys()).filter((name) => !known.includes(name));
  return [...known, ...extra].map((name) => ({ name, products: byCategory.get(name)! }));
}

export async function getProductBySlugDb(slug: string) {
  return prisma.product.findUnique({ where: { slug } });
}
