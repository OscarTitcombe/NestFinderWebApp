import clsx from "clsx";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
}

export function PrimaryButton({ className, asChild, children, ...props }: ButtonProps) {
  if (asChild) {
    return (
      <div
        className={clsx(
          "inline-flex items-center justify-center rounded-xl px-5 py-3 font-medium text-white bg-nest-mint hover:bg-nest-mintHover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nest-sea shadow-sm hover:shadow transition",
          className
        )}
      >
        {children}
      </div>
    );
  }
  
  return (
    <button
      className={clsx(
        "inline-flex items-center justify-center rounded-xl px-5 py-3 font-medium text-white bg-nest-mint hover:bg-nest-mintHover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nest-sea shadow-sm hover:shadow transition",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export function GhostButton({ className, asChild, children, ...props }: ButtonProps) {
  if (asChild) {
    return (
      <div
        className={clsx(
          "inline-flex items-center justify-center rounded-xl px-5 py-3 font-medium text-slate-800 border border-nest-line hover:bg-white/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nest-sea transition",
          className
        )}
      >
        {children}
      </div>
    );
  }
  
  return (
    <button
      className={clsx(
        "inline-flex items-center justify-center rounded-xl px-5 py-3 font-medium text-slate-800 border border-nest-line hover:bg-white/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nest-sea transition",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
