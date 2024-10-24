"use client";
import React, { useState, useEffect, FormEvent } from "react";
import { useParams, useRouter } from "next/navigation";
import { Header } from "@/app/_component/Header";
import { Post } from "@/types/Posts";
import { CategoryOption } from "@/types/CategoryOption";
import { ArticleForm } from "@/app/admin/posts/_components/ArticleForm";
import { CreateBtn } from "@/app/admin/posts/_components/CreateButton";
import { ClearBtn } from "../_components/ClearButton";
import { CreateDialog } from "@/app/admin/posts/_components/CreateDialog";
import { ErrorsType } from "@/types/ErrorType";
import "@/app/globals.css";

const NewArticle: React.FC = () => {
  const router = useRouter();
  const { id } = useParams();
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

  useEffect(() => {
    if (!id) {
      console.error("Error: ID is undefined");
      return;
    }

    console.log("ID from useParams:", id); // デバッグ用ログ
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/admin/posts/${id}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log("Fetched Data:", data);
        const post: Post = data.post;
        if (post) {
          setTitle(post.title);
          setContent(post.content);
          setThumbnailUrl(post.thumbnailUrl);
          setCategories(
            data.categoriesOptions.map((category: CategoryOption) => ({
              id: category.id,
              value: category.id,
              label: category.name,
              name: category.name,
              post_count: category.PostCategory || 0,
            }))
          );
        } else {
          throw new Error("Post not found");
        }
      } catch (error) {
        console.error("Error fetching post:", error);
      }
    };
    fetchData();
  }, [id]);

  const handleSubmit = async (e: FormEvent) => {
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

    const newCategories = validCategories.map((c: CategoryOption) => ({
      id: c.id,
      name: c.name,
    }));

    console.log("Selected Categories:", newCategories);
    const newArticle = {
      title,
      content,
      thumbnailUrl,
      categories: newCategories, // 修正
    };
    console.log("New Article Data:", newArticle);

    try {
      const response = await fetch("/api/admin/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newArticle),
      });

      if (response.ok) {
        console.log("記事が作成されました");

        try {
          const categoryResponse = await fetch("/api/admin/categories", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ categories: newCategories }),
          });

          const result = await categoryResponse.json();
          console.log("カテゴリが作成されました:", result);
          setShowCreateConfirm(true);

          setCategories((prevCategories) =>
            prevCategories.map((category) =>
              newCategories.some((newCat) => newCat.name === category.name)
                ? {
                    ...category,
                    categoryPost_count: (category.PostCategory || 0) + 1,
                  }
                : category
            )
          );
        } catch (error) {
          console.error("カテゴリの作成に失敗しました:", error);
        }
      } else {
        const errorData = await response.json();
        console.error("記事の作成に失敗しました:", errorData);
      }
    } catch (error) {
      console.error("エラーが発生しました:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleCategory = (category: CategoryOption) => {
    console.log("Selected category:", category); // デバッグ
    if (!category.id || !category.name) {
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
