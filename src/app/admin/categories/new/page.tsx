"use client";
import React, { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/app/_component/Header";
import { CategoryOption } from "@/types/CategoryOption";
import { CreateBtn } from "@/app/admin/posts/_components/CreateButton";
import { CategoriesClearBtn } from "../../posts/_components/CategoriesClearButton";
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
            post_count: category.PostCategory || 0,
          })
        );
        setFetchedCategories(validCategories);
        setFetchedCategories(data.categoriesOptions);
        console.log("Fetched Data:",data);
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
    if (isSubmitting) return; // 二重送信防止
    if (!validate()) return; // バリデーション失敗時は処理を中断
    setIsSubmitting(true);
  
    const validCategories = selectedCategories.filter(
      (category) => category.id && category.name
    );
  
    if (validCategories.length === 0) {
      console.error("有効なカテゴリがありません。");
      setIsSubmitting(false);
      return;
    }
  
    // バックエンドの期待する形式にデータを整形
    const newCategories = validCategories.map((c: CategoryOption) => ({
      id: c.id, // バックエンドが期待するID
      name: c.name, // バックエンドが期待する名前
    }));
  
    console.log("送信するカテゴリデータ:", newCategories);
  
    // postIdを指定（例: ここでは仮に1を指定していますが、実際の投稿IDを使用してください）
    const postId = 1;
  
    try {
      const categoryResponse = await fetch("/api/admin/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ categories: newCategories, postId }), // postIdを含めて送信
      });
  
      const result = await categoryResponse.json();
  
      if (!categoryResponse.ok) {
        throw new Error(result.status || "カテゴリの作成に失敗しました");
      }
  
      console.log("カテゴリが作成されました:", result);
      setShowCreateConfirm(true);
  
      setCategories((prevCategories) =>
        prevCategories.map((category) => {
          const matchingNewCategory = newCategories.find((newCat) => newCat.name === category.name);
          if (matchingNewCategory) {
            // バックエンドから返ってきたデータを使用して正しく更新する
            return { ...category, categoryPost_count: (category.PostCategory || 0) + 1 };
          }
          return category;
        })
      );

    } catch (error) {
      console.error("カテゴリの作成に失敗しました:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleCategory = (category: CategoryOption) => {
    console.log("Selected category:", category); 
    if (!category.id || !category.name) {
      console.warn("無効なカテゴリが選択されました:", category);
      return;
    }

    setSelectedCategories((prevCategories) =>
      prevCategories.some((c: CategoryOption) => c.id === category.id)
        ? prevCategories.filter(
            (c: CategoryOption) => c.id !== category.id
          )
        : [...prevCategories, category]
    );
    }

  const handleCreateConfirm = async () => {
    setShowCreateConfirm(false);
    router.push("/admin/categories");
  };

  const handleClear = () => {
    // カテゴリの選択状態だけをクリアする
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
          <CreateBtn clickCreate={handleSubmit} />
          <CategoriesClearBtn
            categories={categories}
            clickClear={handleClear}
          />
        </div>
        <CreateDialog
          isOpen={showCreateConfirm}
          onClose={handleCreateConfirm}
          onConfirm={handleCreateConfirm}
        />
      </div>
    </div>
  );
};

export default CategoriesPost;
