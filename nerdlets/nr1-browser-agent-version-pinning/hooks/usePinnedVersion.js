import { useContext } from "react";
import { PinnedVersionContext } from "../context";

function usePinnedVersion() {
  const { version, loading, error } = useContext(PinnedVersionContext);
  return { version, loading, error };
}

export default usePinnedVersion;
