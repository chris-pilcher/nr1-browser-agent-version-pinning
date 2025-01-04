import { useQuery } from "@tanstack/react-query";
import { URLS } from "../constants";
import { EOL_QUERY_KEY } from "./queryKeys";

export default function useVersionListQuery() {
  return useQuery({
    queryKey: EOL_QUERY_KEY,
    queryFn: () => fetch(URLS.EOL.DATA).then((res) => res.json()),
  });
}
