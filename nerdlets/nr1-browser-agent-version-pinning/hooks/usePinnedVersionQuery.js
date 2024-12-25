import { useContext } from "react";
import { NerdGraphQuery, NerdletStateContext } from "nr1";
import { FETCH_PINNED_VERSION } from "../graphql/queries";
import { useQuery } from "@tanstack/react-query";
import { PINNED_VERSION_QUERY_KEY } from "./queryKeys";

export default function usePinnedVersionQuery() {
  const { entityGuid } = useContext(NerdletStateContext);

  return useQuery({
    queryKey: PINNED_VERSION_QUERY_KEY,
    queryFn: () =>
      NerdGraphQuery.query({
        query: FETCH_PINNED_VERSION,
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
