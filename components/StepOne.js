"use client";

import { useState, useCallback } from "react";
import StreamPanel from "./StreamPanel";

export default function StepOne({ onNext }) {
  const [exiting, setExiting] = useState(false);

  const handleSnap = useCallback(() => {
    setExiting(true);
    setTimeout(onNext, 350);
  }, [onNext]);

  return <StreamPanel onSnap={handleSnap} exiting={exiting} />;
}
