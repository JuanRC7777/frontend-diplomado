import type { ReactNode } from "react";

type Variant = "success" | "error" | "info";

interface AlertProps {
  variant?: Variant;
  children: ReactNode;
  className?: string;
}

// colores segun el tipo de alerta
const ESTILOS: Record<Variant, string> = {
  success: "bg-neutral-100 border-neutral-300 text-black",
  error: "bg-white border-black text-black",
  info: "bg-[#F5F5F5] border-[rgba(0,0,0,0.15)] text-[#171717]",
};

const ICONOS: Record<Variant, string> = {
  success: "✅",
  error: "⚠️",
  info: "ℹ️",
};

export default function Alert({ variant = "info", children, className = "" }: AlertProps) {
  return (
    <div className={`p-4 rounded-lg border font-semibold text-sm ${ESTILOS[variant]} ${className}`}>
      {ICONOS[variant]} {children}
    </div>
  );
}
