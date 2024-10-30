"use client";
import React, { useState, FormEvent} from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/app/_component/Header";
import { CategoryOption } from "@/types/CategoryOption";
import { ArticleForm } from "@/app/admin/posts/_components/ArticleForm";
import { CreateBtn } from "@/app/admin/posts/_components/CreateButton";
import { ClearBtn } from "../_components/ClearButton";
import { CreateDialog } from "@/app/admin/posts/_components/CreateDialog";
import { ErrorsType } from "@/types/ErrorType";
import "@/app/globals.css";

const NewArticle: React.FC = () => {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errors, setErrors] = useState<ErrorsType>({});
  const [showCreateConfirm, setShowCreateConfirm] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<
    CategoryOption[]
  >([]);

    

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
  
    // エラーチェック
    const tempErrors: ErrorsType = {};
    if (!title) tempErrors.title = "タイトルは必須です。";
    if (!content) tempErrors.content = "コンテンツは必須です。";
    if (!thumbnailUrl) tempErrors.thumbnailUrl = "サムネイルURLは必須です。";
    if (selectedCategories.length === 0)
      tempErrors.categories = "カテゴリは必須です。";
    setErrors(tempErrors);
  
    if (Object.keys(tempErrors).length > 0) {
      setIsSubmitting(false);
      return;
    }
  
    // 選択されたカテゴリのみを送信
    const validCategories = selectedCategories.filter(
      (category) => category.id && category.name
    );
  
    if (validCategories.length === 0) {
      console.error("有効なカテゴリがありません。");
      setIsSubmitting(false);
      return;
    }
  
    try {
      const response = await fetch("/api/admin/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          content,
          thumbnailUrl,
          categories: validCategories, // 選択されたカテゴリのみ送信
        }),
      });
  
      if (response.ok) {
        console.log("記事が作成されました");
        setShowCreateConfirm(true); // 作成ダイアログを表示
      }
    } catch (error) {
      console.error("エラーが発生しました:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleCategory = (category: CategoryOption) => {
    console.log("Selected category:", category); // デバッグ
  
    setSelectedCategories((prevCategories) =>
      prevCategories.some((c: CategoryOption) => c.id === category.id)
        ? prevCategories.filter((c: CategoryOption) => c.id !== category.id)
        : [...prevCategories, category]
    );
  };

  const handleCreateConfirm = () => {
    setShowCreateConfirm(false);
    router.push("/");
  };
  const handleClear = () => {
    setTitle("");
    setContent("");
    setThumbnailUrl("");
    setSelectedCategories([]);
  };
  return (
    <div className="sm:w-[430px] sm:m-0 sm:p-0 md:w-[1024px]">
      <Header />
      <div className="m-10">
        <h1 className="text-4xl font-bold sm:text-3xl md:text-5xl">記事作成</h1>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="p-5">
          <ArticleForm
            title={title}
            setTitle={setTitle}
            content={content}
            setContent={setContent}
            thumbnailUrl={thumbnailUrl}
            setThumbnailUrl={setThumbnailUrl}
            categories={categories}
            setCategories={setCategories}
            toggleCategory={toggleCategory}
            selectedCategories={selectedCategories}
            errors={errors}
          />
        </div>
        <div className="flex justify-center">
          <CreateBtn clickCreate={handleSubmit} />
          <ClearBtn ClickClear={handleClear} />
        </div>
        <CreateDialog
          isOpen={showCreateConfirm}
          onClose={handleCreateConfirm}
          onConfirm={handleCreateConfirm} // ダイアログのOKボタンをクリックしたときの処理
        />
      </form>
    </div>
  );
};

export default NewArticle;
