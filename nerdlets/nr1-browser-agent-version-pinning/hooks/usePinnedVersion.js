import { useEffect, useState } from 'react';
import { NerdGraphQuery } from 'nr1';
import { FETCH_PINNED_VERSION } from '../graphql/queries';

export function usePinnedVersion(browserAppEntityGuid) {
    const [pinnedVersion, setPinnedVersion] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!browserAppEntityGuid) {
            setPinnedVersion(null);
            setLoading(false);
            return;
        }
        setLoading(true);
        setError(null);

        fetchPinnedVersionData(browserAppEntityGuid)
            .then(setPinnedVersion)
            .catch(setError)
            .finally(() => setLoading(false));
    }, [browserAppEntityGuid]);

    return { pinnedVersion, setPinnedVersion, pinnedVersionLoading: loading, pinnedVersionError: error };
}

async function fetchPinnedVersionData(browserAppGuid) {
    const { data } = await NerdGraphQuery.query({
        query: FETCH_PINNED_VERSION,
        variables: { browserAppGuid },
    });

    return data.actor.entity.browserSettings.browserMonitoring.pinnedVersion;
}
