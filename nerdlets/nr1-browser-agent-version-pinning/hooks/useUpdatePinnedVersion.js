import { useContext, useState } from "react";
import { NerdGraphMutation, NerdletStateContext, logger } from "nr1";
import { UPDATE_PINNED_VERSION } from "../graphql/mutations";
import { PinnedVersionContext } from "../context";

function useUpdatePinnedVersion() {
  const { entityGuid: guid } = useContext(NerdletStateContext);
  const { setVersion } = useContext(PinnedVersionContext);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const updatePinnedVersion = (pinnedVersion) => {
    setIsLoading(true);
    setError(null);
    return NerdGraphMutation.mutate({
      mutation: UPDATE_PINNED_VERSION,
      variables: { guid, pinnedVersion },
    })
      .then(({ data: response }) => {
        setVersion(response.agentApplicationSettingsUpdate.browserSettings.browserMonitoring.pinnedVersion);
      })
      .catch((e) => {
        setError(e);
        logger.error(`Error updating pinned version to ${pinnedVersion}.`, e);
        throw e;
      })
      .finally(() => {
        setIsLoading(false);
      });
  };
  return { updatePinnedVersion, isLoading, error };
}

export default useUpdatePinnedVersion;
