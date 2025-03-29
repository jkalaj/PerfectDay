import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const moods = await prisma.mood.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(moods);
  } catch (error) {
    console.error("Error fetching moods:", error);
    return NextResponse.json(
      { error: "Failed to fetch moods" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    const mood = await prisma.mood.create({
      data,
    });

    return NextResponse.json(mood, { status: 201 });
  } catch (error) {
    console.error("Error creating mood:", error);
    return NextResponse.json(
      { error: "Failed to create mood" },
      { status: 500 }
    );
  }
} 