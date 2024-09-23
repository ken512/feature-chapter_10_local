"use client";
import React from "react";
import { Label } from "@/app/contacts/_component/Label";
import { CategoryOption } from "@/types/CategoryOption";
import { CategoriesOptions } from "@/types/CategoriesOptions";
import { ErrorsType } from "@/types/ErrorType";

type CategoriesProps = {
  categories: CategoryOption[];
  toggleCategory: (category: CategoryOption) => void;
  selectedCategories: CategoryOption[];
  errors?: ErrorsType;
};

export const CategoriesForm: React.FC<CategoriesProps> = ({
  toggleCategory,
  selectedCategories, // 修正
  errors = {},
}) => {
  return (
    <div className="w-3/4 mx-auto">
      <div className="w-88 py-5 md:text-2xl">
        <Label htmlFor="categories">カテゴリ一覧</Label>
        <div className="overflow-wrap-normal my-4">
        {CategoriesOptions.map((category) => (
          <button
            key={category.value}
            type="button" // ここを追加して、デフォルトの送信動作を防ぐ
            onClick={() => toggleCategory(category)}
            className={`mx-2 px-4 py-2 sm:mx-1 sm:my-2 md:mx-5 md:my-4  hover:bg-blue-500 rounded ${
              selectedCategories.some((c) => c.value === category.value)
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