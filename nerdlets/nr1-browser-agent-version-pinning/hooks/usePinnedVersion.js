import { useContext, useEffect } from "react";
import { NerdGraphQuery, NerdletStateContext } from "nr1";
import { FETCH_PINNED_VERSION } from "../graphql/queries";
import { PinnedVersionContext } from "../context";

function usePinnedVersion() {
  const { entityGuid } = useContext(NerdletStateContext);
  const { version, setVersion, loading, setLoading, error, setError } = useContext(PinnedVersionContext);

  useEffect(() => {
    if (version || loading) {
      return;
    }

    setLoading(true);
    setError(null);

    if (!version && !loading) {
      NerdGraphQuery.query({
        query: FETCH_PINNED_VERSION,
        variables: { browserAppGuid: entityGuid },
      })
        .then(({ data, errors }) => {
          if (errors) {
            console.log("Error fetching pinned version ...", errors);
            setError(true);
          }
          if (data) {
            setVersion(data.actor.entity.browserSettings.browserMonitoring.pinnedVersion);
          }
        })
        .catch((e) => {
          console.log("Exception error fetching pinned version ...", e);
          setError(true);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [entityGuid]);

  return { version, loading, error };
}

export default usePinnedVersion;
