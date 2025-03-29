import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    // Get userId from searchParams to filter tasks
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');
    
    // Only return tasks for the specified user
    const tasks = await prisma.task.findMany({
      where: userId ? { userId: userId } : undefined,
      include: {
        category: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(tasks);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return NextResponse.json(
      { error: "Failed to fetch tasks" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    // Ensure the task has a userId
    if (!data.userId) {
      return NextResponse.json(
        { error: "User ID is required to create a task" },
        { status: 400 }
      );
    }

    const task = await prisma.task.create({
      data,
      include: {
        category: true,
      },
    });

    return NextResponse.json(task, { status: 201 });
  } catch (error) {
    console.error("Error creating task:", error);
    return NextResponse.json(
      { error: "Failed to create task" },
      { status: 500 }
    );
  }
} 