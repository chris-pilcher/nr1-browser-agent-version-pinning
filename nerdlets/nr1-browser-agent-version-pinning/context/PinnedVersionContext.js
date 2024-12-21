import React, { createContext, useContext, useEffect, useState } from "react";
import { NerdGraphQuery, NerdletStateContext, logger } from "nr1";
import { FETCH_PINNED_VERSION } from "../graphql/queries";

const PinnedVersionContext = createContext(null);

const PinnedVersionProvider = ({ children }) => {
  const [version, setVersion] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { entityGuid } = useContext(NerdletStateContext);

  useEffect(() => {
    setLoading(true);
    setError(null);

    NerdGraphQuery.query({
      query: FETCH_PINNED_VERSION,
      variables: { browserAppGuid: entityGuid },
    })
      .then(({ data, errors }) => {
        if (errors) {
          // Note: This will catch errors such as an invalid query
          logger.error("Error fetching pinned version ...", errors);
          setError(true);
        } else {
          setVersion(data.actor.entity.browserSettings.browserMonitoring.pinnedVersion);
        }
      })
      .catch((e) => {
        // Note: This will catch errors such as network failures
        logger.error("Exception error fetching pinned version ...", e);
        setError(true);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [entityGuid]);

  return (
    <PinnedVersionContext.Provider
      value={{
        version,
        setVersion,
        loading,
        error,
      }}>
      {children}
    </PinnedVersionContext.Provider>
  );
};

export { PinnedVersionContext, PinnedVersionProvider };
