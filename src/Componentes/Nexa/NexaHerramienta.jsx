

const NexaHerramienta = () => {
  // Generación de parámetros LTI para activar el VisorNuevo al hacer clic
  const localPdfUrl = window.location.origin + '/documento.pdf';
  const params = new URLSearchParams({
    userId: '2',
    user: 'Juan Perez',
    email: 'juanperez@gmail.com',
    course: 'Introduccion a la informatica',
    section: 'Historia de la Informatica',
    pdfUrl: localPdfUrl
  });

  const nexaUrl = `/?${params.toString()}`;

  return (
    <div className="relative group bg-neutral-900 border border-neutral-800 rounded-[2.5rem] p-8 md:p-12 shadow-2xl overflow-hidden backdrop-blur-sm transition-all duration-500 hover:border-blue-500/30">
      
      <p className="text-xl md:text-2xl text-blue-200/90 mb-10 font-medium italic text-center tracking-wide">
        "La accesibilidad se entiende mejor cuando se vive."
      </p>

      {/* Contenedor del Simulador */}
      <div className="max-w-2xl mx-auto bg-neutral-950 border border-neutral-800 rounded-2xl p-6 md:p-8 shadow-inner relative z-10">
        
        {/* Título de la actividad */}
        <h3 className="text-xl md:text-2xl font-bold text-white mb-6 border-b border-neutral-800 pb-4 flex items-center justify-center gap-3 text-center">
          Probar Simulador de la herramienta de accesibilidad
        </h3>

        {/* Lista de actividades */}
        <ul className="space-y-4">
          <li className="flex items-center justify-between p-4 bg-neutral-900 border border-neutral-800 rounded-xl hover:border-blue-500/50 hover:bg-neutral-800/60 transition-all duration-300 group/item shadow-sm">
            
            <div className="flex items-center space-x-3">
              <img 
                src="./Nexa-Logo.png" 
                alt="NEXA Logo" 
                className="w-8 h-8 object-contain transition-transform group-hover/item:scale-110" 
              />
              <a 
                id="nexa-link" 
                href={nexaUrl} 
                className="text-blue-400 font-semibold text-base md:text-lg group-hover/item:text-blue-300 hover:underline transition-colors"
              >
                NEXA External Tool
              </a>
            </div>

            <span className="bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs px-3 py-1.5 rounded-full font-medium tracking-wide">
              Herramienta LTI
            </span>

          </li>
        </ul>

      </div>
    </div>
  );
};

export default NexaHerramienta;