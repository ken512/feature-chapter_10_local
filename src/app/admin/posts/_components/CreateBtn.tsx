"use client";
import React from "react";
import styles from "@/app/styles/Btn.module.css";

type CreateBtnProps = {
  ClickCreate: (e: React.MouseEvent<HTMLButtonElement>) => void;
};

export const CreateBtn: React.FC<CreateBtnProps> = ({ ClickCreate }) => {
  return (
    <div className="py-2 px-5">
      <button
        onClick={ClickCreate}
        className={`mx-4 px-6 py-1 rounded bg-blue-500 font-bold text-1xl hover:text-white ${styles.button}`}
      >
        作成
      </button>
    </div>
  );
};