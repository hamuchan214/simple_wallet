import { EVENT_TYPE } from "./eventTypes";
import { useEffect } from "react";

type EventType = typeof EVENT_TYPE[keyof typeof EVENT_TYPE];

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