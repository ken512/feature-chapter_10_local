"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/app/_component/Header";
import { DetailsCategoriesForm } from "../../posts/_components/DetailsCategoriesForm";
import { CategoryOption } from "@/types/CategoryOption";
import { UpdateClear } from "../../posts/_components/UpdateClearButton";
import { UpDateDialog } from "@/app/admin/posts/_components/UpDateDialog";
import { ErrorsType } from "@/types/ErrorType";
import "@/app/globals.css";

const CategoryEdit: React.FC = () => {
  const router = useRouter();
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<
    CategoryOption[]
  >([]);
  const [errors, setErrors] = useState<ErrorsType>({});
  const [showUpdateConfirm, setShowUpdateConfirm] = useState(false);

  const handleUpdate = async () => {
    if (selectedCategories.length === 0) {
      setErrors({ categories: "カテゴリは必須です" });
      return;
    }

    const categoriesToUpdate = selectedCategories.map((category) => ({
      id: category.id,
      name: category.name,
    }));

    try {
      const response = await fetch("/api/admin/categories", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ categories: categoriesToUpdate }), // 選択されたカテゴリを送信
      });

      if (response.ok) {
        const responseData = await response.json();
        const updatedCategories: CategoryOption[] =
          responseData.updatedCategories;

        console.log("カテゴリが更新されました");
        console.log("Updated Categories:", updatedCategories);

        // フロントエンドの状態を更新
        setCategories((prevCategories) => {
          // updatedCategories の内容に基づいて prevCategories を更新(カテゴリIDに基づいてカテゴリ名が正しく反映)
          return prevCategories.map((category) => {
            const foundCategory = updatedCategories.find(
              (updated) => updated.id === category.id
            );
            return foundCategory
              ? { ...category, name: foundCategory.name }
              : category;
          });
        });

        setShowUpdateConfirm(true);
      } else {
        console.error("カテゴリの更新に失敗しました");
      }
    } catch (error) {
      console.error("エラーが発生しました:", error);
    }
  };

  const handleClear = () => {
    setSelectedCategories([]);
  };

  const handleUpdateConfirm = () => {
    setShowUpdateConfirm(false);
    router.push("/admin/categories");
  };

  const toggleCategory = (category: CategoryOption) => {
    console.log("Selected category:", category); // デバッグ
    if (!category.value || !category.name) {
      console.warn("無効なカテゴリが選択されました:", category);
      return;
    }

    setSelectedCategories((prevCategories) =>
      prevCategories.some((c: CategoryOption) => c.value === category.value)
        ? prevCategories.filter(
            (c: CategoryOption) => c.value !== category.value
          )
        : [...prevCategories, category]
    );
  };

  return (
    <div>
      <Header />
      <div className="m-10">
        <h1 className="text-4xl font-bold md:text-5xl">カテゴリ編集</h1>
      </div>
      <div className="p-5">
        <DetailsCategoriesForm
          categories={categories}
          toggleCategory={toggleCategory}
          setCategories={setCategories}
          setSelectedCategories={setSelectedCategories}
          selectedCategories={selectedCategories}
          errors={errors}
        />
        <UpdateClear ClickUpdate={handleUpdate} ClickClear={handleClear} />
        <UpDateDialog
          isOpen={showUpdateConfirm}
          onClose={handleUpdateConfirm}
          onConfirm={handleUpdateConfirm}
        />
      </div>
    </div>
  );
};
export default CategoryEdit;
