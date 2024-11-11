"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useSupabaseSession } from "../_hooks/useSupabaseSession";
import { supabase } from "@/utils/supabase";

export const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { session, isLoding } = useSupabaseSession();

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  return (
    <header
      className="no-underline bg-neutral-800 flex justify-between items-center py-6 px-10 h-15
          text-lg sm:w-[428px] sm:text-xs sm:m-1 sm:py-2 md:max-w-[1024px] md:text-lg"
    >
      <Link href="/" className="font-bold text-white hover:text-gray-400">
        Next.js Sample Blog
      </Link>

      {!isLoding && (
        <div className="flex space-x-20 sm:flex sm:justify-center sm:space-x-2">
          <Link
            href="/contacts"
            className="font-bold py-2 text-white hover:text-gray-400"
          >
            <i className="bi bi-envelope-paper-fill px-3 text-xl sm:text-xs"></i>
            お問い合わせ
          </Link>

          {session ? (
            // ログイン中のメニュー
            <div className="relative">
              <button
                onClick={toggleDropdown}
                className="font-bold py-2 text-white hover:text-gray-400 flex items-center"
              >
                <i className="bi bi-pencil-square px-1 text-xl sm:text-xs"></i>
                管理
                <i
                  className={`bi bi-chevron-down ml-2 transition-transform duration-200 sm:ml-0 ${
                    isOpen ? "rotate-180" : "rotate-0"
                  }`}
                ></i>
              </button>
              {isOpen && (
                <div className="absolute top-full mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50 sm:right-1 md:w-80">
                  <div
                    className="py-1"
                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby="options-menu"
                  >
                    <Link
                      href="/admin/posts/new"
                      className="block px-4 py-2 text-sm font-bold text-gray-700 hover:bg-gray-300 hover:text-gray-900 md:text-xl"
                    >
                      <i className="bi bi-pencil-square px-1 text-lg sm:text-sm"></i>
                      記事の新規作成
                    </Link>
                    <Link
                      href="/admin/posts"
                      className="block px-4 py-2 text-sm font-bold text-gray-700 hover:bg-gray-300 hover:text-gray-900 md:text-xl"
                    >
                      <i className="bi bi-file-earmark px-1 text-lg sm:text-sm"></i>
                      記事一覧(編集・削除)
                    </Link>
                    <Link
                      href="/admin/categories/new"
                      className="block px-4 py-2 text-sm font-bold text-gray-700 hover:bg-gray-300 hover:text-gray-900 md:text-xl"
                    >
                      <i className="bi bi-tag-fill px-1 text-lg sm:text-sm"></i>
                      カテゴリの新規作成
                    </Link>
                    <Link
                      href="/admin/categories"
                      className="block px-4 py-2 text-sm font-bold text-gray-700 hover:bg-gray-300 hover:text-gray-900 md:text-xl"
                    >
                      <i className="bi bi-tags-fill px-1 text-lg sm:text-sm"></i>
                      カテゴリ一覧(編集・削除)
                    </Link>
                    <Link
                      href="/signup"
                      className="block px-4 py-2 text-sm font-bold text-gray-700 hover:bg-gray-300 hover:text-gray-900 md:text-xl"
                    >
                      <i className="bi bi-file-plus-fill"></i>
                      ユーザー登録
                    </Link>
                    <Link
                      onClick={handleLogout}
                      href=""
                      className="block px-4 py-2 text-sm font-bold text-gray-700 hover:bg-gray-300 hover:text-gray-900 md:text-xl"
                    >
                      <i className="bi bi-door-closed-fill sm:text-sm"></i>
                      ログアウト
                    </Link>
                  </div>
                </div>
              )}
            </div>
          ) : (
            // 未ログインのメニュー
            <>
              <Link
                href="/login"
                className="font-bold py-2 text-white hover:text-gray-400"
              >
                <i className="bi bi-door-open-fill"></i>
                ログイン
              </Link>
            </>
          )}

          <div className="py-1">
            <Link href="https://www.instagram.com/prota.jh/">
              <i className="bi bi-instagram pr-5 text-3xl text-blue-500 hover:text-gray-300 sm:text-base sm:pr-1 md:text-4xl"></i>
            </Link>
            <Link href="https://github.com/ken512">
              <i className="bi bi-github text-3xl pl-5 text-red-500 hover:text-gray-300 sm:text-base sm:pl-1 md:text-4xl"></i>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
