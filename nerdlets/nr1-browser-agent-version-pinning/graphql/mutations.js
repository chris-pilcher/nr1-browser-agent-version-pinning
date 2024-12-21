import { ngql } from "nr1";

export const UPDATE_PINNED_VERSION = ngql`
  mutation($guid: EntityGuid!, $pinnedVersion: String) {
    agentApplicationSettingsUpdate(
      guid: $guid
      settings: { browserMonitoring: { pinnedVersion: $pinnedVersion } }
    ) {
      browserProperties {
        jsLoaderScript
      }
      browserSettings {
        browserMonitoring {
          loader
          pinnedVersion
        }
      }
    }
  }
`;
