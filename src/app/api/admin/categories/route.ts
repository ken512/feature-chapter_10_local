import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { categoriesOptions } from "@/types/categoriesOptions";

const prisma = new PrismaClient();
export const GET = async () => {
  try {
    // カテゴリと関連する投稿件数を取得
    const categories = await prisma.category.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        _count: {
          select: { posts: true }, // postCategoryテーブルのレコード数をカウント
        },
      },
    });

    const formattedCategories = categories.map((category) => ({
      id: category.id,
      name: category.name,
      PostCategory: category._count.posts,
    }));

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

type CreateCategoryRequestBody = {
  categoryId: {
    id: number;
    name: string;
  }[];
  postId?: number; // 記事が提供されない場合もあるので optional に変更
};



export const POST = async (req: Request) => {
// 特定の投稿（`postId`）とカテゴリ（`categoryId`）がデータベースに存在するかどうかを確認
  const postCategoryCreation = async (postId: number, categoryId: number) => {
    // postIdとcategoryIdの存在を確認
    const postExists = await prisma.post.findUnique({ where: { id: postId } });
    const categoryExists = await prisma.category.findUnique({
      where: { id: categoryId },
    });
  
    if (!postExists) {
      throw new Error(`Post with ID ${postId} does not exist.`);
    }
    if (!categoryExists) {
      throw new Error(`Category with ID ${categoryId} does not exist.`);
    }
  
    // postCategoryを作成
    return await prisma.postCategory.create({
      data: {
        postId,
        categoryId,
      },
    });
  };
  
  try {
    const { categoryId, postId }: CreateCategoryRequestBody = await req.json();

    if (!Array.isArray(categoryId)) {
      throw new Error("Categories should be an array");
    }
    if (categoryId.length === 0) {
      throw new Error("Categories are required");
    }

    const updatedCategories = await Promise.all(
      categoryId.map(async (category) => {
        try {
          // カテゴリIDと名前の存在確認。IDがあれば処理を続ける。
          if (!category.id || !category.name) {
            console.warn(
              `カテゴリ ${category.id} のIDまたは名前が不足しています`
            );
            return null; // IDや名前がない場合はスキップ
          }

          // 既存のカテゴリを探す
          let match = await prisma.category.findUnique({
            where: { id: category.id },
          });

          // 既存のカテゴリが見つからない場合、新しく作成
          if (!match) {
            match = await prisma.category.create({
              data: {
                id: category.id,
                name: category.name,
              },
            });
            console.log(`新しいカテゴリが作成されました: ${match.name}`);
          } else {
            console.log(`既存カテゴリが見つかりました: ${match.name}`);
          }

          if (postId) {
            await postCategoryCreation(postId, match.id);
            console.log(
              `投稿ID: ${postId} がカテゴリID: ${match.id} に関連付けられました`
            );
          }

          return match;
        } catch (error) {
          console.error(
            `カテゴリ ${category.id} の処理中にエラーが発生しました:`,
            error
          );
          return null; // エラーが発生した場合はスキップ
        }
      })
    );


    // nullを除去して、カテゴリリストを返す
    const nonNullCategories = updatedCategories.filter((cat) => cat !== null);

    // レスポンスを返す
    return NextResponse.json(
      {
        status: "OK",
        message: "カテゴリのカウントを更新しました！",
        categories: nonNullCategories,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error managing categories:", error);
    if (error instanceof Error) {
      return NextResponse.json({ status: error.message }, { status: 400 });
    }
  }
};

export const PUT = async (req: NextRequest) => {
  try {
    const { categories }: { categories: { id: string; name: string }[] } =
      await req.json();

    if (!Array.isArray(categories) || categories.length === 0) {
      throw new Error("カテゴリデータは必須です");
    }

    // カテゴリを更新
    const updatedCategories = await Promise.all(
      categories.map(async ({ id, name }) => {
        console.log(
          `Attempting to update categoryId: ${id} with name: ${name}`
        );
        const updatedCategory = await prisma.category.update({
          where: {
            id: parseInt(id),
          },
          data: {
            name, // 名前を更新
          },
        });
        console.log(`Updated category:`, updatedCategory);
        return updatedCategory;
      })
    );

    return NextResponse.json(
      { status: "OK", updatedCategories },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating categories:", error);
    if (error instanceof Error) {
      return NextResponse.json({ status: error.message }, { status: 400 });
    }
  }
};
