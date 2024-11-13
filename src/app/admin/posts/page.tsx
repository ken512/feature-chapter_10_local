"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Post } from "@/types/Posts";
import { useRouter } from "next/navigation";
import { Header } from "@/app/_component/Header";
import { BTN } from "@/app/_component/Button";
import { DeleteBtn } from "@/app/admin/posts/_components/DeleteButton";
import { CheckBox } from "@/app/admin/posts/_components/CheckBox";
import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession";
import { InlineDialog } from "@/app/admin/posts/_components/InlineDialog";
import "@/app/globals.css";

const ArticleListAdmin: React.FC = () => {
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [checkedValues, setCheckedValues] = useState<Set<number>>(new Set());
  const [selectAll, setSelectAll] = useState(false); // 全選択の状態を管理
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const { token } = useSupabaseSession();

  useEffect(() => {

    if (!token) return; // tokenがない場合、APIリクエストをスキップ

    const fetchData = async () => {
      try {
        const response = await fetch("/api/admin/posts", {
          headers: {
            "Content-Type": "application/json",
            Authorization: token, // ヘッダーにtokenを付与
          },
        })

        if(!response.ok) throw new Error("Failed to fetch posts");

        const { posts } = await response.json();
        setPosts(posts);
      } catch(error){
          console.error("Error fetching posts:", error);
      }
    };
    fetchData();
  }, [token]);

  const handleDelete = async (postId: number) => {

    const response = await fetch(`/api/admin/posts/${postId}`, {
      method: "DELETE",
      headers: {Authorization: token || "", }, // DELETEリクエストにもtokenを追加
    });

    if (response.ok) {
      console.log("記事が削除されました");
      setShowDeleteConfirm(false);
      router.push("/");
      setPosts(posts.filter((post) => post.id !== postId));
      setCheckedValues((prev) => {
        const newCheckedValues = new Set(prev);
        newCheckedValues.delete(postId);
        return newCheckedValues;
      });
    } else {
      console.error("記事の削除に失敗しました");
    }
  };

  const handleCheckBoxChange = (postId: number, checked: boolean) => {
    setCheckedValues((prev) => {
      const newCheckedValues = new Set(prev);
      if (checked) {
        newCheckedValues.add(postId);
      } else {
        newCheckedValues.delete(postId);
      }
      return newCheckedValues;
    });
  };

  const handleSelectAllChange = () => {
    if (selectAll) {
      setCheckedValues(new Set()); // 全解除
    } else {
      const allIds = posts.map((post) => post.id);
      setCheckedValues(new Set(allIds)); // 全選択
    }
    setSelectAll(!selectAll); // 状態を切り替え
  };

  const handleBulkDelete = () => {
    setShowDeleteConfirm(true);
  };

  const confirmBulkDelete = async () => {
    const postIds = Array.from(checkedValues);
    for (const postId of postIds) {
      await handleDelete(postId);
    }
    setCheckedValues(new Set());
    alert("記事が削除されました！"); // アラートを表示
  };

   // 全てのカテゴリが選択されているかチェックする
    useEffect(() => {
    if (posts.length === checkedValues.size) {
      setSelectAll(true);
    } else {
      setSelectAll(false);
    }
  }, [checkedValues, posts]);

  return (
    <div className="sm:w-[430px] md:w-[1024px] md:text-3xl">
      <Header />
      <div className="flex items-center justify-between py-6 px-7 h-15">
        <h1 className="py-3 text-4xl font-bold sm:text-2xl md:text-4xl">記事一覧</h1>
        <InlineDialog
          isOpen={showDeleteConfirm}
          onClose={() => setShowDeleteConfirm(false)}
          onConfirm={confirmBulkDelete}
        />
      </div>
       {/* 全選択・全解除ボタン */}
        <div className="mb-4 mx-4">
          <CheckBox
            checked={selectAll}
            onChange={handleSelectAllChange}
            onClick={(event) => {
              event.stopPropagation();
            }}
          />
          <span>全選択 / 全解除</span>
        </div>
      <div>
        {posts.map((post) => (
          <div key={post.id} className="cursor-pointer">
            <Link href={`/admin/posts/${post.id}`}>
            <div className="border-b border-gray-300 p-4 hover:bg-gray-100 cursor-pointer">
              <CheckBox
                checked={checkedValues.has(post.id)}
                onChange={(e) => {
                  handleCheckBoxChange(post.id, e.target.checked);
                }}
                onClick={(event) => {
                  event.stopPropagation();
                }}
              />
              <div>{post.title}</div>
              <div className="text-gray-500">
                {new Date(post.createdAt).toLocaleDateString()}
              </div>
            </div>
            </Link>
          </div>
        ))}
        <div className="flex items-center justify-center my-10">
          <BTN />
          <DeleteBtn
          ClickDelete={handleBulkDelete}
          postId={0}
          />
        </div>
      </div>
    </div>
  );
};

export default ArticleListAdmin;