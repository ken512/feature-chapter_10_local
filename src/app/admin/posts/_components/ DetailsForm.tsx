"use client";
import React, { useEffect } from "react";
import { Label } from "@/app/contacts/_component/Label";
import { CategoryOption } from "@/types/CategoryOption";
import { ErrorsType } from "@/types/ErrorType";
import { Category

  } from "@/types/Category";
type DetailsFormProps = {
  title: string;
  setTitle: (title: string) => void;
  content: string;
  setContent: (content: string) => void;
  thumbnailUrl: string;
  setThumbnailUrl: (url: string) => void;
  categories: CategoryOption[];
  setCategories: (categories: CategoryOption[]) => void;
  selectedCategories: CategoryOption[];
  setSelectedCategories: React.Dispatch<React.SetStateAction<CategoryOption[]>>;
  toggleCategory: (category: CategoryOption) => void;
  errors?: ErrorsType;
};
export const DetailsForm: React.FC<DetailsFormProps> = ({
  title,
  setTitle,
  content,
  setContent,
  thumbnailUrl,
  setThumbnailUrl,
  categories,
  setCategories,
  selectedCategories = [],
  setSelectedCategories,
  errors = {},
}) => {
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/admin/categories");
        if (!response.ok) {
          throw new Error("Failed to fetch categories");
        }

        const data = await response.json();
        const validCategories = data.categories.map(
          (category: CategoryOption) => ({
            id: category.id,
            value: category.id,
            label: category.name,
            name: category.name,
            post_count: category.PostCategory || 0,
          })
        );
        setCategories(validCategories);
        setCategories(data.categoriesOptions);
        console.log("Fetched Data:", data);

        const post = data.post;

        // 選択済みカテゴリを設定
        setSelectedCategories(
          post.postCategories.map(({ category }: Category) => ({
            id: category.id,
            value: category.id,
            name: category.name,
            label: category.name,
          }))
        );
        
        console.log("Fetched Data:", post);
        // すべてのカテゴリを選択済みとして設定
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, [setSelectedCategories, setCategories]);

  const toggleCategory = (category: CategoryOption) => {
    setSelectedCategories((prevSelectedCategories) => {
      if (prevSelectedCategories.some((c) => c.value === category.value)) {
        // すでに選択されている場合は除外
        return prevSelectedCategories.filter((c) => c.value !== category.value);
      } else {
        // 選択されていない場合は追加
        return [...prevSelectedCategories, category];
      }
    });
  };

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
          {categories.map((category) => (
            <button
              key={category.id}
              type="button"
              onClick={() => toggleCategory(category)}
              className={`mx-2 px-4 py-2 sm:mx-1 sm:my-2 md:mx-5 md:my-4 hover:bg-blue-500 rounded ${
                isSelected(category) ? "bg-blue-500 text-white" : "bg-gray-200"
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
