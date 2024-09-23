"use client";
import React from "react";
import { Label } from "@/app/contacts/_component/Label";
import { CategoryOption } from "@/types/CategoryOption";
import { CategoriesOptions } from "@/types/CategoriesOptions";
import { ErrorsType } from "@/types/ErrorType";

type ArticleFormProps = {
  title: string;
  setTitle: (title: string) => void;
  content: string;
  setContent: (content: string) => void;
  thumbnailUrl: string;
  setThumbnailUrl: (url: string) => void;
  categories: CategoryOption[];
  toggleCategory: (category: CategoryOption) => void;
  errors?: ErrorsType;
};

export const ArticleForm: React.FC<ArticleFormProps> = ({
  title,
  setTitle,
  content,
  setContent,
  thumbnailUrl,
  setThumbnailUrl,
  categories,
  toggleCategory,
  errors = {},
}) => {

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
        <Label htmlFor="thumbnailUrl">サムネイルURL</Label>
        <input
          id="thumbnailUrl"
          type="text"
          placeholder="サムネイルURLを入力してください。"
          value={thumbnailUrl}
          onChange={(e) => setThumbnailUrl(e.target.value)}
          className="w-full my-4 hover:bg-gray-300 placeholder-red-400 sm:w-full box-border"
        />
        {errors.thumbnailUrl && (
          <p className="text-red-500">{errors.thumbnailUrl}</p>
        )}
      </div>
      
      <div className="w-full py-5 sm:w-full md:text-2xl">
        <Label htmlFor="categories">カテゴリ</Label>
        <div className="overflow-wrap-normal my-4">
          {CategoriesOptions.map((category) => (
            <button
              key={category.value}
              type="button" // ここを追加して、デフォルトの送信動作を防ぐ
              onClick={() => toggleCategory(category)}
              className={`mx-2 px-4 py-2 sm:mx-2 sm:my-2 md:mx-5 md:my-4  hover:bg-blue-500 rounded ${
                categories.some((c) => c.value === category.value)
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200"
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
        {errors.categories && (
          <p className="text-red-500">{errors.categories}</p>
        )}
      </div>
    </div>
  );
};
