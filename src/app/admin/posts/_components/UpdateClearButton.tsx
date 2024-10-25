"use client";
import React from "react";

type Props = {
  ClickUpdate: (e: React.FormEvent) => Promise<void>;
  ClickClear: () => void;
};

export const UpdateClear: React.FC<Props> = ({ ClickUpdate, ClickClear }) => {
  return (
    <div className="py-5 flex justify-center">
      <button
        onClick={ClickUpdate}
        className="mx-20 px-8 py-1 rounded bg-blue-500 font-bold text-black hover:text-white md:text-2xl border-b-2 border-solid border-gray-700 hover:bg-gray-300 active:translate-y-1 active:border-b-0"
      >
        更新
      </button>
      <button
        onClick={() => ClickClear()}
        className="mx-4 px-4 py-1 rounded bg-gray-200 font-bold text-1xl hover:white-black md:text-2xl border-b-2 border-solid border-gray-700 hover:bg-gray-300 active:translate-y-1 active:border-b-0"
      >
        クリア
      </button>
    </div>
  );
};
