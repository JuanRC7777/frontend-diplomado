import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "outline";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
}

const VARIANTES: Record<Variant, string> = {
   primary:
    "bg-[#334155] text-white hover:bg-[#1E293B]",

  secondary:
    "bg-[#64748B] text-white hover:bg-[#475569]",

  outline:
    "border-2 border-[#64748B] text-[#334155] hover:bg-[#334155] hover:text-white",
};

const TAMANOS: Record<Size, string> = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-5 py-2.5 text-sm",
  lg: "px-6 py-3 text-base",
};

export default function Button({
  variant = "primary",
  size = "md",
  fullWidth = false,
  className = "",
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`rounded-xlfont-semibold transition-colors duration-150 ${VARIANTES[variant]} ${TAMANOS[size]} ${
        fullWidth ? "w-full" : ""
      } ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
