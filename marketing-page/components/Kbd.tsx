export function Kbd({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <kbd
      className={`keycap inline-block rounded-md border border-border bg-card px-1.5 py-0.5 font-mono text-[0.85em] leading-snug text-foreground ${className}`}
    >
      {children}
    </kbd>
  );
}
