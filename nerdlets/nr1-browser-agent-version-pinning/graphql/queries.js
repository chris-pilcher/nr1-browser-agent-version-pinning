import { ngql } from 'nr1';

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
