import { Fragment } from "react";
import KeyShortcut from "../KeyShortcut";

export default function ShortcutBanner({ shortcuts = [] }) {
  return (
    <div className="inline-flex items-center justify-center gap-2 bg-black/90 rounded-t-2xl px-6 py-1 mx-auto">
      {shortcuts.map(({ key, label }, i) => (
        <Fragment key={i}>
          {i > 0 && <span className="w-px h-4 bg-white/20" />}
          <span className="flex items-center gap-2 text-[14px] leading-none px-1 py-1">
            <KeyShortcut label={key} />
            {label}
          </span>
        </Fragment>
      ))}
    </div>
  );
}
