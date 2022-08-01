import React, { createContext, Dispatch, SetStateAction } from "react";

type VisibleContextProps = {
  visible: boolean;
  setVisible: Dispatch<SetStateAction<boolean>>;
}

export const VisibleContext = createContext<VisibleContextProps | null>(null)