"use client";
import React from "react";
import { CategoryOption } from "@/types/CategoryOption";



type Props = {
  clickClear: () => void;
  categories: CategoryOption[];
};

export const CategoriesClearBtn: React.FC<Props> = ({
  clickClear,
  
}) => {
  return (
    <div className="py-2 px-5">
      <button
        onClick={() => {
          
          clickClear();
        }}
        className="mx-4 px-4 py-1 rounded bg-gray-200 font-bold text-1xl hover:white-black md:text-2xl border-b-2 border-solid border-gray-700 hover:bg-gray-300 active:translate-y-1 active:border-b-0"
      >
        クリア
      </button>
    </div>
  );
};
