import { ngql } from "nr1";

// TODO: Consider moving this to the custom hook? I mean ... where else would it be used?
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
