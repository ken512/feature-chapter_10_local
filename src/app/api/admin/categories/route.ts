import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
const prisma = new PrismaClient();
export const GET = async () => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    return NextResponse.json({ status: "OK", categories }, { status: 200 });
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
  id: number;
  name: string;
};
export const POST = async (req: Request) => {
  try {
    const body = await req.json();
    console.log("Received Body:", body); // デバッグ用ログ
    const { categories }: { categories: CreateCategoryRequestBody[] } = body;
    if (!Array.isArray(categories)) {
      throw new Error("Categories should be an array");
    }
    if (categories.length === 0) {
      throw new Error("Categories are required");
    }
    const updatedCategories = await Promise.all(
      categories.map(async (category) => {
        if (!category.id || !category.name) {
          throw new Error("ID and Name are required for each category");
        }
        const existingCategory = await prisma.category.findUnique({
          where: { id: category.id },
        });
        if (existingCategory) {
          // 既存のカテゴリがある場合は投稿件数を増加
          return await prisma.category.update({
            where: { id: existingCategory.id },
            data: {
              categoryPost_count: existingCategory.categoryPost_count + 1,
            },
          });
        } else {
          throw new Error("Category not found");
        }
      })
    );
    return NextResponse.json({
      status: "OK",
      message: "カテゴリのカウントを増加しました",
      categories: updatedCategories,
    });
  } catch (error) {
    console.error("Error updating category count:", error); // エラーログを強化
    if (error instanceof Error) {
      return NextResponse.json({ status: error.message }, { status: 400 });
    } else {
      return NextResponse.json(
        { status: "Unknown error occurred" },
        { status: 400 }
      );
    }
  }
};
