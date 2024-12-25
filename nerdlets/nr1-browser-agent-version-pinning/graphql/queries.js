import { ngql } from "nr1";

// TODO: COnsider moving this to the custom hook? I mean ... where else would it be used?
export const FETCH_PINNED_VERSION = ngql`
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
