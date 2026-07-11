export default function About() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <span className="text-[#525252] text-xs font-bold uppercase tracking-widest">Acerca de</span>
      <h1 className="text-4xl font-bold text-[#171717] mt-3 mb-4">PawCare</h1>
      <p className="text-[#525252] text-lg leading-relaxed max-w-2xl">
        PawCare centraliza dos servicios esenciales para el bienestar animal: la adopción
        responsable y el acceso a jornadas de vacunación para perros y gatos.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-12">
        <div className="bg-white rounded-2xl p-6 border border-[rgba(0,0,0,0.1)] shadow-sm">
          <div className="text-3xl mb-3">🐾</div>
          <h2 className="font-bold text-[#171717] text-lg mb-2">Adopción responsable</h2>
          <p className="text-[#525252] text-sm leading-relaxed">
            Perfiles de animales en busca de hogar con foto, historial de salud, carnet y datos
            de contacto, para facilitar adopciones informadas.
          </p>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-[rgba(0,0,0,0.1)] shadow-sm">
          <div className="text-3xl mb-3">💉</div>
          <h2 className="font-bold text-[#171717] text-lg mb-2">Jornadas de vacunación</h2>
          <p className="text-[#525252] text-sm leading-relaxed">
            Jornadas comunitarias y oficiales de vacunación, con lugar, fecha, hora y vacunas
            disponibles.
          </p>
        </div>
      </div>

      <div className="mt-12 bg-white rounded-2xl p-8 border border-[rgba(0,0,0,0.1)] shadow-sm">
        <h2 className="font-bold text-[#171717] text-xl mb-6">Tecnologías utilizadas</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { icon: "⚛️", name: "React", desc: "UI dinámica" },
            { icon: "⚡", name: "Vite", desc: "Build tool" },
            { icon: "🛣️", name: "React Router", desc: "Navegación" },
            { icon: "🎨", name: "Tailwind CSS", desc: "Estilos" },
          ].map((tech) => (
            <div key={tech.name} className="text-center p-4 bg-[#F5F5F5] rounded-xl">
              <div className="text-2xl mb-2">{tech.icon}</div>
              <p className="font-bold text-[#171717] text-sm">{tech.name}</p>
              <p className="text-[#525252] text-xs">{tech.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-12 text-center">
        <h2 className="font-bold text-[#171717] text-xl mb-6">Equipo</h2>
        <p className="text-[#525252] text-sm max-w-md mx-auto">
          Proyecto desarrollado en equipo para el diplomado de desarrollo web.
        </p>
      </div>
    </div>
  );
}
