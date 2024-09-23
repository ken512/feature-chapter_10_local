"use client";
import React from "react";
import styles from "@/app/styles/Btn.module.css"

type Props = {
  ClickDelete: (postId: number) => void;
  postId: number;
};

export const DeleteBtn: React.FC<Props> = ({ ClickDelete, postId}) => {
  
  return (
    <div className="py-5 px-5 flex justify-end">
      <button
        onClick={(e) => {
          e.stopPropagation(); // クリックイベントの伝播を防ぐ
          e.preventDefault();  // デフォルトのリンク動作を防ぐ
          ClickDelete(postId);
        }}
        className={`mx-4 px-3 py-2 rounded-lg bg-red-400 font-bold text-lg hover:text-white sm:text-base md:text-2xl ${styles.button}`}
      >
        <i className="bi bi-dash-circle-fill pr-2"></i>
      削除
    </button>
    </div>
  );
};

