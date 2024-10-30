import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();
export const GET = async () => {
  try {
    // カテゴリと関連する投稿件数を取得
    const categories = await prisma.category.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(
      {
        status: "OK",
        categories,
      },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ status: error.message }, { status: 400 });
    } else {
      console.error("Unknown error:", error);
      return NextResponse.json(
        { status: "Unknown error occurred" },
        { status: 400 }
      );
    }
  }
};

export const POST = async(req: NextRequest) => {
  
  try {
    const body = await req.json();

    const {name} = body;
    const category = await prisma.category.create({
      data: {
        name,
      },
    });

    return NextResponse.json({status: 'OK', id:category.id}, {status: 200});
  } catch (error) {
    console.error('Error updating category:', error);
    if (error instanceof Error)
      return NextResponse.json({status: error.message}, {status: 400});
  }
}
