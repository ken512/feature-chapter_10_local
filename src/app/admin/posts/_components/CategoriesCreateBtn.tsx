"use client";
import React from "react";
import Link from "next/link";
import styles from "@/app/styles/Btn.module.css"

export const CategoriesCreateBtn: React.FC = () => {
  return (
    <div>
      <button className={`rounded-lg p-2 bg-blue-600 hover:bg-red-400 ${styles.button}`}>
        <Link href="/admin/categories/new" className="text-lg  font-bold text-white sm:text-base md:text-2xl">
          <i className="bi bi-plus-circle-fill pr-1.5"></i>新規作成
        </Link>
      </button>
    </div>
  );
};
