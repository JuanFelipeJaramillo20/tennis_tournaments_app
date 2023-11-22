import { PrismaClient, User } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(req: NextRequest, { params }) {
  try {
    const tournamentId = params.id;
    if (!tournamentId)
      return NextResponse.json({error:"Tournament ID not provided"}, { status: 400 });
    const tournament = await prisma.tournament.findUnique({
      where: {
        id: parseInt(tournamentId),
      },
      include: { participants: true },
    });
    return NextResponse.json({ object: tournament }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error }, { status: 404 });
  }
}
export async function PUT(req: NextRequest, { params }) {
  try {
    const data = await req.json();

    const user = await prisma.user.findUnique({
      where: {
        id: data.userId,
        email: data.userEmail
      },
    });

    if(data.type !== "add player"){

      if (!user || user.role !== "admin" ) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
      }
    }

    const id = params.id;

    const existingTournament = await prisma.tournament.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingTournament) {
      return Response.json({ error: "Tournament not found" }, {status: 404});
    }

    if (data.type === "add player") {
      const response = await addParticipantToTournament(
        id,
        data.userId,
        data.userName,
        data.userEmail
      );
      return response;
    } else {
      const updatedTournament = await prisma.tournament.update({
        where: { id: parseInt(id) },
        data: {
          name: data.name,
          description: data.description,
          date: data.date,
          location: data.location,
        },
      });

      return NextResponse.json({ tournament: updatedTournament }, {status: 200});
    }
  } catch (error) {
    return Response.json({ error }, {status: 500});
  }
}

export async function DELETE(req: NextRequest, {params}) {
  try {
    const { id } = params;
    
    const existingTournament = await prisma.tournament.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingTournament) {
      return NextResponse.json({ error: "Tournament not found" }, {status: 404});
    }

    const deletedTournament = await prisma.tournament.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json({data: deletedTournament}, {status: 200});
  } catch (error) {
    console.error("Error deleting tournament:", error);
    return Response.json({ error }, {status: 500});
  }
}

const addParticipantToTournament = async (
  tournamentId: number,
  userId: number,
  participantName: string,
  participantEmail: string
) => {
  try {
    const updatedTournament = await prisma.tournament.update({
      where: { id: Number(tournamentId) },
      data: {
        participants: {
          connectOrCreate: {
            where: {email: participantEmail},
            create: {email: participantEmail, name: participantName, role: "regular"}
          },
        },
      },
      include: {
        participants: true,
      },
    });

    return NextResponse.json({ tournament: updatedTournament }, {status: 200});
  } catch (error) {
    console.error(`Error adding participant to tournament: ${error}`);
    return NextResponse.json({error}, {status: 500});
  }
};
