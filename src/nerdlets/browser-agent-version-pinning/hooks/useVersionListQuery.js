import { useQuery } from "@tanstack/react-query";
import { EOL_DATA_URL } from "../config";
import { EOL_QUERY_KEY } from "./queryKeys";

export default function useVersionListQuery() {
  return useQuery({
    queryKey: EOL_QUERY_KEY,
    queryFn: () => fetch(EOL_DATA_URL).then((res) => res.json()),
  });
}
