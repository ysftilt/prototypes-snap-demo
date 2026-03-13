"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { base } from "@/config/animation-config";
import { useSpeed } from "./debug/SpeedContext";
import { viewfinder } from "@/config/design-config";

/**
 * Walk the offsetParent chain to get the element's final layout rect
 * in viewport coordinates. Unlike getBoundingClientRect(), this is NOT
 * affected by CSS transforms (e.g. a parent's slide-up-in animation),
 * so it returns the true resting position.
 */
function getLayoutRect(el) {
  let top = 0;
  let left = 0;
  let current = el;
  while (current) {
    top += current.offsetTop;
    left += current.offsetLeft;
    current = current.offsetParent;
  }
  return { top, left, width: el.offsetWidth, height: el.offsetHeight };
}

/**
 * Floating image that FLIP-animates from the viewfinder rect to the
 * ProductRow thumbnail rect using GPU-composited transform.
 */
export default function MorphImage({ src, getStartRect, endRef, onComplete }) {
  const { scaleDuration } = useSpeed();
  const startRef = useRef(null);
  const hasTransitioned = useRef(false);
  const [mounted, setMounted] = useState(false);
  const [transform, setTransform] = useState(null);

  // On mount: capture start rect
  useEffect(() => {
    const start = getStartRect();
    if (!start) return;
    startRef.current = start;
    setMounted(true);
  }, [getStartRect]);

  // Poll for endRef, then compute FLIP transform using layout rect
  useEffect(() => {
    if (!mounted || hasTransitioned.current) return;
    const start = startRef.current;
    if (!start) return;

    let rafId;
    function check() {
      const end = endRef?.current;
      if (!end) {
        rafId = requestAnimationFrame(check);
        return;
      }

      // One rAF to let the element lay out
      rafId = requestAnimationFrame(() => {
        const endRect = getLayoutRect(end);
        hasTransitioned.current = true;

        const scaleX = endRect.width / start.width;
        const scaleY = endRect.height / start.height;

        const startCX = start.left + start.width / 2;
        const startCY = start.top + start.height / 2;
        const endCX = endRect.left + endRect.width / 2;
        const endCY = endRect.top + endRect.height / 2;

        setTransform({
          tx: endCX - startCX,
          ty: endCY - startCY,
          scaleX,
          scaleY,
        });
      });
    }

    rafId = requestAnimationFrame(check);
    return () => cancelAnimationFrame(rafId);
  }, [mounted, endRef]);

  const handleTransitionEnd = useCallback((e) => {
    if (e.propertyName === "transform") {
      onComplete?.();
    }
  }, [onComplete]);

  if (!mounted || !src) return null;

  const start = startRef.current;
  const isAnimating = transform !== null;

  const style = {
    position: "fixed",
    zIndex: 9999,
    top: start.top,
    left: start.left,
    width: start.width,
    height: start.height,
    borderRadius: isAnimating ? 12 / transform.scaleX : viewfinder.borderRadius,
    objectFit: "cover",
    transformOrigin: "center center",
    transform: isAnimating
      ? `translate(${transform.tx}px, ${transform.ty}px) scale(${transform.scaleX}, ${transform.scaleY})`
      : "translate(0, 0) scale(1, 1)",
    willChange: "transform, border-radius",
    transition: isAnimating
      ? `transform ${scaleDuration(base.morph)}ms var(--ease-out-cubic), border-radius ${scaleDuration(base.morph)}ms var(--ease-out-cubic)`
      : "none",
  };

  return (
    <img
      src={src}
      alt=""
      style={style}
      onTransitionEnd={handleTransitionEnd}
    />
  );
}
