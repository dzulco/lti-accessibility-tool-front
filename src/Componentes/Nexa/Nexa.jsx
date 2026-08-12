import React from 'react';
import NexaHerramienta from './NexaHerramienta.jsx';

export default function NexaProjectView() {
  const features = [
    {
      id: 1,
      icon: "🧠",
      title: "Herramientas Inteligentes",
      description: "Generación de resúmenes automáticos, flashcards y cuestionarios directamente desde el documento.",
      iconBg: "bg-blue-500/10",
      iconColor: "text-blue-400",
      borderHover: "hover:border-blue-500/50",
      shadowHover: "hover:shadow-[0_0_30px_rgba(59,130,246,0.15)]",
      lineColor: "bg-blue-500"
    },
    {
      id: 2,
      icon: "🎧",
      title: "Ajustes de Lectura",
      description: "Funcionalidad de texto a voz para escuchar los apuntes y un 'Modo Concentrado' para evitar distracciones.",
      iconBg: "bg-teal-500/10",
      iconColor: "text-teal-400",
      borderHover: "hover:border-teal-500/50",
      shadowHover: "hover:shadow-[0_0_30px_rgba(20,184,166,0.15)]",
      lineColor: "bg-teal-500"
    },
    {
      id: 3,
      icon: "👁️",
      title: "Personalización Visual",
      description: "Ajustes en los colores del PDF y selección de tipografías adaptadas, como Nunito o OpenDyslexic.",
      iconBg: "bg-sky-500/10",
      iconColor: "text-sky-400",
      borderHover: "hover:border-sky-500/50",
      shadowHover: "hover:shadow-[0_0_30px_rgba(14,165,233,0.15)]",
      lineColor: "bg-sky-500"
    }
  ];

  const team = [
    { name: "Valeria Sestua", url: "https://www.linkedin.com/in/valeriasestua/" },
    { name: "Lucas Sorzio", url: "https://www.linkedin.com/in/lucas-sorzio/" },
    { name: "Nicolas Bilic", url: "https://www.linkedin.com/in/nicolasbilic/" },
    { name: "Damian Zulcovsky", url: "https://www.linkedin.com/in/damianzulcovsky/" },
    { name: "Tiziana Benegas", url: "https://www.linkedin.com/in/tiziana-benegas-la-valle-qa/" },
    { name: "Jacqueline Valenzuela", url: "https://www.linkedin.com/in/jacquelina/" },
    { name: "Santiago Mendoza", url: "https://www.linkedin.com/in/santiagomendoza/" }
  ];

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-300 font-sans overflow-x-hidden">
      
     
      <section className="relative w-full py-32 px-4 flex flex-col items-center justify-center text-center">
       
        <div className="relative z-10 max-w-4xl mx-auto space-y-6">
          <h1 className="text-5xl md:text-7xl font-black tracking-tight text-white">
            NEXA 
          </h1>
          <p className="text-xl md:text-2xl font-light leading-relaxed text-neutral-400 max-w-3xl mx-auto">
            Buscamos que la educación se adapte a las personas, y no al revés. No reemplazamos el aula, la potenciamos.
          </p>
        </div>
      </section>

      <section className="w-full bg-neutral-900/40 border-y border-neutral-800/50 py-24 px-4">
        <div className="max-w-4xl mx-auto flex flex-col items-center text-center space-y-8">
          
          <div className="flex flex-col items-center">
            <h2 className="text-3xl font-bold text-white mb-4">El Desafío</h2>
            <div className="w-12 h-1 bg-blue-500 rounded-full"></div>
          </div>
          
          <div className="space-y-6 max-w-3xl">
            <p className="text-lg leading-relaxed text-neutral-300">
              El ecosistema educativo digital suele diseñarse bajo un molde único, ignorando la enorme diversidad cognitiva y visual de quienes estudian. El verdadero reto era derribar esas barreras de accesibilidad y crear una herramienta que se adaptara al usuario, en lugar de obligarlo a adaptarse a ella.
            </p>
            <p className="text-lg leading-relaxed text-neutral-300">
              Resolver esta problemática exigió un <strong className="text-white font-semibold">trabajo íntegro y constante</strong> en la construcción de una interfaz completamente limpia, accesible y de alto rendimiento.
            </p>
          </div>

        </div>
      </section>

    
      <section className="w-full py-24 px-4 bg-neutral-950">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature) => (
              <div 
                key={feature.id} 
                className={`relative group bg-neutral-900 border border-neutral-800 rounded-3xl p-10 transition-all duration-300 ease-out hover:-translate-y-2 ${feature.borderHover} ${feature.shadowHover} flex flex-col items-center text-center`}
              >
                <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[2px] rounded-b-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${feature.lineColor}`}></div>
                
                <div className={`w-20 h-20 rounded-2xl mb-6 flex items-center justify-center text-4xl ${feature.iconBg} ${feature.iconColor} border border-white/5 group-hover:scale-110 transition-transform duration-300`}>
                  {feature.icon}
                </div>
                
                <h3 className="text-xl font-bold mb-4 text-white group-hover:text-neutral-200 transition-colors">
                  {feature.title}
                </h3>
                
                <p className="text-neutral-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

   
      <section className="w-full py-24 px-4 flex justify-center">
        <div className="w-full max-w-4xl">
          <NexaHerramienta />
        </div>
      </section>

      <section className="relative w-full py-24 px-4 bg-linear-to-b from-neutral-900/50 to-neutral-950 border-t border-neutral-800/30 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#fff_1px,transparent_1px)] [bg-size:20px_20px]"></div>
        
        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-10">
          <div className="space-y-4 flex flex-col items-center">
            <h3 className="text-3xl font-bold text-white">
              Un agradecimiento gigante 🙌
            </h3>
            <p className="text-neutral-400 text-lg max-w-2xl">
              A mi increíble equipo por tanta dedicación y a <span className="font-semibold text-blue-400">Innova Lab</span> por esta experiencia transformadora. ¡Qué gran recorrido hicimos juntos!
            </p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-3">
            {team.map((member, index) => (
              <a 
                key={index} 
                href={member.url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-neutral-950 text-neutral-300 px-5 py-2.5 rounded-full text-sm font-medium border border-neutral-800 hover:border-blue-500/50 hover:bg-blue-500/10 hover:text-blue-300 transition-all duration-300 cursor-pointer"
              >
                {member.name}
              </a>
            ))}
          </div>
        </div>
      </section>

    </main>
  );
}