import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

  export const GET = async (req: NextRequest, { params }: { params: { id: string } }) => {
  const { id } = params;

  try {
    const category = await prisma.category.findUnique({
      where: {
        id: parseInt(id),
      },
    });

    if (!category) {
      return NextResponse.json({ status: 'Category not found' }, { status: 404 });
    }

    return NextResponse.json(
      {
        status: "OK",
        category,
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

export const PUT = async(req: NextRequest, {params}: {params: {id: string}},) => {
  const {id} = params;

  const {name} = await req.json();

  try {
    const category = await prisma.category.update({
      where: {
        id: parseInt(id),
      },
      data: {
        name,
      },
    });

    return NextResponse.json({status: 'OK', category}, {status: 200});
  } catch (error) {
    console.error('Error updating category:', error);
    if (error instanceof Error)
      return NextResponse.json({status: error.message}, {status: 400});
  }
}

export const DELETE = async(req: NextRequest, {params}: {params: {id: string}}) => {

  const {id} = params;

  try {
    // カテゴリが存在するか確認
    const category = await prisma.category.findUnique({
      where: {
        id: parseInt(id),
      },
    });

    if (!category) {
      return NextResponse.json({status: 'Category not found'}, {status: 404});
    }

    await prisma.category.delete({
      where: {
        id: parseInt(id),
      },
    });

    return NextResponse.json({status: 'OK'}, {status: 200});
  } catch (error) {
    console.error('Error deleting category:', error);
    if (error instanceof Error)
      return NextResponse.json({status: error.message}, {status: 400});
  }
}