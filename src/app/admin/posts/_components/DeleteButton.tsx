"use client";
import React from "react";

type Props = {
  ClickDelete: (postId: number) => void;
  postId: number;

};

export const DeleteBtn: React.FC<Props> = ({ ClickDelete, postId}) => {
  
  return (
    <div className="py-5 px-5 flex justify-end">
      <button
        type="button"
        onClick={() => {
          ClickDelete(postId);
        }}
        className="mx-4 px-3 py-2 rounded-lg bg-red-400 font-bold text-lg hover:text-white sm:text-base md:text-2xl border-b-2 border-solid border-gray-700 hover:bg-gray-300 active:translate-y-1 active:border-b-0"
      >
        <i className="bi bi-dash-circle-fill pr-2"></i>
      削除
    </button>
    </div>
  );
};

