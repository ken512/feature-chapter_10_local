"use client";
import React, { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/app/_component/Header";
import { CategoryOption } from "@/types/CategoryOption";
import { CreateBtn } from "@/app/admin/posts/_components/CreateBtn";
import { CategoriesClearBtn } from "../../posts/_components/CategoriesClearBtn";
import { CreateDialog } from "@/app/admin/posts/_components/CreateDialog";
import { CategoriesForm } from "@/app/admin/posts/_components/CategoriesForm";
import { ErrorsType } from "@/types/ErrorType";
import "@/app/globals.css";

const CategoriesPost: React.FC = () => {
  const router = useRouter();
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [fetchedCategories, setFetchedCategories] = useState<CategoryOption[]>([]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errors, setErrors] = useState<ErrorsType>({});
  const [showCreateConfirm, setShowCreateConfirm] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<CategoryOption[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/admin/categories");
        if (!response.ok) {
          throw new Error("Failed to fetch categories");
        }
        const data = await response.json();
        const validCategories = data.categories.map(
          (category: CategoryOption) => ({
            ...category,
            post_count: category.categoryPost_count || 0,
          })
        );
        setFetchedCategories(validCategories);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  const validate = () => {
    const tempErrors: ErrorsType = {};
    if (selectedCategories.length === 0)
      tempErrors.categories = "カテゴリは必須です。";

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    if (isSubmitting) return;
    setIsSubmitting(true);
    
    const validCategories = selectedCategories.filter(
      (category) => category.value && category.name
    );

    if (validCategories.length === 0) {
      console.error("有効なカテゴリがありません。");
      setIsSubmitting(false);
      return;
    }

    const newCategories = validCategories.map((c: CategoryOption) => ({
      id: c.value,
      name: c.name,
    }));

    try {
      const response = await fetch("/api/admin/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ categories: newCategories }),
      });

      if (response.ok) {
        const result = await response.json();
        console.log("カテゴリが作成されました:", result);
        setShowCreateConfirm(true);

        setFetchedCategories((prevCategories) =>
          prevCategories.map((category) =>
            newCategories.some((newCat) => newCat.name === category.name)
              ? { ...category, categoryPost_count: (category.categoryPost_count || 0) + 1 }
              : category
          )
        );
      } else {
        const errorData = await response.json();
        console.error("カテゴリの作成に失敗しました:", errorData.status);
      }
    } catch (error) {
      console.error("エラーが発生しました:", error);
    } finally {
      setIsSubmitting(false);
    }
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

  const handleCreateConfirm = async () => {
    setShowCreateConfirm(false);
    router.push("/admin/categories");
  };

  const handleClear = () => {
    setCategories([]);
    setSelectedCategories([]);
  };

  return (
    <div className="sm:w-[430px]">
      <Header />
      <div className="m-10">
        <h1 className="text-4xl font-bold sm:text-3xl md:text-5xl">カテゴリ作成</h1>
      </div>
      <div className="p-5">
        <CategoriesForm
          categories={fetchedCategories}
          toggleCategory={toggleCategory}
          selectedCategories={selectedCategories}
          errors={errors}
        />
        <div className="flex justify-center">
          <CreateBtn ClickCreate={handleSubmit} />
          <CategoriesClearBtn
            categories={categories}
            ClickClear={handleClear}
          />
        </div>
        <CreateDialog
          visible={showCreateConfirm}
          onConfirm={handleCreateConfirm}
        />
      </div>
    </div>
  );
};

export default CategoriesPost;
