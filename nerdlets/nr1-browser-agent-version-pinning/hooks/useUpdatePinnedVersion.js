import { useContext } from "react";
import { NerdGraphMutation, NerdletStateContext } from "nr1";
import { UPDATE_PINNED_VERSION } from "../graphql/mutations";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function useUpdatePinnedVersion() {
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
      queryClient.setQueryData(["pinnedVersion"], response.data.agentApplicationSettingsUpdate.browserSettings.browserMonitoring.pinnedVersion);
    },
  });
}
