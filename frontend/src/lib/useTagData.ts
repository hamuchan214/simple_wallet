import { useState, useCallback } from "react";
import { getTags } from "../api/Tags";
import { useEventBus } from "../utils/useEventBus";
import { EVENT_TYPES } from "../utils/eventTypes";
import type { APITag } from "../model/apimodel";

export const useTagData = () => {
    const [tags, setTags] = useState<APITag[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            const tagsData = await getTags();
            if (tagsData.success && tagsData.tags) {
                setTags(tagsData.tags);
            } else {
                setError(tagsData.error || 'Failed to fetch tags');
            }
        } catch (error) {
            setError('Failed to fetch tags');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEventBus(EVENT_TYPES.REFRESH_TAGS, fetchData);

    return {
        tags,
        isLoading,
        error,
        fetchData
    };
}