"use client";
import React from "react";
import { Label } from "@/app/contacts/_component/Label";
import { CategoryOption } from "@/types/CategoryOption";
import { ErrorsType } from "@/types/ErrorType";
import "@/app/globals.css";

type CategoriesProps = {
  categories: CategoryOption[];
  selectedCategories: CategoryOption[];
  toggleCategory: (category: CategoryOption) => void;
  errors?: ErrorsType;
};

export const CategoriesForm: React.FC<CategoriesProps> = ({
  categories,
  toggleCategory,
  selectedCategories = [],
  errors = {},
}) => {

  
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
