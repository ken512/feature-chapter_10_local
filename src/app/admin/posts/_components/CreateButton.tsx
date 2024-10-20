"use client";
import React from "react";

type CreateBtnProps = {
  clickCreate: (e: React.MouseEvent<HTMLButtonElement>) => void;
};

export const CreateBtn: React.FC<CreateBtnProps> = ({ clickCreate }) => {
  return (
    <div className="py-2 px-5">
      <button
        onClick={clickCreate}
        className="mx-4 px-6 py-1 rounded bg-blue-500 font-bold text-1xl hover:text-white md:text-2xl border-b-2 border-solid border-gray-700 hover:bg-gray-300 active:translate-y-1 active:border-b-0"
      >
        作成
      </button>
    </div>
  );
};