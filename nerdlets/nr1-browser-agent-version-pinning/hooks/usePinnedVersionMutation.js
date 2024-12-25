import { useContext } from "react";
import { NerdGraphMutation, NerdletStateContext } from "nr1";
import { UPDATE_PINNED_VERSION } from "../graphql/mutations";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { PINNED_VERSION_QUERY_KEY } from "./queryKeys";

export default function usePinnedVersionMutation() {
  const { entityGuid } = useContext(NerdletStateContext);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (pinnedVersion) => {
      return NerdGraphMutation.mutate({
        mutation: UPDATE_PINNED_VERSION,
        variables: { guid: entityGuid, pinnedVersion },
      });
    },
    onSuccess: (response) => {
      queryClient.setQueryData(
        PINNED_VERSION_QUERY_KEY,
        response.data.agentApplicationSettingsUpdate.browserSettings.browserMonitoring.pinnedVersion,
      );
    },
  });
}
