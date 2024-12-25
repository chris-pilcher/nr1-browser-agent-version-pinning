import { useContext } from "react";
import { NerdGraphQuery, NerdletStateContext, ngql } from "nr1";
import { useQuery } from "@tanstack/react-query";
import { PINNED_VERSION_QUERY_KEY } from "./queryKeys";

export default function usePinnedVersionQuery() {
  const { entityGuid } = useContext(NerdletStateContext);
  const query = ngql`
    query FetchBrowserMonitoringAgentSettings($browserAppGuid: EntityGuid!) {
      actor {
        entity(guid: $browserAppGuid) {
          ... on BrowserApplicationEntity {
            browserSettings {
              browserMonitoring {
                pinnedVersion
              }
            }
          }
        }
      }
    }
  `;

  return useQuery({
    queryKey: PINNED_VERSION_QUERY_KEY,
    queryFn: () =>
      NerdGraphQuery.query({
        query,
        variables: { browserAppGuid: entityGuid },
      }).then(({ data, errors }) => {
        if (errors) {
          // TODO: Check this actually works and how it looks in the UI when each condition is triggered. Use a debugger to check as well
          throw new Error(errors);
        }
        return data.actor.entity.browserSettings.browserMonitoring.pinnedVersion;
      }),
  });
}
