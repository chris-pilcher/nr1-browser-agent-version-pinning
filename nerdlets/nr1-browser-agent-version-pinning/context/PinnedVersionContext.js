import React, { createContext, useState } from "react";

const PinnedVersionContext = createContext(null);

const PinnedVersionProvider = ({ children }) => {
  const [version, setVersion] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  return (
    <PinnedVersionContext.Provider
      value={{
        version,
        setVersion,
        loading,
        setLoading,
        error,
        setError,
      }}>
      {children}
    </PinnedVersionContext.Provider>
  );
};

export { PinnedVersionContext, PinnedVersionProvider };
