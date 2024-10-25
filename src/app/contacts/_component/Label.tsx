import React from "react";

type Props = {
  htmlFor: string,

  children: React.ReactNode;
}

export const Label:React.FC<Props> = ({htmlFor, children}) => {
  return(

    <label htmlFor={htmlFor}>
      {children}
    </label>
  )
}