"use client";
import React, { FormEvent } from "react";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Header } from "@/app/_component/Header";
import { CategoryOption } from "@/types/CategoryOption";
import { DetailsForm } from "../_components/ DetailsForm";
import { UpdateClear } from "../../posts/_components/UpdateClearButton";
import { UpDateDialog } from "../_components/UpDateDialog";
import { ErrorsType } from "@/types/ErrorType";
import "@/app/globals.css";

const Page: React.FC = () => {
  const router = useRouter();
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<
    CategoryOption[]
  >([]);
  const [errors, setErrors] = useState<ErrorsType>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [showUpdateConfirm, setShowUpdateConfirm] = useState(false);

  useEffect(() => {
    if (id) {
      const fetchData = async () => {
        try {
          const response = await fetch(`/api/admin/posts/${id}`);
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data = await response.json();
          console.log("Fetched Data:", data);
          const post = data.post;
          if (post) {
            setTitle(post.title);
            setContent(post.content);
            setThumbnailUrl(post.thumbnailUrl);
  
            const formattedCategories = data.categories.map(
              (category: CategoryOption) => ({
                id: category.id,
                name: category.name,
              })
            );
            setCategories(formattedCategories);

             // 選択済みカテゴリをセット
              const selected = post.selectedCategories.map(
              (category: CategoryOption) => ({
                id: category.id,
                name: category.name,
              })
            );
            setSelectedCategories(selected); // 初期選択状態を設定
  
          } else {
            throw new Error("Post not found");
          }
        } catch (error) {
          console.error("Error fetching post:", error);
        }
      };
      fetchData();
    }
  }, [id]);

  const handleUpdate = async (e: FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return; // 二重送信防止
    setIsSubmitting(true);

    // エラーチェックを行い、エラーがあれば処理を中断
  const tempErrors: ErrorsType = {};
  if (!title) tempErrors.title = "タイトルは必須です。";
  if (!content) tempErrors.content = "コンテンツは必須です。";
  if (!thumbnailUrl) tempErrors.thumbnailUrl = "サムネイルURLは必須です。";
  if (selectedCategories.length === 0)
    tempErrors.categories = "カテゴリは必須です。";
  setErrors(tempErrors);

  if (Object.keys(tempErrors).length > 0) {
    setIsSubmitting(false);
    return; // エラーがある場合は処理を中断
  }

    const validCategories = selectedCategories.filter(
      (category) => category.id && category.name
    );

    if (validCategories.length === 0) {
      console.error("有効なカテゴリがありません。");
      setIsSubmitting(false);
      return;
    }

      // validCategoriesからカテゴリIDのみを抽出
  const upDateCategories = validCategories.map((category: CategoryOption) => ({
    id: category.id,  // idをバックエンドに送るために正しく設定
    name: category.name,
  }));

    const submitPost = {
      title,
      content,
      thumbnailUrl,
      categories: upDateCategories,  // カテゴリIDリストを送信
    };

    console.log("Submitting post data:", submitPost);

    const response = await fetch(`/api/admin/posts/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(submitPost),
    });
    if (response.ok) {
      setShowUpdateConfirm(true);
      console.log("記事が更新されました");
    } else {
      console.error("記事の更新に失敗しました");
    }
    setIsSubmitting(false); // サブミット状態を解除
  };

  const handleClear = () => {
    setTitle("");
    setContent("");
    setThumbnailUrl("");
    setSelectedCategories([]);
  };

  const handleUpdateConfirm = () => {
    setShowUpdateConfirm(false);
    router.push("/admin/posts");
  };

  const toggleCategory = (category: CategoryOption) => {
    console.log("Selected category:", category); // デバッグ
    if (!category.name || !category.name) {
      console.warn("無効なカテゴリが選択されました:", category);
      return;
    }
    
    setSelectedCategories((prevCategories) =>
      prevCategories.some((c: CategoryOption) => c.name === category.name)
        ? prevCategories.filter(
            (c: CategoryOption) => c.name !== category.name
          )
        : [...prevCategories, category]
    );
  };

  return (
    <div className="overflow-hidden">
      <Header />
      <div className="m-10">
        <h1 className="text-4xl font-bold">記事編集</h1>
      </div>
      <div className="p-5">
        <DetailsForm
          title={title}
          setTitle={setTitle}
          content={content}
          setContent={setContent}
          thumbnailUrl={thumbnailUrl}
          setThumbnailUrl={setThumbnailUrl}
          categories={categories}
          setCategories={setCategories}
          selectedCategories={selectedCategories}
          toggleCategory={toggleCategory}
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
export default Page;
