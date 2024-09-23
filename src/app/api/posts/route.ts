import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export const GET = async(req: NextRequest) => {
  try {
    const posts = await prisma.post.findMany({
    include: {
      postCategories: {
        include: {
          category: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    }
    })

    return NextResponse.json({status: 'OK', posts: posts}, {status: 200})
  } catch (error) {
    if(error instanceof Error)
      return NextResponse.json({status: error.message}, {status: 400})
  }
}
