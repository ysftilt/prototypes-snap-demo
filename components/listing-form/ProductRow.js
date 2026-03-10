export default function ProductRow({ title, imageSrc }) {
  return (
    <div className="flex items-center gap-3 px-3 pt-3 pb-2">
      {/* Product image placeholder */}
      <div className="w-[72px] h-[72px] rounded-xl bg-panel-border/76 shrink-0 overflow-hidden">
        {imageSrc ? (
          <img src={imageSrc} alt={title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-panel" />
        )}
      </div>

      {/* Title */}
      <p className="text-[17px] leading-[22px] tracking-[-0.01em] font-[650] text-foreground">
        {title}
      </p>
    </div>
  );
}
