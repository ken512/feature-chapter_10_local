"use client";
import React from "react";
import { Label } from "@/app/contacts/_component/Label";
import { ErrorsType } from "@/types/ErrorType";

type Props = {
  name: string;
  setName: (title: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  errors?: ErrorsType;
};

export const DetailsCategoriesForm: React.FC<Props> = ({
  name,
  setName,
  onSubmit,
  errors,
}) => {


  return (
    <div className="w-3/4 mx-auto">
      <form onSubmit={onSubmit}>
        <div className="w-88 py-5 md:text-2xl">
          <Label htmlFor="categories">カテゴリ一名</Label>
          <div className="overflow-wrap-normal my-4">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="カテゴリを入力"
              className="mx-2 px-4 py-2 sm:mx-1 sm:my-2 md:mx-5 md:my-4 rounded bg-gray-200 hover:bg-blue-300 text-black"
            />
          </div>
          {errors?.categories && (
            <p className="text-red-500">{errors.categories}</p>
          )}
        </div>
      </form>
    </div>
  );
};
