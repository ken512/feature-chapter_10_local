import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

export const GET = async (request: NextRequest) => {
   // リクエストのメタ情報をログに記録
    console.log('Request method:', request.method);
    console.log('Request URL:', request.url);
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
      },
    });

    return NextResponse.json({ status: 'OK', posts: posts }, { status: 200 });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ status: error.message }, { status: 400 });
    }
  }
};

type CreatePostRequestBody = {
  title: string;
  content: string;
  thumbnailUrl: string;
  categories: { id: number; name: string }[];
};

export const POST = async (req: NextRequest) => {
  try {
    const { title, content, thumbnailUrl, categories }: CreatePostRequestBody = await req.json();

    if (!title || !content || !thumbnailUrl || !categories || categories.length === 0) {
      throw new Error("Invalid input data");
    }

    // 送信されたカテゴリIDの配列
    const categoryIds = categories.map((category) => category.id);

    // カテゴリIDが存在するかを確認
    const existingCategories = await prisma.category.findMany({
      where: {
        id: {
          in: categoryIds,
        },
      },
    });

    // 存在しないカテゴリIDを特定
    const existingCategoryIds = existingCategories.map((category) => category.id);
    const nonExistingCategories = categories.filter((category) => !existingCategoryIds.includes(category.id));

    // 存在しないカテゴリを追加
    const createdCategories = [];
    for (const category of nonExistingCategories) {
      const newCategory = await prisma.category.create({
        data: {
          id: category.id,  // フロントから渡されたIDを使用
          name: category.name,  // 名前も必要になる
        },
      });
      createdCategories.push(newCategory);
    }

    // 最終的なカテゴリリスト
    const allCategories = [...existingCategories, ...createdCategories];

    // Postの作成
    const post = await prisma.post.create({
      data: {
        title,
        content,
        thumbnailUrl,
      },
    });

    // PostCategoryの作成
    await prisma.postCategory.createMany({
      data: allCategories.map((category) => ({
        postId: post.id,
        categoryId: category.id,
      })),
    });

    return NextResponse.json({ status: 'OK', post: post }, { status: 200 });
  } catch (error) {
    console.error('Error creating post:', error);
    if (error instanceof Error) {
      return NextResponse.json({ status: error.message }, { status: 400 });
    }
  }
};