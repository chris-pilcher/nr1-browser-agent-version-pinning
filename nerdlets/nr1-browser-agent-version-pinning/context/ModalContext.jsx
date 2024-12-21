import React, { createContext, useState } from "react";

export const ModalContext = createContext(null);

export function ModalProvider({ children }) {
  const [hidden, setHidden] = useState(true);
  const [newVersion, setNewVersion] = useState(null);

  const openModal = (version) => {
    setNewVersion(version);
    setHidden(false);
  };

  const closeModal = () => {
    setHidden(true);
    setNewVersion(null);
  };

  return (
    <ModalContext.Provider value={{ hidden, newVersion, openModal, closeModal }}>{children}</ModalContext.Provider>
  );
}
