"use client";

import { useState } from "react";
import { base, constants } from "@/config/animation-config";
import { useSpeed } from "../debug/SpeedContext";
import ShortcutBanner from "./ShortcutBanner";
import ProductRow from "./ProductRow";
import PricingRow from "./PricingRow";
import CountdownBar from "./CountdownBar";

export default function ListingForm({ config, capturedImage, productImageRef, imageVisible, onCountdownComplete, dismissing }) {
  const { shortcuts, product, pricing, countdown } = config;
  const { scaleDuration } = useSpeed();
  const [bannerHovered, setBannerHovered] = useState(false);
  const [cardHovered, setCardHovered] = useState(false);
  const paused = bannerHovered || cardHovered;

  return (
    <div
      className={`absolute bottom-0 inset-x-0 z-20 p-5 ${dismissing ? "animate-slide-down-out" : "animate-slide-up-in"}`}
      style={{
        "--duration-slide-up-in": `${scaleDuration(base.morph)}ms`,
        "--delay": "0ms",
      }}
    >
      {/* Shortcut hint banner — staggered after card */}
      <div
        className="flex justify-center animate-slide-up-in"
        style={{ "--duration-slide-up-in": `${scaleDuration(base.morph)}ms`, "--delay": `${scaleDuration(constants.staggerDelay)}ms` }}
        onMouseEnter={() => setBannerHovered(true)}
        onMouseLeave={() => setBannerHovered(false)}
      >
        <ShortcutBanner shortcuts={shortcuts} paused={paused} />
      </div>

      {/* Product card */}
      <div
        className="bg-page border border-panel rounded-[24px] flex flex-col gap-2 p-3 overflow-hidden"
        onMouseEnter={() => setCardHovered(true)}
        onMouseLeave={() => setCardHovered(false)}
      >
        <ProductRow title={product.title} imageSrc={capturedImage || product.imageSrc} imageRef={productImageRef} imageVisible={imageVisible} />
        <PricingRow pricing={pricing} />
        <CountdownBar text={countdown.text} paused={paused} onComplete={onCountdownComplete} />
      </div>
    </div>
  );
}
