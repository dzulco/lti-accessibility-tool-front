import React, { useState, useContext, useRef, useMemo, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';
import PanelHerramientas from './PanelHerramientas/PanelHerramientas.jsx';
import './style.css';
import { ColorContext } from '../../Context/fondoContext.jsx';
import { PdfContext } from '../../Context/PdfContext.jsx';
import { MdStopCircle } from "react-icons/md";
import './styleMenu.css';
import FlashCard from '../FlashCard/FlashCard.jsx';
import Cuestionario from '../Cuestionario/Cuestionario.jsx';

export default function VisorAccesibleLTI() {
  const { 
    pdfData, 
    cargando, 
    error, 
    enviarDato, 
    enviarDatoFlashCars, 
    menuAbierto, 
    setMenuAbierto, 
    resultadoSeccionesTitleAndSections,
  } = useContext(PdfContext);

  const { colorFondo, colorTexto, setColorFondo } = useContext(ColorContext);
  const [palabraBuscada, setPalabraBuscada] = useState('');
  const [colorFondoPDF2, setColorFondoPDF2] = useState('#ffffff');
  const [colorTextoPDF2, setColorTextoPDF2] = useState('#1a1a1a');
  const [tamanioLetra, setTamanioLetra] = useState(19);
  const [textoGlobalSeleccionado, setTextoGlobalSeleccionado] = useState('');
  const [menuPosicion, setMenuPosicion] = useState(null);
  const [reproduciendoSeleccion, setReproduciendoSeleccion] = useState(false);
  const [tipoLetra, setTipoLetra] = useState('Nunito');
  const [showExplicacionModal, setShowExplicacionModal] = useState(false);
  const [explicacionTexto, setExplicacionTexto] = useState('');
  const [cargandoResumen, setCargandoResumen] = useState(false);
  const [cargandoExplicacion, setCargandoExplicacion] = useState(false);
  const [tipoModal, setTipoModal] = useState('explicacion');
 
  const contenedorRef = useRef(null);
 
 
  const resaltarTexto = useCallback((texto) => {
    if (typeof texto !== 'string' || !palabraBuscada || palabraBuscada.trim() === "") return texto;

    const escaparRegExp = (string) => string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(${escaparRegExp(palabraBuscada)})`, 'gi');

    const partes = texto.split(regex);
    return partes.map((parte, i) =>
      regex.test(parte) ? (
        <mark key={i} style={{ backgroundColor: '#fde047', color: 'black' }}>
          {parte}
        </mark>
      ) : (
        parte
      )
    );
  }, [palabraBuscada]);

  // 2. Memorizamos el procesador de Children
  const procesarChildren = useCallback((children) => {
    if (typeof children === 'string') {
      return resaltarTexto(children);
    }
    if (Array.isArray(children)) {
      return children.map((c, i) => (
        typeof c === 'string' ? (
          <React.Fragment key={i}>{resaltarTexto(c)}</React.Fragment>
        ) : c
      ));
    }
    return children;
  }, [resaltarTexto]);

 
  const markdownComponents = useMemo(() => ({
    p: ({ children }) => <p>{procesarChildren(children)}</p>,
    h1: ({ children }) => <h1>{procesarChildren(children)}</h1>,
    h2: ({ children }) => <h2>{procesarChildren(children)}</h2>,
    h3: ({ children }) => <h3>{procesarChildren(children)}</h3>,
    li: ({ children }) => <li>{procesarChildren(children)}</li>,
  }), [procesarChildren]);


  const manejarContextMenu = (e) => {
    e.preventDefault(); 
    const seleccion = window.getSelection();
    const texto = seleccion.toString().trim();
    
    if (texto.length > 0 && seleccion.rangeCount > 0) {
      const rango = seleccion.getRangeAt(0);
      
      
      if (contenedorRef.current && contenedorRef.current.contains(rango.startContainer)) {
        setTextoGlobalSeleccionado(texto);
        setMenuPosicion({ 
          x: e.clientX, 
          y: e.clientY 
        });
        return;
      }
    }
    setMenuPosicion(null);
  };

  const solicitarExplicacion = async (texto) => {
    setCargandoExplicacion(true);
    setTipoModal('explicacion');
    try {
      const baseUrl = import.meta.env.VITE_BACKEND_URL || '';
      const urlTuApi = `${baseUrl}/api/v1/explanation`;
      const response = await fetch(urlTuApi, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: texto,
      });
      const data = await response.text();
      setExplicacionTexto(data || "No se recibió respuesta.");
      setShowExplicacionModal(true);
    } catch (error) {
      console.error("Error al pedir explicación:", error);
      alert("Error al conectar con el servidor.");
    } finally {
      setCargandoExplicacion(false);
      setMenuPosicion(null);
    }
  };

  const solicitarResumen = async (textoCompleto) => {
    setCargandoExplicacion(true);
    setCargandoResumen(true);
    setTipoModal('resumen');
    try {
      const baseUrl = import.meta.env.VITE_BACKEND_URL || '';
      const urlTuApi = `${baseUrl}/api/v1/summarize`;
      const response = await fetch(urlTuApi, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: textoCompleto,
      });
      const data = await response.text();
      setExplicacionTexto(data || "No se recibió resumen.");
      setShowExplicacionModal(true);
    } catch (error) {
      console.error("Error al pedir resumen:", error);
      alert("Error al conectar con el servidor para resumir.");
    } finally {
      setCargandoExplicacion(false);
      setMenuPosicion(null);
      setCargandoResumen(false);
    }
  };

  const leerTexto = () => {
    if (!pdfData) return;
    speechSynthesis.cancel();
    const voz = new SpeechSynthesisUtterance(pdfData);
    voz.lang = "es-AR";
    speechSynthesis.speak(voz);
  };

  const leerTextoSeleccionado = (texto) => {
    speechSynthesis.cancel();
    const voz = new SpeechSynthesisUtterance(texto);
    voz.lang = "es-AR";
    voz.onstart = () => setReproduciendoSeleccion(true);
    voz.onend = () => setReproduciendoSeleccion(false);
    speechSynthesis.speak(voz);
    setMenuPosicion(null);
  };

  const detenerTexto = () => {
    speechSynthesis.cancel();
    setReproduciendoSeleccion(false);
  };

  const aplicarTemaPDF = (fondo, texto) => {
    setColorFondoPDF2(fondo);
    setColorTextoPDF2(texto);
  };

  const aplicarTemafondo = (fondo) => {
    setColorFondoPDF2(fondo);
  };

  const aplicarTematexto = (texto) => {
    setColorTextoPDF2(texto);
  };

  const cambiarLetra = (letra) => {
    setTipoLetra(letra);
  };

  function borrarFiltros() {
    setColorFondoPDF2('#ffffff');
    setColorTextoPDF2('#1a1a1a');
    setTipoLetra('sans-serif');
    setTamanioLetra(16);
    setPalabraBuscada('');
    setColorFondo("#DAE9F0");
  }

  const manejarBusqueda = (datosFormulario) => {
    setPalabraBuscada(datosFormulario);
  };

  if (cargando) return <div className="pdf-status">Extrayendo y optimizando el texto para accesibilidad...</div>;
  if (error) return <div className="pdf-status" style={{ color: '#ef4444', padding: '20px' }}><h3>⚠️ Error</h3><p>{error}</p></div>;

  return (
    <div 
      className="visor-container" 
      style={{
        padding: '20px', 
        backgroundColor: colorFondo, 
        color: colorTexto, 
        minHeight: '100vh', 
        transition: 'background-color 0.3s ease', 
        fontFamily: tipoLetra 
      }} 
      onClick={() => setMenuPosicion(null)}
    >
      {pdfData ? (
        <>
          <div className="info-lti-header text-amber-50" style={{ marginBottom: '15px', color: "#0e0707" }}></div>
          {reproduciendoSeleccion && (
            <button className="btn-detener-lectura" onClick={detenerTexto}>
              <MdStopCircle size={22} />
              <span>Detener lectura</span>
            </button>
          )}
          {menuPosicion && (
            <div 
              className="menu-flotante" 
              style={{ 
                top: menuPosicion.y, 
                left: menuPosicion.x, 
                position: 'fixed',
                zIndex: 1000 
              }}
            >
              <button className="btn-menu-escuchar" onClick={() => leerTextoSeleccionado(textoGlobalSeleccionado)}>
                <span role="img" aria-label="megáfono">📢</span> Escuchar
              </button>
              <button className="btn-menu-explicar" onClick={() => solicitarExplicacion(textoGlobalSeleccionado)} disabled={cargandoExplicacion}>
                <span role="img" aria-label="varita mágica">✨</span> {cargandoExplicacion && tipoModal === 'explicacion' ? "Procesando..." : "Explícamelo"}
              </button>
            </div>
          )}
          <PanelHerramientas 
            aplicarTemaFondo={aplicarTemafondo} 
            aplicarTemaTexto={aplicarTematexto} 
            aplicarTemaPDF={aplicarTemaPDF} 
            show={menuAbierto} 
            handleClose={() => setMenuAbierto(false)} 
            tamanioLetra={tamanioLetra} 
            setTamanioLetra={setTamanioLetra} 
            alEscuchar={leerTexto} 
            alDetener={detenerTexto} 
            solicitarResumen={solicitarResumen} 
            cambiarLetra={cambiarLetra} 
            borrarFiltros={borrarFiltros} 
            manejarBusqueda={manejarBusqueda} 
            enviarDato={enviarDato} 
            enviarDatoFlashCars={enviarDatoFlashCars}
            cargandoResumen={cargandoResumen}
          />
          <div 
            ref={contenedorRef}
            className="hoja-texto-container" 
            onContextMenu={manejarContextMenu}
            style={{
              backgroundColor: colorFondoPDF2, 
              color: colorTextoPDF2, 
              fontSize: `${tamanioLetra}px`, 
              padding: '30px', 
              borderRadius: '8px', 
              textAlign: 'left', 
              lineHeight: '1.6', 
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)', 
              wordBreak: 'break-word',
              position: 'relative'
            }}
          >
            <ReactMarkdown components={markdownComponents}>
              {resultadoSeccionesTitleAndSections || pdfData}
            </ReactMarkdown>
          </div>
          <div id="contenedor-herramientas" style={{ marginTop: '40px' }}>
            <FlashCard />
            <Cuestionario />
          </div>
          {showExplicacionModal && (
            <div className="modal-overlay" onClick={() => setShowExplicacionModal(false)}>
              <div className="modal-content" onClick={e => e.stopPropagation()}>
                <h3>{tipoModal === 'resumen' ? 'Resumen del documento' : 'Explicación del fragmento'}</h3>
                <p style={{ whiteSpace: 'pre-wrap' }}>{explicacionTexto}</p>
                <button onClick={() => setShowExplicacionModal(false)}>Cerrar</button>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="pdf-status">No hay documento para mostrar.</div>
      )}
    </div>
  );
}