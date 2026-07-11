export default function Footer() {
  return (
    <footer className="bg-[#264653] mt-auto">
      <div className="max-w-6xl mx-auto px-4 py-6 text-center text-white/60 text-sm">
        <p>🐾 PawCare — Plataforma de bienestar animal</p>
        <p className="mt-1">Proyecto del diplomado · {new Date().getFullYear()}</p>
      </div>
    </footer>
  );
}