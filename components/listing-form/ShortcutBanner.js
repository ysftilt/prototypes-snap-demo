import { Fragment } from "react";
import KeyShortcut from "../KeyShortcut";

export default function ShortcutBanner({ shortcuts = [] }) {
  return (
    <div className="inline-flex items-center justify-center gap-1 bg-page rounded-full px-1 py-1 mb-1 backdrop-blur-sm">
      {shortcuts.map(({ key, label }, i) => (
        <Fragment key={i}>
          {/* {i > 0 && <span className="w-px h-4 bg-white/10" />} */}
          <span className="shortcut-pill flex items-center gap-2 text-[14px] leading-none pl-3 pr-2 py-1 rounded-full">
            {label}
            <KeyShortcut label={key} />
          </span>
        </Fragment>
      ))}
    </div>
  );
}
