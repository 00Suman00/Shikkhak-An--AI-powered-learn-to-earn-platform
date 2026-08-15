"use client";

import { useEffect } from "react";
import { useEventStore } from "@/state/useEventStore";
import { eventStreamer } from "@/services/stellar/eventStreamer";

export function useEventStream() {
  const { addEvent, isStreamingActive, toggleStreaming, events, selectedFilter, setFilter, getFilteredEvents } =
    useEventStore();

  useEffect(() => {
    if (isStreamingActive) {
      eventStreamer.start((incoming) => {
        addEvent(incoming);
      }, 10000);
    } else {
      eventStreamer.stop();
    }

    return () => {
      eventStreamer.stop();
    };
  }, [isStreamingActive, addEvent]);

  return {
    events,
    filteredEvents: getFilteredEvents(),
    isStreamingActive,
    toggleStreaming,
    selectedFilter,
    setFilter,
  };
}
