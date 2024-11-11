import { PrismaClient } from "@prisma/client";
import { getCurrentUser } from "@/utils/supabase";
import { NextRequest, NextResponse } from "next/server";
const prisma = new PrismaClient();

export const GET = async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  const {currentUser, error} = await getCurrentUser(request);

  if(error)
    return NextResponse.json({status: error.message}, {status: 400});

      
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
  categories: { id: number; name: string }[];
  thumbnailImageKey: string;
};

export const PUT = async (
  request: NextRequest,
  { params }: { params: { id: string }, categories: { id: string; name: string }[] } 
) => {
  
  const { currentUser, error } = await getCurrentUser(request)

  if (error)
    return NextResponse.json({ status: error.message }, { status: 400 })


  const { id } = params;
  // リクエストボディを取得
  const { title, content, categories, thumbnailImageKey }: UpdatePostRequestBody =
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
        thumbnailImageKey,
      },
    });

    console.log("Updated post:", post);

    //既存のpostCategoryを全て削除
await prisma.postCategory.deleteMany({
  where: { postId: post.id },  // この投稿に関連付けられたpostCategoryを削除
});

// カテゴリを投稿に紐付ける処理
for (const category of categories) {
  // カテゴリの存在確認、または新規作成
  const existingCategory = await prisma.category.findUnique({
    where: { id: category.id },
  });

  if (!existingCategory) {
    throw new Error(`Category with id ${category.id} does not exist.`);
  }
}

// 新しいpostCategoryを作成して投稿に紐付け
for (const category of categories) {
  await prisma.postCategory.create({
    data: {
      postId: post.id,
      categoryId: category.id,
    },
  });
}

    return NextResponse.json(
      { status: "OK", post: post, updatedCategories: categories },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating post:", error);
    if (error instanceof Error)
      return NextResponse.json({ status: error.message }, { status: 400 });
  }
};

// DELETEという命名にすることで、DELETEリクエストの時にこの関数が呼ばれる
export const DELETE = async (
  request: NextRequest,
  { params }: { params: { id: string } }, // ここでリクエストパラメータを受け取る
) => {
  const { currentUser, error } = await getCurrentUser(request)

    // currentUser を利用して、例えば投稿者の一致を検証するなど
    if (!currentUser) {
      return NextResponse.json({ status: "Unauthorized" }, { status: 403 });
    }

  if (error)
    return NextResponse.json({ status: error.message }, { status: 400 })

  // paramsの中にidが入っているので、それを取り出す
  const { id } = params

  try {
    // idを指定して、Postを削除
    await prisma.post.delete({
      where: {
        id: parseInt(id),
      },
    })

    // レスポンスを返す
    return NextResponse.json({ status: 'OK' }, { status: 200 })
  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json({ status: error.message }, { status: 400 })
  }
}
