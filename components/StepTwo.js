import StreamPanel from "./StreamPanel";

export default function StepTwo({ config, onNext, onBack }) {
  return (
    <StreamPanel onSnap={onNext}>
      <div className="absolute inset-0 z-10 flex items-center justify-center">
        <div className="text-center px-8">
          <p className="text-[12px] leading-[16px] tracking-[0.08em] uppercase text-foreground-muted font-[650] mb-2">
            Step 2
          </p>
          <p className="text-[17px] leading-[24px] tracking-[-0.01em] font-[650]">
            {config.title}
          </p>
        </div>
      </div>
    </StreamPanel>
  );
}
