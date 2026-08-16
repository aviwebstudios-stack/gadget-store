import { cookies } from "next/headers";
import { verifyAdminToken } from "@/lib/admin-auth";

export async function requireAdmin(): Promise<boolean> {
  const token = cookies().get("admin_session")?.value;
  const adminId = await verifyAdminToken(token);
  return !!adminId;
}
