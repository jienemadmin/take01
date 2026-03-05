import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession();
  const userId = (session?.user as any)?.id;

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      name: true,
      gender: true,
      createdAt: true,
      membership: {
        select: { status: true, barcodeValue: true, currentPeriodEnd: true },
      },
    },
  });

  return NextResponse.json({ ok: true, user });
}
