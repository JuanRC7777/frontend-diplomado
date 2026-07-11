import type { ChangeEvent } from "react";

interface FormFieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  error?: string;
  type?: string;
  placeholder?: string;
  options?: { value: string; label: string }[];
}

export default function FormField({ label, name, value, onChange, error, type = "text", placeholder, options }: FormFieldProps) {
  const estilo = `w-full px-4 py-2.5 rounded-lg border bg-white focus:outline-none focus:ring-2 focus:ring-[#2A9D8F] ${
    error ? "border-red-400" : "border-[rgba(38,70,83,0.2)]"
  }`;

  return (
    <div>
      <label className="block text-sm font-semibold text-[#264653] mb-1">{label}</label>

      {options ? (
        <select name={name} value={value} onChange={onChange} className={estilo}>
          <option value="">Selecciona...</option>
          {options.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      ) : (
        <input name={name} type={type} value={value} onChange={onChange} placeholder={placeholder} className={estilo} />
      )}

      {error && <span className="text-red-500 text-xs mt-1 block">{error}</span>}
    </div>
  );
}