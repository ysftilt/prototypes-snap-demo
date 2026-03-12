"use client";

import { useState } from "react";
import TextInput from "../TextInput";

export default function ProductRow({ title, imageSrc }) {
  const [value, setValue] = useState(title);

  return (
    <div className="flex items-start gap-2">
      {/* Product image */}
      <div className="w-[72px] h-[72px] rounded-[12px] border border-panel-border/52 shrink-0 overflow-hidden">
        {imageSrc ? (
          <img src={imageSrc} alt={value} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-panel" />
        )}
      </div>

      {/* Editable title */}
      <div className="flex-1 min-w-0 min-h-[72px] flex py-1">
        <TextInput
          showLabel={false}
          multiline
          value={value}
          onChange={setValue}
        />
      </div>
    </div>
  );
}
