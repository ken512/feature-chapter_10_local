import React from "react";

type InputProps = {
  type: string;
  id: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  className?: string;
  onClick?: () => void; 
};

export const Input: React.FC<InputProps> = ({ type, id, value, onChange, disabled, className, onClick }) => (
  <input
    type={type}
    id={id}
    value={value}
    onChange={(e) => onChange(e.target.value)}
    disabled={disabled}
    className={className}
    onClick={onClick} // onClickプロパティを追加
  />
);