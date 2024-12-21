import { useContext } from "react";
import { PinnedVersionContext } from "../context";

export default function usePinnedVersion() {
  const { version, loading, error } = useContext(PinnedVersionContext);
  return { version, loading, error };
}
