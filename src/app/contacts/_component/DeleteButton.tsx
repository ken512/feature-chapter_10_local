"use client"
import React from "react"

type DeleteButtonProps = {
  selectedPostId: number| null;
  handleDelete: () => Promise<void>;
}

export const DeleteButton:React.FC<DeleteButtonProps> = (selectedPostId , handleDelete) => {
  if(!selectedPostId) return null;

  return (
    <div>
      {selectedPostId && (
        <div className="flex justify-end">
          <button
            className="border p-2 bg-red-500 text-white md:text-2xl"
            onClick={handleDelete}
          >
            削除
          </button>
        </div>
      )}
    </div>
  )
}