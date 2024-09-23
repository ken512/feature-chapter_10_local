"use client";
import React from "react";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Header } from "@/app/_component/Header";
import { Post } from "@/types/Posts";
import { CategoryOption } from "@/types/CategoryOption";
import { InlineDialog } from "@/app/admin/posts/_components/InlineDialog";
import { ArticleForm } from "@/app/admin/posts/_components/ArticleForm";
import { UpdateDelete } from "@/app/admin/posts/_components/UpdateDeleteBtn";
import "@/app/globals.css";

const Page: React.FC = () => {
  const router = useRouter();
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (id) {
      const fetchData = async () => {
        try {
          const response = await fetch(`/api/admin/posts/${id}`);
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data = await response.json(); // JSONとしてレスポンスを取得
          console.log("Fetched Data:", data); // デバッグログ追加
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
                categoryPost_count: pc.category.categoryPost_count || 0, // 修正
              }))
            );
          } else {
            throw new Error("Post not found");
          }
        } catch (error) {
          console.error("Error fetching post:", error);
          // 必要に応じてエラーハンドリングを追加
        }
      };
      fetchData();
    }
  }, [id]);

  const handleSubmit = async () => {
    const submitPost = {
      title,
      content,
      thumbnailUrl,
      categories: categories.map((category: CategoryOption) => ({
        id: category.value,
      })), // 修正
    };
    const response = await fetch(`/api/admin/posts/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(submitPost),
    });
    if (response.ok) {
      console.log("記事が更新されました");
    } else {
      console.error("記事の更新に失敗しました");
    }
  };
  const handleDelete = async () => {
    const response = await fetch(`/api/admin/posts/${id}`, {
      method: "DELETE",
    });
    if (response.ok) {
      console.log("記事が削除されました");
      setShowDeleteConfirm(false);
      router.push("/");
    } else {
      console.error("記事の削除に失敗しました");
    }
  };
  const toggleCategory = (category: CategoryOption) => {
    setCategories((prevCategories) =>
      prevCategories.some((c) => c.value === category.value)
        ? prevCategories.filter((c) => c.value !== category.value)
        : [...prevCategories, category]
    );
  };
  
  return (
    <div className="overflow-hidden">
      <Header />
      <div className="my-30">
        <h1 className="text-4xl font-bold">記事編集</h1>
      </div>
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
        />
        <UpdateDelete
          ClickUpdate={handleSubmit}
          ClickDelete={setShowDeleteConfirm}
          isDeleteDisabled={false} // 追加
        />
        <InlineDialog
          visible={showDeleteConfirm}
          onClose={() => setShowDeleteConfirm(false)}
          onConfirm={handleDelete}
        />
      </div>
    </div>
  );
};
export default Page;
