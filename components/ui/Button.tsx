import { forwardRef, type ButtonHTMLAttributes } from "react";

export type ButtonVariant = "primary" | "secondary" | "ghost";
export type ButtonSize = "sm" | "md";

const base =
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-semibold transition-all duration-150 ease-out cursor-pointer " +
  "focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background " +
  "disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0";

const variantStyles: Record<ButtonVariant, string> = {
  primary: "bg-accent text-accent-foreground shadow-sm hover:bg-accent-hover hover:scale-[1.02] active:bg-accent-active",
  secondary: "bg-surface text-foreground border border-border hover:border-border-strong hover:bg-surface-sunken",
  ghost: "text-foreground-tertiary hover:bg-border/50 hover:text-foreground",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "h-8 px-3 text-[12.5px] rounded-lg",
  md: "h-10 px-4 text-[13.5px] rounded-lg",
};

/** Class string for links that should look like buttons */
export function buttonClass(variant: ButtonVariant = "primary", size: ButtonSize = "md", className = "") {
  return [base, variantStyles[variant], sizeStyles[size], className].filter(Boolean).join(" ");
}

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", className = "", type = "button", ...props }, ref) => (
    <button ref={ref} type={type} className={buttonClass(variant, size, className)} {...props} />
  ),
);
Button.displayName = "Button";

export function IconButton({ className = "", ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      className={
        "relative flex size-9 items-center justify-center rounded-lg text-foreground-tertiary transition-colors cursor-pointer " +
        "hover:bg-border/50 hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-accent [&_svg]:size-[18px] " +
        className
      }
      {...props}
    />
  );
}
