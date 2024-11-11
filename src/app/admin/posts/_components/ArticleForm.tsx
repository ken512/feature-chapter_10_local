"use client";
import React, { ChangeEvent, useEffect, useState } from "react";
import { Label } from "@/app/contacts/_component/Label";
import { CategoryOption } from "@/types/CategoryOption";
import { ErrorsType } from "@/types/ErrorType";
import { supabase } from "@/utils/supabase";
import { v4 as uuidv4 } from "uuid";
import Image from "next/image";

type ArticleFormProps = {
  title: string;
  setTitle: (title: string) => void;
  content: string;
  setContent: (content: string) => void;
  thumbnailImageKey: string;
  setThumbnailImageKey: (thumbnailImageKey: string) => void;
  categories: CategoryOption[];
  setCategories: (categories: CategoryOption[]) => void;
  selectedCategories: CategoryOption[];
  toggleCategory: (category: CategoryOption) => void;
  errors?: ErrorsType;
};

export const ArticleForm: React.FC<ArticleFormProps> = ({
  title,
  setTitle,
  content,
  setContent,
  thumbnailImageKey,
  setThumbnailImageKey,
  categories,
  setCategories,
  selectedCategories = [],
  toggleCategory,
  errors = {},
}) => {
  const [thumbnailImageUrl, setThumbnailImageUrl] = useState<null | string>(
    null
  );

  // カテゴリを取得して設定
  useEffect(() => {

    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/admin/categories", {
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch categories");
        }
        const data = await response.json();
        setCategories(data.categories); // カテゴリを設定
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, [setCategories]);

  const handleImageChange = async (event: ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) {
      // 画像が選択されていない場合は何もせず終了
      return;
    }

    const file = event.target.files[0];

  
    const filePath = `private/${uuidv4()}`; // ファイルパスを指定

    // Supabaseのストレージに画像をアップロード
    const { data, error } = await supabase.storage
      .from('post_thumbnail') // バケット名
      .upload(filePath, file, { cacheControl: "3600", upsert: false });

    if (error) {
      console.error("Image upload error:", error.message);
      return;
    }

    // アップロードが成功したら、thumbnailImageKeyを更新
    if (data) {
      setThumbnailImageKey(data.path);
      console.log("Uploaded image path:", data.path);
    }
  };

  // DBに保存しているthumbnailImageKeyを元に、Supabaseから画像のURLを取得する
  useEffect(() => {
    if (!thumbnailImageKey) return;

    const fetcher = async () => {
      const {
        data: { publicUrl },
      } = await supabase.storage
        .from('post_thumbnail')
        .getPublicUrl(thumbnailImageKey);

      setThumbnailImageUrl(publicUrl);
    };

    fetcher();
  }, [thumbnailImageKey]);

  // ArticleFormコンポーネント内
  const isSelected = (category: CategoryOption) => {
    return selectedCategories.some(
      (selectedCategory) => selectedCategory.id === category.id
    );
  };

  return (
    <div className="w-3/4 mx-auto sm:w-[400px]">
      <div className="w-full py-5 sm:w-full sm:justify-self-center md:text-2xl md:w-full">
        <Label htmlFor="title">タイトル</Label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full my-4 hover:bg-gray-300 row-span-5 sm:w-full box-border sm:mx-0 sm:px-0"
        />
        {errors.title && <p className="text-red-500">{errors.title}</p>}
      </div>

      <div className="w-full py-5 sm:w-full md:text-2xl">
        <Label htmlFor="content">コンテンツ</Label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full my-4 hover:bg-gray-300 sm:w-full box-border"
        />
        {errors.content && <p className="text-red-500">{errors.content}</p>}
      </div>

      <div className="w-full py-5 sm:w-full md:text-2xl">
        <Label htmlFor="thumbnailImageKey">サムネイルURL</Label>
        <input
          type="file"
          placeholder="サムネイルURLを入力してください。"
          onChange={handleImageChange} // handleImageChange関数を直接呼び出す
          accept="image/*"
          className="w-full my-4 hover:bg-gray-300 placeholder-red-400 sm:w-full box-border"
        />
        {thumbnailImageUrl && (
          <div className="mt-2">
            <Image
              src={thumbnailImageUrl}
              alt="thumbnail"
              width={400}
              height={400}
            />
          </div>
        )}
        {errors.thumbnailImageKey && (
          <p className="text-red-500">{errors.thumbnailImageKey}</p>
        )}
      </div>

      <div className="w-full py-5 sm:w-full md:text-2xl">
        <Label htmlFor="categories">カテゴリ</Label>
        <div className="overflow-wrap-normal my-4">
          {categories && categories.length > 0 ? (
            categories.map((category) => (
              <button
                key={category.id}
                type="button"
                onClick={() => toggleCategory(category)}
                className={`mx-2 px-4 py-2 sm:mx-1 sm:my-2 md:mx-5 md:my-4 hover:bg-blue-500 rounded ${
                  isSelected(category)
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200"
                }`}
              >
                {category.name}
              </button>
            ))
          ) : (
            <p className="text-gray-500">カテゴリがありません。</p>
          )}
        </div>
        {errors.categories && (
          <p className="text-red-500">{errors.categories}</p>
        )}
      </div>
    </div>
  );
};
