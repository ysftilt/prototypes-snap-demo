export default function PricingRow({ pricing = [] }) {
  return (
    <div className="flex gap-2 px-3">
      {pricing.map(({ label, value }, i) => (
        <div key={i} className="flex-1 flex flex-col gap-1.5">
          <span className="text-[12px] leading-none tracking-[0.04em] uppercase text-foreground-muted font-[650]">
            {label}
          </span>
          <div className="bg-panel rounded-lg px-3 py-2.5">
            <span className="text-[15px] leading-none font-[650] text-foreground">
              {value}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
