"use client";

import { useState } from "react";
import ShortcutBanner from "./ShortcutBanner";
import ProductRow from "./ProductRow";
import PricingRow from "./PricingRow";
import CountdownBar from "./CountdownBar";

export default function ListingForm({ config, capturedImage }) {
  const { shortcuts, product, pricing, countdown } = config;
  const [hovered, setHovered] = useState(false);

  return (
    <div className="absolute bottom-0 inset-x-0 z-20 px-5 pb-5 animate-slide-up-in">
      {/* Shortcut hint banner — staggered after card */}
      <div className="flex justify-center animate-slide-up-in" style={{ "--delay": "250ms" }}>
        <ShortcutBanner shortcuts={shortcuts} />
      </div>

      {/* Product card */}
      <div
        className="bg-page border border-panel rounded-[24px] flex flex-col gap-2 p-3 overflow-hidden"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <ProductRow title={product.title} imageSrc={capturedImage || product.imageSrc} />
        <PricingRow pricing={pricing} />
        <CountdownBar text={countdown.text} paused={hovered} />
      </div>
    </div>
  );
}
