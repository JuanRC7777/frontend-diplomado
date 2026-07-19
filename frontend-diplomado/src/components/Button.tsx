import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "outline";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
}

// estilos segun el boton
const VARIANTES: Record<Variant, string> = {
  primary: "bg-[#171717] text-white hover:bg-[#000000]",
  secondary: "bg-[#525252] text-white hover:bg-[#333333]",
  outline: "border-2 border-[#525252] text-[#525252] hover:bg-[#525252] hover:text-white",
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
      className={`rounded-lg font-semibold transition-colors duration-150 ${VARIANTES[variant]} ${TAMANOS[size]} ${
        fullWidth ? "w-full" : ""
      } ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
