export default function GlassButton({ children, onClick, className = "" }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center justify-center rounded-full bg-glass backdrop-blur-[24px] active:scale-95 transition-transform ${className}`}
    >
      {children}
    </button>
  );
}
