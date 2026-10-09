import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_COOKIE, verifySessionToken } from "@/lib/admin-auth";

/** Defence in depth: middleware already gates /admin, but every server action re-checks. */
export async function requireAdmin() {
  const jar = await cookies();
  if (!(await verifySessionToken(jar.get(ADMIN_COOKIE)?.value))) redirect("/admin/login");
}
