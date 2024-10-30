"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/app/_component/Header";
import { CreateBtn } from "../../posts/_components/CreateButton"; 
import { CreateDialog } from "@/app/admin/posts/_components/CreateDialog";
import { CategoriesForm } from "@/app/admin/posts/_components/CategoriesForm";
import { ErrorsType } from "@/types/ErrorType";
import "@/app/globals.css";

const CategoriesPost: React.FC = () => {
  const router = useRouter();
  const [name, setName] = useState("");
  const [errors, setErrors] = useState<ErrorsType>({});
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false); // 作成ダイアログ表示状態

  const validate = () => {
    const tempErrors: ErrorsType = {};
    if (name.trim().length === 0) {
      tempErrors.categories = "カテゴリは必須です。";
    }
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return; // バリデーション失敗時は処理を中断
    setIsCreateDialogOpen(true);

    try {
      const categoryResponse = await fetch("/api/admin/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name }), // postIdは送らない
      });

      const result = await categoryResponse.json();

      if (!categoryResponse.ok) {
        throw new Error(result.status || "カテゴリの作成に失敗しました");
      }

      console.log("カテゴリが作成されました:", result);
    } catch (error) {
      console.error("カテゴリの作成に失敗しました:", error);
    }
  };

  const closeDialog = async () => {
    setIsCreateDialogOpen(false);
    router.push("/admin/categories");
  };

  return (
    <div className="sm:w-[430px]">
      <Header />
      <div className="m-10">
        <h1 className="text-4xl font-bold sm:text-3xl md:text-5xl">
          カテゴリ作成
        </h1>
      </div>
      <div className="p-5">
        <CategoriesForm
          name={name}
          setName={setName}
          onSubmit={handleSubmit}
          errors={errors}
        />
        <div className="flex justify-center">
          <CreateBtn
            clickCreate={handleSubmit}
          />
        </div>
        <CreateDialog
          isOpen={isCreateDialogOpen}
          onClose={closeDialog}
          onConfirm={closeDialog}
        />
      </div>
    </div>
  );
};

export default CategoriesPost;
