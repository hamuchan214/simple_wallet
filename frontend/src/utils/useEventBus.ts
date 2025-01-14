import { EVENT_TYPES } from "./eventTypes";
import { useEffect } from "react";

type EventType = typeof EVENT_TYPES[keyof typeof EVENT_TYPES];

export const useEventBus = (eventType: EventType, callback: () => void) => {
    useEffect(() => {
        window.addEventListener(eventType, callback);
        return () => {
            window.removeEventListener(eventType, callback);
        };

    }, [eventType, callback]);
};

export const emitEvent = (eventType: EventType) => {
    window.dispatchEvent(new Event(eventType));
}