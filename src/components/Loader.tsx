interface LoaderProps {
  label?: string;
}

// spinner de carga ua
export default function Loader({ label = "Cargando..." }: LoaderProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-[#525252]">
      <div className="w-8 h-8 border-4 border-[rgba(0,0,0,0.15)] border-t-[#171717] rounded-full animate-spin" />
      <p className="text-sm font-semibold">{label}</p>
    </div>
  );
}
