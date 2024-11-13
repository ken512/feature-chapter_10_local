"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Header } from "@/app/_component/Header";
import { CategoriesCreateBtn } from "@/app/admin/posts/_components/CategoriesCreateButton";
import { CheckBox } from "@/app/admin/posts/_components/CheckBox";
import { DeleteBtn } from "@/app/admin/posts/_components/DeleteButton";
import { InlineDialog } from "@/app/admin/posts/_components/InlineDialog";
import { CategoryOption } from "@/types/CategoryOption";
import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession";
import "@/app/globals.css";

const CategoryList: React.FC = () => {
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [checkedValues, setCheckedValues] = useState<Set<number>>(new Set());
  const [selectAll, setSelectAll] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const { token } = useSupabaseSession();

  const fetchCategories = async () => {
    try {

      if (!token) return; // tokenがない場合、APIリクエストをスキップ

      const response = await fetch("/api/admin/categories",{
        headers: {
          "Content-Type": "application/json",
          Authorization: token, // ヘッダーにtokenを付与
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch categories");
      }
      const data = await response.json();
      console.log("Fetched Categories:", data.categories);
      setCategories(data.categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [token]); // 依存配列が空

  const handleDelete = async (categoryId: number) => {
    if (!categoryId || isNaN(categoryId)) {
      console.error("Invalid ID:", categoryId);
      return;
    }
    const response = await fetch(`/api/admin/categories/${categoryId}`, {
      method: "DELETE",
      headers: {Authorization: token || "", },
    });
    
    if (response.ok) {
      console.log("カテゴリーが削除されました！");
      setShowDeleteConfirm(false);
      await fetchCategories(); // APIを再取得して最新のデータをセット
      setCheckedValues((prev) => {
        const newCheckedValues = new Set(prev);
        newCheckedValues.delete(categoryId);
        return newCheckedValues;
      });
    } else {
      console.log("カテゴリーの削除に失敗しました！");
    }
  };
  const handleCheckBoxChange = (categoryId: number, checked: boolean) => {
    setCheckedValues((prev) => {
      const newCheckedValues = new Set(prev);
      if (checked) {
        newCheckedValues.add(categoryId);
      } else {
        newCheckedValues.delete(categoryId);
      }
      return newCheckedValues;
    });
  };
  const handleSelectAllChange = () => {
    if (selectAll) {
      setCheckedValues(new Set()); // 全解除
    } else {
      const allIds = categories.map((category) => category.id);
      setCheckedValues(new Set(allIds)); // 全選択
    }
    setSelectAll(!selectAll); // 状態を切り替え
  };
  const handleBulkDelete = () => {
    setShowDeleteConfirm(true);
  };
  const confirmBulkDelete = async () => {
    const categoryIds = Array.from(checkedValues);
    for (const categoryId of categoryIds) {
      await handleDelete(categoryId);
    }
    setCheckedValues(new Set());
    alert("カテゴリーが削除されました！"); // アラートを表示
  };
  // 全てのカテゴリが選択されているかチェックする
  useEffect(() => {
    if (categories.length === checkedValues.size) {
      setSelectAll(true);
    } else {
      setSelectAll(false);
    }
  }, [checkedValues, categories]);
  return (
    <div className="sm:w-[430px]">
      <Header />
      <div className="flex items-center justify-between py-6 px-7 h-15 ">
        <h1 className="py-3 text-3xl font-bold md:text-5xl">カテゴリ一覧</h1>
        <InlineDialog
          isOpen={showDeleteConfirm}
          onClose={() => setShowDeleteConfirm(false)}
          onConfirm={confirmBulkDelete}
        />
      </div>
      <div className="md:text-2xl">
        {/* 全選択・全解除ボタン */}
        <div className="mb-4 mx-24 sm:mx-4 ">
          <CheckBox
            checked={selectAll}
            onChange={handleSelectAllChange}
            onClick={(event) => {
              event.stopPropagation();
            }}
          />
          <span>全選択 / 全解除</span>
        </div>
        {/* カテゴリリスト */}
        {categories.map((category: CategoryOption) => (
          <div key={category.id} className="cursor-pointer">
            <Link href={`/admin/categories/${category.id}`}>
              <div className="mx-20 border-b border-gray-300 p-4 hover:bg-gray-100 cursor-pointer sm:mx-0">
                <CheckBox
                  checked={checkedValues.has(category.id)}
                  onChange={(e) => {
                    handleCheckBoxChange(category.id, e.target.checked);
                  }}
                  onClick={(event) => {
                    event.stopPropagation();
                  }}
                />
                <span className="font-bold mx-10 flex items-center justify-between sm:mx-0">
                  <span className="text-lg text-gray-700 md:text-2xl">
                    {category.name}
                  </span>
                </span>
              </div>
            </Link>
          </div>
        ))}
        <div className="flex items-center justify-center my-10">
          <CategoriesCreateBtn />
          <DeleteBtn ClickDelete={handleBulkDelete} postId={0} />
        </div>
      </div>
    </div>
  );
};
export default CategoryList;
