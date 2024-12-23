import { useState, useEffect, useCallback } from "react";
import { logger } from "nr1";
import { EOL_DATA_URL } from "../config";

export default function useEolData() {
  const [eolData, setEolData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refetchTrigger, setRefetchTrigger] = useState(false);

  const refetch = useCallback(() => {
    setError(null);
    setLoading(true);
    setRefetchTrigger((prev) => !prev);
  }, []);

  useEffect(() => {
    fetch(EOL_DATA_URL)
      .then((resultJson) => resultJson.json())
      .then((data) => {
        setEolData(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err);
        logger.error("Error fetching EOL data", err);
        setLoading(false);
      });
  }, [refetchTrigger]);

  return { eolData, loading, error, refetch };
}
