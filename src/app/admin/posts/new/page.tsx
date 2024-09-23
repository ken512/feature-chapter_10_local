"use client";
import React, { useState, useEffect, FormEvent } from "react";
import { useRouter, useParams } from "next/navigation";
import { Header } from "@/app/_component/Header";
import { Post } from "@/types/Posts";
import { CategoryOption } from "@/types/CategoryOption";
import { ArticleForm } from "@/app/admin/posts/_components/ArticleForm";
import { CreateBtn } from "@/app/admin/posts/_components/CreateBtn";
import { ClearBtn } from "../_components/ClearBtn";
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

  useEffect(() => {
    if (!id) {
      console.error("Error: ID is undefined");
      return;
    }
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
            post.postCategories.map((pc) => ({
              id: pc.category.id,
              value: pc.category.id,
              label: pc.category.name,
              name: pc.category.name,
              categoryPost_count: pc.category.categoryPost_count || 0,
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

  const validate = () => {
    const tempErrors: ErrorsType = {};
    if (!title) tempErrors.title = "タイトルは必須です。";
    if (!content) tempErrors.content = "コンテンツは必須です。";
    if (!thumbnailUrl) tempErrors.thumbnailUrl = "サムネイルURLは必須です。";
    if (categories.length === 0) tempErrors.categories = "カテゴリは必須です。";
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return; // デフォルトの送信動作を防ぐ
    if (isSubmitting) return; // 二重送信防止
    setIsSubmitting(true);
    const newArticle = {
      title,
      content,
      thumbnailUrl,
      categories: categories.map((c: CategoryOption) => ({
        id: Number(c.value),
        name: c.name,
      })), // nameも送る
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
        // カテゴリのカウントを増加させる
        const incrementResponse = await fetch("/api/admin/categories", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
body: JSON.stringify({ categories: categories.map((category) => ({ id: category.id, name: category.name })) }),
        });
        if (!incrementResponse.ok) {
          const errorData = await incrementResponse.json();
          console.error("カテゴリのカウント増加に失敗しました:", errorData);
          throw new Error("カテゴリのカウント増加に失敗しました");
        }
        setShowCreateConfirm(true);
      } else {
        const errorData = await response.json();
        console.error("記事の作成に失敗しました:", errorData); // エラーデータの詳細を出力
      }
    } catch (error) {
      console.error("エラーが発生しました:", error); // エラーメッセージの詳細
    } finally {
      setIsSubmitting(false);
    }
  };
  const toggleCategory = (category: CategoryOption) => {
    setCategories((prevCategories) =>
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
    setCategories([]);
  };
  return (
    <div className="sm:w-[430px] md:w-[1024px]">
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
            toggleCategory={toggleCategory}
            errors={errors}
          />
        </div>
        <div className="flex justify-center">
          <CreateBtn ClickCreate={handleSubmit} />
          <ClearBtn
            title={title}
            content={content}
            thumbnailUrl={thumbnailUrl}
            categories={categories}
            ClickClear={handleClear}
          />
        </div>
        <CreateDialog
          visible={showCreateConfirm}
          onConfirm={handleCreateConfirm} // ダイアログのOKボタンをクリックしたときの処理
        />
      </form>
    </div>
  );
};
export default NewArticle;