import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { categoriesOptions } from "@/types/categoriesOptions";

const prisma = new PrismaClient();

export const GET = async () => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        _count: {
          select: { posts: true },
        },
      },
    });

    const formattedCategories = categories.map((category) => ({
      id: category.id,
      name: category.name,
      PostCategory: category._count.posts,
    }));

    // 最初のカテゴリを単一オブジェクトとして追加
    const category = formattedCategories.length > 0 ? formattedCategories[0] : null;

    // 選択済みカテゴリを設定（例としてPostCategoryが1以上のものを選択済みとする）
    const postCategories = formattedCategories
      .filter((category) => category.PostCategory > 0)
      .map((category) => ({
        category: {
          id: category.id,
          name: category.name,
        },
      }));

    const post = { postCategories };

    return NextResponse.json(
      {
        status: "OK",
        categories: formattedCategories,
        categoriesOptions,
        post,
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