import PropTypes from "prop-types";
import React, { createContext, useMemo, useState } from "react";

export const ModalContext = createContext(null);

export function ModalProvider({ children }) {
  const [hidden, setHidden] = useState(true);
  const [newVersion, setNewVersion] = useState(null);

  const value = useMemo(() => ({ hidden, newVersion, setHidden, setNewVersion }), [hidden, newVersion]);

  return <ModalContext.Provider value={value}>{children}</ModalContext.Provider>;
}

ModalProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
