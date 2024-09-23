"use client";
import React from "react";
import styles from "@/app/styles/Btn.module.css";
import { CategoryOption } from "@/types/CategoryOption";


type Props = {
  ClickClear: () => void;
  categories: CategoryOption[];
};

export const CategoriesClearBtn: React.FC<Props> = ({
  ClickClear,
  
}) => {
  return (
    <div className="py-2 px-5">
      <button
        onClick={() => {
          
          ClickClear();
        }}
        className={`mx-4 px-4 py-1 rounded bg-gray-200 font-bold text-1xl hover:white-black md:text-2xl ${styles.button}`}
      >
        クリア
      </button>
    </div>
  );
};
