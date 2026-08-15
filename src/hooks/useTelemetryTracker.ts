"use client";

import { useEffect, useRef } from "react";
import { useQuizStore } from "@/state/useQuizStore";

export function useTelemetryTracker(isQuizActive: boolean) {
  const { recordTelemetry } = useQuizStore();
  const clickCountRef = useRef(0);
  const lastClickTimeRef = useRef(Date.now());

  useEffect(() => {
    if (!isQuizActive) return;

    // 1. Window Blur (switching away from tab)
    const handleBlur = () => {
      recordTelemetry({
        eventType: "tab_blur",
        details: "Learner switched tabs or minimized window",
      });
    };

    // 2. Clipboard Copy or Paste
    const handleCopyPaste = (e: ClipboardEvent) => {
      recordTelemetry({
        eventType: "copy_paste",
        details: `Clipboard ${e.type} event detected`,
      });
    };

    // 3. Rapid Clicking / Guessing Heuristic
    const handleClick = () => {
      const now = Date.now();
      if (now - lastClickTimeRef.current < 250) {
        clickCountRef.current += 1;
        if (clickCountRef.current >= 3) {
          recordTelemetry({
            eventType: "rapid_click",
            details: "Abnormal rapid-fire clicking detected",
          });
          clickCountRef.current = 0;
        }
      } else {
        clickCountRef.current = 0;
      }
      lastClickTimeRef.current = now;
    };

    window.addEventListener("blur", handleBlur);
    window.addEventListener("copy", handleCopyPaste);
    window.addEventListener("paste", handleCopyPaste);
    window.addEventListener("click", handleClick);

    return () => {
      window.removeEventListener("blur", handleBlur);
      window.removeEventListener("copy", handleCopyPaste);
      window.removeEventListener("paste", handleCopyPaste);
      window.removeEventListener("click", handleClick);
    };
  }, [isQuizActive, recordTelemetry]);
}
