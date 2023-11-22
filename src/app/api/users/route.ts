import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
const bcrypt = require('bcrypt');
const prisma = new PrismaClient();

export async function GET() {
  const res = await prisma.user.findMany();
  return NextResponse.json({ res }, {status: 200});
}

export async function POST(req: NextRequest) {
    const userData = await req.json();
    const passwordHash = await bcrypt.hash(userData.password, 10);

  const user = await prisma.user.create({
    data: {
      name: userData.name,
      email: userData.email,
      password: passwordHash,
      role: userData.role,
    },
  });
  if(user){
    return NextResponse.json({user}, {status: 200});
  }
  return NextResponse.json({error: "Error creating user"}, {status: 500});
}
