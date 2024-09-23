"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Header } from "@/app/_component/Header";
import { CategoryOption } from "@/types/CategoryOption";
import { InlineDialog } from "@/app/admin/posts/_components/InlineDialog";
import { CategoriesForm } from "@/app/admin/posts/_components/CategoriesForm";
import { UpdateDelete } from "@/app/admin/posts/_components/UpdateDeleteBtn";
import { ErrorsType } from "@/types/ErrorType";
import { UpDateDialog } from "@/app/admin/posts/_components/UpDateDialog"; // インポートパスを修正
import "@/app/globals.css";
const CategoryEdit: React.FC = () => {
  const router = useRouter();
  const { id } = useParams();
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<CategoryOption[]>([]); // 修正
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showUpdateConfirm, setShowUpdateConfirm] = useState(false); // 追加
  const [errors, setErrors] = useState<ErrorsType>({});
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/admin/categories");
        if (!response.ok) {
          throw new Error("Failed to fetch categories");
        }
        const data = await response.json();
        const validCategories = data.categories.map((category: CategoryOption) => ({
          value: category.id,
          label: category.name,
          categoryPost_count: category.categoryPost_count || 0,
        }));
        setCategories(validCategories); // すべてのカテゴリをセット
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories(); // 初期表示で全てのカテゴリを取得
  }, []);

  const handleUpdate = async () => {
    if (selectedCategories.length === 0) {
      setErrors({ categories: "カテゴリは必須です" });
      return;
    }
    const updatedCategories = selectedCategories.map(category => ({
      id: category.id,
      name: category.name,
      post_count: category.categoryPost_count + 1,
    }));
    try {
      const responses = await Promise.all(updatedCategories.map(category =>
        fetch(`/api/admin/categories/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(category),
        })
      ));
      if (responses.every(response => response.ok)) {
        console.log("カテゴリが更新されました");
        console.log("Updated Category:", selectedCategories);
        setShowUpdateConfirm(true); // 更新成功時にダイアログを表示
      } else {
        console.error("カテゴリの更新に失敗しました");
      }
    } catch (error) {
      console.error("エラーが発生しました:", error);
    }
  };

  const handleDelete = async () => {
    if (selectedCategories.length === 0) {
      alert("削除するカテゴリを選択してください。");
      return;
    }
    try {
      const responses = await Promise.all(selectedCategories.map(category =>
        fetch(`/api/admin/categories/${category.id}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        })
      ));
      if (responses.every(response => response.ok)) {
        console.log("カテゴリが削除されました");
        setShowDeleteConfirm(false);
        alert("カテゴリが削除されました！");
        router.push("/admin/categories");
      } else {
        throw new Error("削除に失敗しました");
      }
    } catch(error)  {
      setErrors({ categories: "カテゴリの削除に失敗しました。"});
      console.error("エラーが発生しました:", error);
    }
  };

  const toggleCategory = (category: CategoryOption) => {
    setSelectedCategories(prevCategories =>
prevCategories.some(c => c.value === category.value)
        ? prevCategories.filter(c => c.value !== category.value)
        : [...prevCategories, category]
    );
  };
  const handleUpdateConfirm = () => {
    setShowUpdateConfirm(false);
    router.push("/admin/categories");
  };

  return (
    <div className="overflow-hidden">
      <Header />
      <div className="m-10">
        <h1 className="text-4xl font-bold md:text-5xl">カテゴリ編集</h1>
      </div>
      <div className="p-5">
        <CategoriesForm
          categories={categories}
          toggleCategory={toggleCategory}
          selectedCategories={selectedCategories} // 修正
          errors={errors}
        />
        <UpdateDelete
          ClickUpdate={handleUpdate}
          ClickDelete={() => setShowDeleteConfirm(true)}
          isDeleteDisabled={selectedCategories.length === 0} // 修正
        />
        <InlineDialog
          visible={showDeleteConfirm}
          onClose={() => setShowDeleteConfirm(false)}
          onConfirm={handleDelete}
        />
        <UpDateDialog
          visible={showUpdateConfirm} // 更新成功時のダイアログ
          onConfirm={handleUpdateConfirm}
        />
      </div>
    </div>
  );
};
export default CategoryEdit;