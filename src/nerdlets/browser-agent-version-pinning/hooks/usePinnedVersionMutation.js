import { useContext } from "react";
import { NerdGraphMutation, NerdletStateContext, ngql } from "nr1";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { PINNED_VERSION_QUERY_KEY } from "./queryKeys";

export default function usePinnedVersionMutation() {
  const { entityGuid } = useContext(NerdletStateContext);
  const queryClient = useQueryClient();
  const mutation = ngql`
    mutation($guid: EntityGuid!, $pinnedVersion: String) {
      agentApplicationSettingsUpdate(
        guid: $guid
        settings: { browserMonitoring: { pinnedVersion: $pinnedVersion } }
      ) {
        browserSettings {
          browserMonitoring {
            pinnedVersion
          }
        }
      }
    }
  `;

  return useMutation({
    mutationFn: (pinnedVersion) => {
      return NerdGraphMutation.mutate({
        mutation,
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
