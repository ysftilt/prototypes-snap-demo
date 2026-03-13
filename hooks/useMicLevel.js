/**
 * useMicLevel — reads microphone input and returns 5 normalized frequency levels.
 * Uses Web Audio API AnalyserNode with 256-point FFT. Frequency bands are
 * configured in design-config.js to cover voice-relevant ranges (~187Hz–11kHz).
 */
import { useState, useEffect, useRef } from "react";
import { micBands } from "@/config/design-config";

const NUM_BARS = micBands.length;
const ZEROS = Array.from({ length: NUM_BARS }, () => 0);

export default function useMicLevel(active) {
  const [levels, setLevels] = useState(ZEROS);
  const streamRef = useRef(null);
  const ctxRef = useRef(null);
  const rafRef = useRef(null);

  useEffect(() => {
    if (!active) {
      setLevels(ZEROS);
      return;
    }

    let cancelled = false;

    async function start() {
      let stream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      } catch {
        return;
      }
      if (cancelled) {
        stream.getTracks().forEach((t) => t.stop());
        return;
      }

      streamRef.current = stream;
      const ctx = new AudioContext();
      ctxRef.current = ctx;

      const source = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);

      const data = new Uint8Array(analyser.frequencyBinCount);

      function tick() {
        if (cancelled) return;
        analyser.getByteFrequencyData(data);
        const next = micBands.map(([lo, hi]) => {
          let sum = 0;
          const count = Math.min(hi, data.length - 1) - lo + 1;
          for (let i = lo; i <= Math.min(hi, data.length - 1); i++) {
            sum += data[i];
          }
          return count > 0 ? sum / count / 255 : 0;
        });
        setLevels(next);
        rafRef.current = requestAnimationFrame(tick);
      }

      rafRef.current = requestAnimationFrame(tick);
    }

    start();

    return () => {
      cancelled = true;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      }
      if (ctxRef.current) {
        ctxRef.current.close();
        ctxRef.current = null;
      }
    };
  }, [active]);

  return levels;
}
