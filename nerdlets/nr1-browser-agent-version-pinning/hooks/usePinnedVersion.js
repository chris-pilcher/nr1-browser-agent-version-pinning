import { useContext } from "react";
import { NerdGraphQuery, NerdletStateContext } from "nr1";
import { FETCH_PINNED_VERSION } from "../graphql/queries";
import { useQuery } from "@tanstack/react-query";

export default function usePinnedVersion() {
  const { entityGuid } = useContext(NerdletStateContext);

  return useQuery({
    queryKey: ["pinnedVersion"],
    queryFn: () =>
      NerdGraphQuery.query({
        query: FETCH_PINNED_VERSION,
        variables: { browserAppGuid: entityGuid },
      }).then(({ data, errors }) => {
        if(errors) {
          throw new Error(errors);
        }
        return data.actor.entity.browserSettings.browserMonitoring.pinnedVersion;
      }),
  })
}
