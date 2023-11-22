import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
const bcrypt = require('bcrypt');
const prisma = new PrismaClient();

export async function PUT(req: NextRequest, {params}){
    try {
        const data = await req.json();

    const user = await prisma.user.findUnique({
      where: {
        id: parseInt(params.id),
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User doesn't exist" }, { status: 404 });
    }
    const passwordHash = await bcrypt.hash(data.password, 10);
    const updatedUser = await prisma.user.update({
        where: {id: parseInt(params.id)},
        data: {
            name: data.name,
            email: data.email,
            password: passwordHash,
            role: data.role
        }
    })

    return NextResponse.json({user: updatedUser}, {status: 200});
    } catch (error) {        
        return NextResponse.json({ error }, {status: 500});
    }
}

export async function DELETE(req: NextRequest, {params}){
    try{
    const id = params.id;
    const deletedUser = await prisma.user.delete({
        where: {id: parseInt(id)}
    })
    return NextResponse.json({user: deletedUser}, {status: 200});
    } catch (error) {        
        return NextResponse.json({ error }, {status: 500});
    }
}