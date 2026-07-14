import { useContext, useState } from "react";
import { JornadasContext } from "../context/jornadas-context";
import CardJornada from "../components/CardJornada";
import FormField from "../components/FormField";
import type { Jornada } from "../types";

const hoy = new Date().toISOString().split("T")[0];

const VACUNAS_OPCIONES = [
    "Antirrábica",
    "Parvovirus",
    "Moquillo",
    "Triple Felina",
    "Leucemia Felina",
    "Bordetella",
    "Rabia",
];

const FORM_INICIAL = {
    titulo: "",
    lugar: "",
    ciudad: "",
    fecha: "",
    hora: "",
    horaFin: "",
    organizador: "",
    contacto: "",
    cupos: "",
    descripcion: "",
};

export default function Vacunacion() {
    const { jornadas, agregarJornada } = useContext(JornadasContext);
    const [pestana, setPestana] = useState<"consulta" | "registro">("consulta");
    const [filtro, setFiltro] = useState("");
    const [form, setForm] = useState(FORM_INICIAL);
    const [vacunasSeleccionadas, setVacunasSeleccionadas] = useState<string[]>([]);
    const [errores, setErrores] = useState<Record<string, string>>({});
    const [mensajeExito, setMensajeExito] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
        setErrores((prev) => ({ ...prev, [e.target.name]: "" }));
    };

    function toggleVacuna(v: string) {
        setVacunasSeleccionadas((prev) =>
            prev.includes(v) ? prev.filter((x) => x !== v) : [...prev, v]
        );
        setErrores((prev) => ({ ...prev, vacunas: "" }));
    }

    function validar() {
        const errs: Record<string, string> = {};
        if (!form.titulo.trim()) errs.titulo = "El título es requerido.";
        if (!form.lugar.trim()) errs.lugar = "El lugar es requerido.";
        if (!form.ciudad.trim()) errs.ciudad = "La ciudad es requerida.";
        if (!form.fecha) {
            errs.fecha = "La fecha es requerida.";
        } else if (form.fecha < hoy) {
            errs.fecha = "La fecha no puede ser anterior a hoy.";
        }
        if (!form.hora) errs.hora = "La hora de inicio es requerida.";
        if (!form.horaFin) errs.horaFin = "La hora de fin es requerida.";
        if (!form.organizador.trim()) errs.organizador = "El organizador es requerido.";
        if (!form.contacto.trim()) {
            errs.contacto = "El correo es requerido.";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.contacto)) {
            errs.contacto = "Formato de correo inválido.";
        }
        if (!form.cupos.trim()) {
            errs.cupos = "Los cupos son requeridos.";
        } else if (isNaN(Number(form.cupos)) || Number(form.cupos) <= 0) {
            errs.cupos = "Debe ser un número mayor a 0.";
        }
        if (vacunasSeleccionadas.length === 0) {
            errs.vacunas = "Selecciona al menos una vacuna.";
        }
        return errs;
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        const errs = validar();
        if (Object.keys(errs).length > 0) {
            setErrores(errs);
            return;
        }

        const nueva: Jornada = {
            id: Date.now(),
            titulo: form.titulo,
            lugar: form.lugar,
            ciudad: form.ciudad,
            fecha: form.fecha,
            hora: form.hora,
            horaFin: form.horaFin,
            vacunas: vacunasSeleccionadas,
            organizador: form.organizador,
            contacto: form.contacto,
            cupos: Number(form.cupos),
            descripcion: form.descripcion,
            fecha_publicacion: hoy,
        };

        agregarJornada(nueva);
        setMensajeExito("¡Jornada publicada! Ya aparece en el listado.");
        setForm(FORM_INICIAL);
        setVacunasSeleccionadas([]);
        setErrores({});

        setTimeout(() => {
            setMensajeExito("");
            setPestana("consulta");
        }, 2000);
    }
    const jornadasFiltradas = jornadas.filter(
        (j) =>
            j.titulo.toLowerCase().includes(filtro.toLowerCase()) ||
            j.ciudad.toLowerCase().includes(filtro.toLowerCase()) ||
            j.organizador.toLowerCase().includes(filtro.toLowerCase())
    );

    return (
        <div className="p-10">
            <h1 className="text-3xl font-bold text-[#171717]">Vacunación</h1>

            {/* Pestañas */}
            <div className="flex gap-2 mt-6 border-b border-[rgba(0,0,0,0.15)]">
                <button
                    onClick={() => setPestana("consulta")}
                    className={`px-6 py-3 text-sm font-semibold border-b-2 ${pestana === "consulta"
                            ? "border-[#525252] text-[#171717]"
                            : "border-transparent text-[#525252]"
                        }`}
                >
                    🔍 Consultar jornadas
                </button>
                <button
                    onClick={() => setPestana("registro")}
                    className={`px-6 py-3 text-sm font-semibold border-b-2 ${pestana === "registro"
                            ? "border-[#525252] text-[#171717]"
                            : "border-transparent text-[#525252]"
                        }`}
                >
                    ➕Publicar jornada
                </button>
            </div>

            {/* CONSULTA */}
            {pestana === "consulta" && (
                <>
                    <input
                        type="text"
                        placeholder="Buscar por título, ciudad u organizador..."
                        value={filtro}
                        onChange={(e) => setFiltro(e.target.value)}
                        className="w-full sm:w-96 px-4 py-2.5 mt-6 rounded-lg border border-[rgba(0,0,0,0.2)] bg-white focus:outline-none focus:ring-2 focus:ring-[#525252]"
                    />

                    <p className="text-sm text-[#525252] mt-4">
                        {jornadasFiltradas.length} jornadas disponibles
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
                        {jornadasFiltradas.map((j) => (
                            <CardJornada key={j.id} jornada={j} />
                        ))}
                    </div>

                    {jornadasFiltradas.length === 0 && (
                        <div className="text-center py-20 text-[#525252]">
                            <p className="text-5xl mb-4">💉</p>
                            <p className="text-lg font-semibold">No se encontraron jornadas.</p>
                        </div>
                    )}
                </>
            )}

            {/* REGISTRO */}
            {pestana === "registro" && (
                <>
                    {mensajeExito && (
                        <div className="max-w-2xl mt-6 p-4 bg-neutral-100 border border-neutral-300 rounded-lg text-black font-semibold">
                            ✅ {mensajeExito}
                        </div>
                    )}
                    <form onSubmit={handleSubmit} className="max-w-2xl mt-6 bg-white rounded-2xl shadow-sm border border-[rgba(0,0,0,0.1)] p-8 grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div className="sm:col-span-2">
                            <FormField label="Título de la jornada" name="titulo" value={form.titulo} onChange={handleChange} error={errores.titulo} placeholder="Ej: Jornada Barrio Centro" />
                        </div>
                        <FormField label="Lugar/ Dirección" name="lugar" value={form.lugar} onChange={handleChange} error={errores.lugar} placeholder="Ej: Parque Central, Calle 10" />
                        <FormField label="Ciudad" name="ciudad" value={form.ciudad} onChange={handleChange} error={errores.ciudad} placeholder="Ej: Bogotá" />
                        <FormField label="Fecha" name="fecha" type="date" value={form.fecha} onChange={handleChange} error={errores.fecha} />
                        <FormField label="Cupos" name="cupos" type="number" value={form.cupos} onChange={handleChange} error={errores.cupos} placeholder="Ej: 100" />
                        <FormField label="Hora inicio" name="hora" type="time" value={form.hora} onChange={handleChange} error={errores.hora} />
                        <FormField label="Hora fin" name="horaFin" type="time" value={form.horaFin} onChange={handleChange} error={errores.horaFin} />
                        <FormField label="Organizador" name="organizador" value={form.organizador} onChange={handleChange} error={errores.organizador} placeholder="Ej: Fundación Huellitas" />
                        <FormField label="Correo de contacto" name="contacto" type="email" value={form.contacto} onChange={handleChange} error={errores.contacto} placeholder="contacto@correo.com" />
                        <div className="sm:col-span-2">
                            <FormField label="Descripción (opcional)" name="descripcion" value={form.descripcion} onChange={handleChange} placeholder="Información adicional..." />
                        </div>

                        {/* Selector de vacunas tipo chips */}
                        <div className="sm:col-span-2">
                            <p className="text-sm font-semibold text-[#171717] mb-2">
                                Vacunas disponibles <span className="text-black">*</span>
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {VACUNAS_OPCIONES.map((v) => (
                                    <button
                                        key={v}
                                        type="button"
                                        onClick={() => toggleVacuna(v)}
                                        className={`px-3 py-1.5 rounded-full text-sm font-semibold border-2 transition-all duration-150 ${vacunasSeleccionadas.includes(v)
                                                ? "bg-[#525252] border-[#525252] text-white"
                                                : "bg-white border-[rgba(0,0,0,0.2)] text-[#525252] hover:border-[#525252]"
                                            }`}
                                    >
                                        {v}
                                    </button>
                                ))}
                            </div>
                            {errores.vacunas && (
                                <span className="text-black font-semibold text-xs mt-1 block">{errores.vacunas}</span>
                            )}
                        </div>

                        <button
                            type="submit"
                            className="sm:col-span-2 bg-[#525252] text-white font-semibold py-3 rounded-lg hover:bg-[#333333]"
                        >
                            Publicar jornada
                        </button>
                    </form>
                </>
            )}
        </div>
    );
}