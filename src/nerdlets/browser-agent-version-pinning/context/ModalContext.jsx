import React, { createContext, useState } from "react";

export const ModalContext = createContext(null);

export function ModalProvider({ children }) {
  const [hidden, setHidden] = useState(true);
  const [newVersion, setNewVersion] = useState(null);

  return (
    <ModalContext.Provider value={{ hidden, newVersion, setHidden, setNewVersion }}>{children}</ModalContext.Provider>
  );
}
