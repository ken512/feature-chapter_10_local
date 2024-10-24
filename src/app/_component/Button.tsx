"use client";
import React from "react";
import Link from "next/link";
export const BTN: React.FC = () => {
  return (
      <button className="rounded-lg p-2  bg-blue-600 hover:bg-red-400 border-b-6 border-solid border-gray-700 relative bottom-0">
        <Link href="/admin/posts/new" className="text-lg  font-bold text-white sm:text-base md:text-2xl">
          <i className="bi bi-plus-circle-fill pr-1.5"></i>新規作成
        </Link>
      </button>
  );
};
