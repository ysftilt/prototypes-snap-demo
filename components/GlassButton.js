export default function GlassButton({ children, onClick, className = "" }) {
  return (
    <button
      onClick={onClick}
      className={`btn-press flex items-center justify-center rounded-full bg-glass backdrop-blur-xl ${className}`}
    >
      {children}
    </button>
  );
}
