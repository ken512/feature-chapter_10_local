"use client";
import React from 'react';

type InlineDialogProps = {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  
};

export const InlineDialog: React.FC<InlineDialogProps> = ({
  visible,
  onClose,
  onConfirm,
}) => {
  if (!visible) return null;

  return (
    <div>
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold text-red-600 flex items-center">
          ⚠️本当に記事を削除してよいですか？
        </h2>
        <p className="mt-4 text-gray-600">
          選択された記事を削除します。削除後は、元に戻すことはできません。
        </p>
        <div className="mt-6 flex justify-end space-x-4">
          <button
            onClick={(e) => {
              e.stopPropagation(); // クリックイベントの伝播を防ぐ
              e.preventDefault(); 
              onClose();
            }}
            className="px-4 py-2 bg-gray-300 rounded-md text-gray-700 hover:bg-gray-400"
          >
            キャンセル
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            削除
          </button>
        </div>
      </div>
    </div>
    </div>
  );
};


