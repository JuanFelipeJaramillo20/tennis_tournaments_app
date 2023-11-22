import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

export async function POST(req: NextRequest){
    const { email, password } = await req.json();
    
    const user = await prisma.user.findUnique({
        where: {
          email: email,
        },
      });

      const passwordMatch = await bcrypt.compare(password, user?.password);

    if (!passwordMatch) {
      return NextResponse.json({ error: "Invalid credentials" }, {status: 401});
    }
      const formattedUser = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      }
      return NextResponse.json({ formattedUser }, {status: 200});
        
}