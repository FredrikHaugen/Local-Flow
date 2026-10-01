export function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="rounded-md border border-border bg-card px-1.5 py-0.5 font-mono text-[0.9em] text-foreground">
      {children}
    </kbd>
  );
}
