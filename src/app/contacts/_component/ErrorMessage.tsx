import React from "react";

type ErrorMessageProps = {
  message?: string;
};

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {
  if (!message) return null;
  return (
    <div className="text-red-500">
      {message}
    </div>
  );
};