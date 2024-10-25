
"use client";
import React from "react";
import styles from "@/app/styles/Btn.module.css";

type Props = {
  ClickUpdate: () => void;
  ClickDelete: (show: boolean) => void;
  isDeleteDisabled: boolean;
};

export const UpdateDelete: React.FC<Props> = ({ ClickUpdate, ClickDelete }) => {
  return (
    <div className="py-5 flex justify-center">
      <button
        onClick={ClickUpdate}
        className={`mx-20 px-8 py-1 rounded bg-blue-500 font-bold text-black hover:text-white ${styles.button}`}
      >
        更新
      </button>
      <button
        onClick={() => ClickDelete(true)}
        className={`mx-20 px-8 py-1 rounded bg-red-400 font-bold hover:text-white ${styles.button}`}
      >
        削除
      </button>
    </div>
  );
};
