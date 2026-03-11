"use client";

import { useState } from "react";
import TextInput from "../TextInput";

export default function PricingRow({ pricing = [] }) {
  const [values, setValues] = useState(() => pricing.map((p) => p.value));

  function handleChange(index, newValue) {
    setValues((prev) => prev.map((v, i) => (i === index ? newValue : v)));
  }

  return (
    <div className="flex gap-2 pt-1">
      {pricing.map(({ label, prefix }, i) => (
        <TextInput
          key={i}
          label={label}
          prefix={prefix}
          value={values[i]}
          onChange={(v) => handleChange(i, v)}
        />
      ))}
    </div>
  );
}
