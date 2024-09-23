"use client";
import React from "react";

type UpDateDialogProps = {
  visible: boolean;
  onConfirm: () => void;
};

export const UpDateDialog: React.FC<UpDateDialogProps> = ({
  visible,
  onConfirm,
}) => {
  if (!visible) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold text-blue-600 flex items-center">
          カテゴリが更新されました！
        </h2>
        <div className="mt-6 flex justify-end space-x-4">
          <button
            onClick={(e) => {
              e.stopPropagation(); // クリックイベントの伝播を防ぐ
              e.preventDefault();
              onConfirm(); // 確認ボタンがクリックされたときの処理
            }}
            className="px-4 py-2 bg-blue-600 rounded-md text-black hover:bg-gray-400"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
};