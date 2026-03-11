export default function PricingRow({ pricing = [] }) {
  return (
    <div className="flex gap-2">
      {pricing.map(({ label, value }, i) => (
        <div key={i} className="flex-1 flex flex-col gap-0.5">
          <span className="text-[13px] leading-[20px] font-[500] text-[#a3a0a7] px-1">
            {label}
          </span>
          <div className="bg-panel-border/76 rounded-lg px-2 py-1.5">
            <span className="text-[13px] leading-[20px] font-[500] text-foreground">
              {value}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
