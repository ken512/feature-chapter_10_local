"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Header } from "@/app/_component/Header";
import { CategoriesForm } from "@/app/admin/posts/_components/CategoriesForm";
import { UpdateDelete } from "../../posts/_components/UpdateDeleteButton"; 
import { UpDateDialog } from "../../posts/_components/UpDateDialog";
import { InlineDialog } from "../../posts/_components/InlineDialog";
import { ErrorsType } from "@/types/ErrorType";
import "@/app/globals.css";

const CategoryEdit: React.FC = () => {
  const { id } = useParams();
  const router = useRouter();
  const [name, setName] = useState(""); // カテゴリ名の初期値
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false); // 削除ダイアログ表示状態
  const [errors, setErrors] = useState<ErrorsType>({});

  // バリデーション関数
  const validate = () => {
    const tempErrors: ErrorsType = {};
    if (name.trim().length === 0) {
      tempErrors.categories = "カテゴリは必須です。";
    }
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  // 更新処理
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const response = await fetch(`/api/admin/categories/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name }),
      });

      if (response.ok) {
        setIsDialogOpen(true); // ダイアログを表示
      } else {
        console.error("カテゴリの更新に失敗しました");
        setErrors({ categories: "カテゴリの更新に失敗しました" });
      }
    } catch (error) {
      console.error("エラーが発生しました:", error);
      setErrors({ categories: "エラーが発生しました" });
    }
  };

    // 削除確認ダイアログを開く
    const openDeleteDialog = () => {
      setIsDeleteDialogOpen(true);
    };

  // 削除処理
  const handleDelete = async () => {
    if (!confirm("カテゴリを削除しますか？")) return;

    try {
      await fetch(`/api/admin/categories/${id}`, {
        method: "DELETE",
      });

      setIsDeleteDialogOpen(false); // 削除ダイアログを閉じる
      router.push("/admin/categories");
    } catch (error) {
      console.error("削除エラーが発生しました:", error);
    }
  };

  // カテゴリIDに基づきデータを取得し、初期表示
  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const res = await fetch(`/api/admin/categories/${id}`);
        const data = await res.json();
        if (data.category) {
          setName(data.category.name); // カテゴリ名を初期表示用に設定
        } else {
          console.error("カテゴリデータが見つかりませんでした");
        }
      } catch (error) {
        console.error("カテゴリの取得中にエラーが発生しました:", error);
      }
    };
    fetchCategory();
  }, [id]); // idが変更されるたびに再実行

  const closeDialog = () => {
    setIsDialogOpen(false);
    router.push("/admin/categories");
  };

  return (
    <div>
      <Header />
      <div className="m-10">
        <h1 className="text-4xl font-bold md:text-5xl">カテゴリ編集</h1>
      </div>
      <div className="p-5">
        <CategoriesForm
          name={name} 
          setName={setName}
          onSubmit={handleUpdate} // 更新処理を渡す
          errors={errors}
        />
      </div>
      <UpdateDelete
        ClickUpdate={handleUpdate}
        ClickDelete={openDeleteDialog}
        isDeleteDisabled={!name} // 名前がない場合削除ボタンを無効化
      />

      {/* 更新完了のダイアログ */}
      <UpDateDialog
        isOpen={isDialogOpen}
        onClose={closeDialog}
        onConfirm={closeDialog} // OKボタンが押されたときにダイアログを閉じる
      />
      <InlineDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDelete}
      />
    </div>
  );
};

export default CategoryEdit;
