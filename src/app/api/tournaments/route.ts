import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
  const res = await prisma.tournament.findMany({
    include: {
      participants: true,
    },
  });
  const data = res;
  return NextResponse.json({ data }, { status: 200 });
}

export async function POST(req: NextRequest) {
  const data = await req.json();

  const user = await prisma.user.findUnique({
    where: {
      id: data.userId,
    },
  });

  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const tournament = await prisma.tournament.create({
    data: {
      name: data.name,
      description: data.description,
      date: data.date,
      location: data.location,
    },
  });

  return NextResponse.json({ tournament }, { status: 200 });
}
