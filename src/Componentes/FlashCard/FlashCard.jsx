import { useContext, useState } from "react";
import { PdfContext } from "../../Context/PdfContext";
import './style.css';

function FlashCard() {
    const { resultadoFlashCars, mostrarFlashcards, setMostrarFlashcards } = useContext(PdfContext);
    const [tarjetasVolteadas, setTarjetasVolteadas] = useState([]);

    // Si no está activo el modal o no hay resultados, no renderizamos nada
    if (!mostrarFlashcards || !resultadoFlashCars) return null;

    const manejarClickTarjeta = (indice) => {
        if (tarjetasVolteadas.includes(indice)) {
            setTarjetasVolteadas(tarjetasVolteadas.filter(i => i !== indice));
        } else {
            setTarjetasVolteadas([...tarjetasVolteadas, indice]);
        }
    };

    const handleCerrarModal = () => {
        if (setMostrarFlashcards) {
            setMostrarFlashcards(false);
        }
    };

    return (
        <div className="fc-overlay" onClick={handleCerrarModal}>
            <div className="fc-content" onClick={e => e.stopPropagation()}>
                {/* Botón flotante para cerrar */}
                <button className="fc-close-btn" onClick={handleCerrarModal} title="Cerrar">
                    <span>✕</span>
                </button>
                
                {/* Cabecera del modal */}
                <div className="fc-header">
                    <h2>📚 Flashcards Inteligentes</h2>
                    <p>Haga clic sobre una tarjeta para ver la respuesta.</p>
                </div>

                {/* Contenedor con scroll para las tarjetas */}
                <div className="fc-body-scroll">
                    <div className="flash-grid">
                        {resultadoFlashCars.map((tarjeta, indice) => {
                            const estaVolteada = tarjetasVolteadas.includes(indice);
                            return (
                                <div
                                    key={indice}
                                    className={`flashcard ${estaVolteada ? "volteada" : ""}`}
                                    onClick={() => manejarClickTarjeta(indice)}
                                >
                                    <div className="flash-inner">
                                        <div className="flash-front">
                                            <span className="numero">Flashcard {indice + 1}</span>
                                            <h4>{tarjeta.frente}</h4>
                                        </div>
                                        <div className="flash-back">
                                            <span className="numero">Respuesta</span>
                                            <p>{tarjeta.reverso}</p>
                                        </div>
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

export default FlashCard;