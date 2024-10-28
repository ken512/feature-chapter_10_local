"use client";
import React from "react";

type Props = {
  ClickUpdate: (e: React.FormEvent) => void;
  ClickDelete: (show: boolean) => void;
  isDeleteDisabled: boolean;
};

export const UpdateDelete: React.FC<Props> = ({ ClickUpdate, ClickDelete }) => {
  return (
    <div className="py-5 flex justify-center">
      <button
        onClick={ClickUpdate}
        className="mx-20 px-8 py-1 rounded bg-blue-500 font-bold text-black hover:text-white md:text-2xl border-b-2 border-solid border-gray-700 hover:bg-gray-300 active:translate-y-1 active:border-b-0"
      >
        更新
      </button>
      <button
        onClick={() => ClickDelete(true)}
        className="mx-20 px-8 py-1 rounded bg-red-400 font-bold hover:text-white md:text-2xl border-b-2 border-solid border-gray-700 hover:bg-gray-300 active:translate-y-1 active:border-b-0"
      >
        削除
      </button>
    </div>
  );
};
