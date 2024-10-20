import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { categoriesOptions } from "@/types/categoriesOptions";
const prisma = new PrismaClient();

export const GET = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  const { id } = params;

  try {
    // 記事を取得し、関連するカテゴリを含める
    const post = await prisma.post.findUnique({
      where: {
        id: parseInt(id),
      },
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
    });

    if (!post) {
      return NextResponse.json(
        { status: "Error", message: "Post not found" },
        { status: 404 }
      );
    }

    // すべてのカテゴリを取得
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

    // カテゴリ情報を整形
    const formattedCategories = categories.map((category) => ({
      id: category.id,
      name: category.name,
      PostCategory: category._count.posts,
    }));

    // 記事に関連付けられたカテゴリを選択済みとして設定
    const selectedCategories = post.postCategories.map((postCategory) => ({
      id: postCategory.category.id,
      name: postCategory.category.name,
    }));

    console.log("Selected categories for post:", selectedCategories);

    return NextResponse.json(
      {
        status: "OK",
        post: {
          ...post,
          selectedCategories, // 選択済みカテゴリを含める
        },
        categories: formattedCategories,
        categoriesOptions,
      },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json({ status: error.message }, { status: 400 });
  }
};

type UpdatePostRequestBody = {
  title: string;
  content: string;
  categories: { id: number; name: string}[];
  thumbnailUrl: string;
};

export const PUT = async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  const { id } = params;

  // リクエストボディを取得
  const { title, content, categories, thumbnailUrl }: UpdatePostRequestBody =
    await request.json();

  try {
    // ポストのその他の情報を更新
    const post = await prisma.post.update({
      where: {
        id: parseInt(id),
      },
      data: {
        title,
        content,
        thumbnailUrl,
      },
    });

    console.log("Updated post:", post);

    // 既存のカテゴリを削除
    await prisma.postCategory.deleteMany({
      where: {
        postId: parseInt(id),
      },
    });

    // 新しいカテゴリを関連付け
    for (const category of categories) {
      // カテゴリを更新または作成
      const updatedCategory = await prisma.category.upsert({
        where: { id: category.id },
        update: {
          name: category.name, // カテゴリ名を更新
        },
        create: {
          id: category.id,
          name: category.name,
        },
      });

      // カテゴリを投稿に関連付け
      await prisma.postCategory.create({
        data: {
          postId: post.id,
          categoryId: updatedCategory.id,
        },
      });
    }

    return NextResponse.json({ status: "OK", post: post, updatedCategories: categories }, { status: 200 });
  } catch (error) {
    console.error("Error updating post:", error);
    if (error instanceof Error)
      return NextResponse.json({ status: error.message }, { status: 400 });
  }
};

export const DELETE = async (
  req: Request,
  { params }: { params: { id: string } }
) => {
  const { id } = params;

  try {
    await prisma.post.delete({
      where: {
        id: parseInt(id),
      },
    });

    return NextResponse.json({ status: "OK" }, { status: 200 });
  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json({ status: error.message }, { status: 400 });
  }
};
