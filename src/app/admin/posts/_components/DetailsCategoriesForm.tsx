"use client";
import React, {useEffect} from "react";
import { Label } from "@/app/contacts/_component/Label";
import { CategoryOption } from "@/types/CategoryOption";
import { Category } from "@/types/Category";
import { ErrorsType } from "@/types/ErrorType";
import "@/app/globals.css";

type DetailsCategoriesProps = {
  categories: CategoryOption[];
  selectedCategories: CategoryOption[];
  toggleCategory: (category: CategoryOption) => void;
  setCategories: (categories: CategoryOption[]) => void; 
  setSelectedCategories: React.Dispatch<React.SetStateAction<CategoryOption[]>>;
  errors?: ErrorsType;
};

export const DetailsCategoriesForm: React.FC<DetailsCategoriesProps> = ({
  categories,
  selectedCategories = [],
  setSelectedCategories,
  setCategories,
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

  const isSelected = (categories: CategoryOption) => {
    return selectedCategories.some((selectedCategories) => selectedCategories.value === categories.value);
  };

  return (
    <div className="w-3/4 mx-auto">
      <div className="w-88 py-5 md:text-2xl">
        <Label htmlFor="categories">カテゴリ一覧</Label>
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
