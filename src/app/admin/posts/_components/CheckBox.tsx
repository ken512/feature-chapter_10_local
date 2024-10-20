"use client";
import React, { ChangeEvent, MouseEvent } from "react";

type CheckBoxProps = {
  checked: boolean;
  onChange(event: React.ChangeEvent<HTMLInputElement>): void;
  onClick(event: MouseEvent): void;
};

export const CheckBox: React.FC<CheckBoxProps> = ({
  checked = false,
  onChange = () => {},
  onClick = () => {},
}) => {
  return (
      <input
        type="checkbox"
        checked={checked}
        onChange={event => onChange(event)}
        onClick={event => {
          event.stopPropagation();
          onClick(event);
        }}
        className="scale-150"
      />
  );
};