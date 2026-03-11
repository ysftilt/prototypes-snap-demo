export default function ProductRow({ title, imageSrc }) {
  return (
    <div className="flex items-start gap-2 pr-3">
      {/* Product image */}
      <div className="w-[72px] h-[72px] rounded-[12px] border border-panel-border/52 shrink-0 overflow-hidden">
        {imageSrc ? (
          <img src={imageSrc} alt={title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-panel" />
        )}
      </div>

      {/* Title */}
      <div className="flex-1 flex items-start min-h-[72px] py-1 px-1">
        <p className="text-body2 font-medium text-foreground">
          {title}
        </p>
      </div>
    </div>
  );
}
