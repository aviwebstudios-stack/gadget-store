import { prisma } from "@/lib/prisma";
import { parseClaims, parseContact } from "@/lib/store-content";

async function read(key: string) {
  const record = await prisma.siteContent.findUnique({ where: { key } });
  return record?.value ?? null;
}

export async function getContactInfo() {
  return parseContact(await read("contact"));
}

export async function getStoreClaims() {
  return parseClaims(await read("store_claims"));
}
