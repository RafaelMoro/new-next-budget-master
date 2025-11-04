import { LOGIN_ROUTE } from "@/shared/constants/global.constants";
import { signOut } from "@/shared/lib/auth.lib";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET() {
  await signOut();
  revalidatePath(LOGIN_ROUTE);
  return NextResponse.json({ message: "Signed out successfully" });
}