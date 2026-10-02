// macOS-style window chrome for the product mocks: traffic lights, a centered title, optional toolbar.
export function MacWindow({
  title,
  icon,
  toolbar,
  className = "",
  bodyClassName = "",
  children,
}: {
  title: string;
  icon?: React.ReactNode;
  toolbar?: React.ReactNode;
  className?: string;
  bodyClassName?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={`overflow-hidden rounded-xl bg-card font-sans text-foreground ${className}`}>
      <div className="relative flex h-10 items-center gap-2 border-b border-border bg-background/60 px-3.5">
        <span aria-hidden="true" className="flex gap-2">
          <span className="h-3 w-3 rounded-full bg-mac-close" />
          <span className="h-3 w-3 rounded-full bg-mac-min" />
          <span className="h-3 w-3 rounded-full bg-mac-max" />
        </span>
        <span className="pointer-events-none absolute inset-x-20 flex items-center justify-center gap-1.5 truncate text-[0.8rem] font-semibold text-foreground/80">
          {icon}
          {title}
        </span>
        {toolbar && <span className="ml-auto flex items-center gap-3 text-muted">{toolbar}</span>}
      </div>
      <div className={bodyClassName}>{children}</div>
    </div>
  );
}

// The brand motif: four bars of a waveform, used as a bullet and kicker mark.
export function Glyph({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 14 12" className={`h-3 w-3.5 ${className}`} fill="currentColor">
      <rect x="0" y="4" width="2" height="4" rx="1" />
      <rect x="4" y="1" width="2" height="10" rx="1" />
      <rect x="8" y="3" width="2" height="6" rx="1" />
      <rect x="12" y="5" width="2" height="2" rx="1" />
    </svg>
  );
}
