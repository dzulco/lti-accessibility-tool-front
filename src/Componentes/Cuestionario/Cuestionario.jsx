import { useContext, useState } from "react";
import { PdfContext } from "../../Context/PdfContext";
import './style.css';

function Cuestionario() {
  const { resultado, visible, setVisible } = useContext(PdfContext);
  const [respuestasAbiertas, setRespuestasAbiertas] = useState({});

  if (!resultado?.quiz || !visible) return null;

  const toggleRespuesta = (index, e) => {
    e.preventDefault();
    setRespuestasAbiertas(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const handleCerrarModal = () => {
    setVisible(false);
  };

  return (
    <div className="cuestionario-overlay" onClick={handleCerrarModal}>
      <div className="cuestionario-content" onClick={e => e.stopPropagation()}>
        {/* Botón flotante para cerrar */}
        <button className="cuestionario-close-btn" onClick={handleCerrarModal} title="Cerrar">✕</button>
        
        {/* Cabecera */}
        <div className="cuestionario-header">
          <h2>📝 Cuestionario</h2>
          <p>Poné a prueba lo aprendido con estas preguntas.</p>
        </div>

        {/* Cuerpo con scroll personalizado */}
        <div className="cuestionario-body-scroll">
          <div className="contenedor-preguntas-lista">
            {resultado.quiz.map((item, index) => {
              const letras = ["A", "B", "C", "D"];
              const estaAbierta = respuestasAbiertas[index];

              return (
                <div className="pregunta-card" key={index}>
                  <h5>{index + 1}. {item.pregunta}</h5>

                  <div className="opciones-grid">
                    {item.opciones.map((opcion, i) => (
                      <div className="opcion" key={i}>
                        <strong>{letras[i]})</strong> {opcion}
                      </div>
                    ))}
                  </div>

                  <div className="contenedor-respuesta">
                    <button 
                      type="button" 
                      className="btn-ver-respuesta"
                      onClick={(e) => toggleRespuesta(index, e)}
                    >
                      {estaAbierta ? "Ocultar respuesta" : "✅ Ver respuesta"}
                    </button>

                    {estaAbierta && (
                      <p className="respuesta">
                        {item.respuestaCorrecta}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cuestionario;