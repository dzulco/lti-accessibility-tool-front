import { createContext, useState, useEffect } from "react";
import * as pdfjsLib from 'pdfjs-dist';
import pdfWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

export const PdfContext = createContext();

export const PdfProvider = ({ children }) => {
    const [pdfUrl, setPdfUrl] = useState(null);
    const [pdfData, setPdfData] = useState(null);
    const [cargando, setCargando] = useState(false);
    const [mostrarFlashcards, setMostrarFlashcards] = useState(false);
    const [error, setError] = useState(null);
    const [visible, setVisible] = useState(false); 
    
    // Estado global para el menú de herramientas (PanelHerramientas)
    const [menuAbierto, setMenuAbierto] = useState(false);
   
    const [resultado, setResultado] = useState({
        "quiz": [
            {
                "pregunta": "Pregunta 1",
                "opciones": ["Opción 1", "Opción 2", "Opción 3", "Opción 4"],
                "respuestaCorrecta": "Respuesta Correcta"
            },
            {
                "pregunta": "Pregunta 2",
                "opciones": ["Opción 1", "Opción 2", "Opción 3", "Opción 4"],
                "respuestaCorrecta": "Respuesta Correcta"
            },
            {
                "pregunta": "Pregunta 3",
                "opciones": ["Opción 1", "Opción 2", "Opción 3", "Opción 4"],
                "respuestaCorrecta": "Respuesta Correcta"
            },
            {
                "pregunta": "Pregunta 4",
                "opciones": ["Opción 1", "Opción 2", "Opción 3", "Opción 4"],
                "respuestaCorrecta": "Respuesta Correcta"
            },
            {
                "pregunta": "Pregunta 5",
                "opciones": ["Opción 1", "Opción 2", "Opción 3", "Opción 4"],
                "respuestaCorrecta": "Respuesta Correcta"
            }
        ]
    });
    
    const [userData, setUserData] = useState(null);
    const [resultadoFlashCars, setResultadoFlashCars] = useState([
        { "frente": "Concepto 1", "reverso": "Fundamentos." },
        { "frente": "Concepto 2", "reverso": "Fundamentos." },
        { "frente": "Concepto 3", "reverso": "Fundamentos." },
        { "frente": "Concepto 4", "reverso": "Fundamentos." },
        { "frente": "Concepto 5", "reverso": "Fundamentos." },
        { "frente": "Concepto 6", "reverso": "Fundamentos." },
        { "frente": "Concepto 7", "reverso": "Fundamentos." },
        { "frente": "Concepto 8", "reverso": "Fundamentos." },
    ]);

    const [resultadoTitleAndSections, setResultadoTitleAndSections] = useState({});
    const [resultadoSeccionesTitleAndSections, setResultadoSeccionesTitleAndSections] = useState({});

    const cargarDocumento = async (url) => {
        setCargando(true);
        setError(null);
        try {
            const urlMoodleEncodada = encodeURIComponent(url);
            const baseUrl = import.meta.env.VITE_BACKEND_URL || ''; 
            const urlTuApi = `${baseUrl}/api/v1/view?fileUrl=${urlMoodleEncodada}`; 
         	const res = await fetch(urlTuApi);
            if (!res.ok) throw new Error("Error al obtener el PDF");
         
            if (!res.ok) throw new Error("Error al obtener el PDF");

            const arrayBuffer = await res.arrayBuffer();
            const documentoPdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
            
            let textoAcumulado = '';
            for (let i = 1; i <= documentoPdf.numPages; i++) {
                const pagina = await documentoPdf.getPage(i);
                const contenido = await pagina.getTextContent();
                textoAcumulado += contenido.items.map(item => item.str).join(' ') + '\n';
            }
           
            setPdfData(textoAcumulado);
            setPdfUrl(url);
        } catch (err) {
            setError(err.message);
        } finally {
            setCargando(false);
        }
    };

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const userId = params.get('userId');
        const user = params.get('user');
        const email = params.get('email');
        const course = params.get('course');
        const section = params.get('section');
        const urlInicial = params.get('pdfUrl');

        if (userId) {
            setUserData({ userId, user, email, course, section, pdfUrl: urlInicial });
        }

        if (urlInicial) {
            cargarDocumento(urlInicial);
        }

        if (userId || urlInicial) {
            window.history.replaceState({}, document.title, window.location.pathname);
        }
    }, []); 

  const enviarDatoTitleAndSections = async (textoDirecto) => {
        // Toma el argumento directo o cae en el estado
        const textoAEnviar = textoDirecto || pdfData;

        console.log("PDF DATA ENVIADO AL BACKEND:", textoAEnviar ? textoAEnviar.substring(0, 60) + "..." : "VACÍO");

        if (!textoAEnviar || typeof textoAEnviar !== 'string' || textoAEnviar.trim() === '') {
            console.error("El texto del PDF está vacío o no es un string válido.");
            return;
        }

        try {
            const baseUrl = import.meta.env.VITE_BACKEND_URL || '';
            const urlTuApi = `${baseUrl}/api/v1/titleAndSections`;

            const response = await fetch(urlTuApi, {
                method: 'POST',
                headers: { 'Content-Type': 'text/plain; charset=utf-8' },
                body: textoAEnviar,
            });

            if (!response.ok) throw new Error("Error en la respuesta del servidor");

            const reader = response.body.getReader();
            const decoder = new TextDecoder('utf-8');
            let jsonAcumulado = '';

            // Lectura en tiempo real del stream
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value, { stream: true });
                jsonAcumulado += chunk;

                // Extraer título en tiempo real
                const tituloMatch = jsonAcumulado.match(/"titulo"\s*:\s*"([^"]+)"/);
                if (tituloMatch && tituloMatch[1]) {
                    setResultadoTitleAndSections(prev => ({ ...prev, titulo: tituloMatch[1] }));
                }

                // Extraer subtítulo en tiempo real
                const subtituloMatch = jsonAcumulado.match(/"subtitulo"\s*:\s*"([^"]+)"/);
                if (subtituloMatch && subtituloMatch[1]) {
                    setResultadoTitleAndSections(prev => ({ ...prev, subtitulo: subtituloMatch[1] }));
                }

                // Extraer secciones completas a medida que llegan
                const seccionesCoincidentes = [...jsonAcumulado.matchAll(/\{\s*"titulo_seccion"\s*:\s*"([^"]+)"\s*,\s*"contenido"\s*:\s*"([^"]+)"\s*\}/g)];
                if (seccionesCoincidentes.length > 0) {
                    const seccionesProcesadas = seccionesCoincidentes.map(m => ({
                        titulo_seccion: m[1],
                        contenido: m[2]
                    }));
                    setResultadoSeccionesTitleAndSections(seccionesProcesadas);
                }
            }

            // 🔍 LOG DE CONTROL
            console.log("=== RESPUESTA COMPLETA DE LA IA (RAW) ===");
            console.log(jsonAcumulado);
            console.log("=========================================");

            // 1. Quitar los prefijos "data:" que envía Spring WebFlux en SSE
            let textoLimpio = jsonAcumulado
                .split('\n')
                .map(linea => linea.replace(/^data:\s*/, ''))
                .join('');

            // 2. Extraer ÚNICAMENTE lo que está entre el primer '{' y el último '}'
            const inicioJson = textoLimpio.indexOf('{');
            const finJson = textoLimpio.lastIndexOf('}');

            if (inicioJson !== -1 && finJson !== -1 && finJson > inicioJson) {
                textoLimpio = textoLimpio.substring(inicioJson, finJson + 1);

                // 3. Sanitizar caracteres de control invisibles (saltos de línea internos)
                textoLimpio = textoLimpio
                    .replace(/[\r\n\t]+/g, " ")
                    .replace(/\\"/g, '"');

                try {
                    const dataFinal = JSON.parse(textoLimpio);
                    setResultadoTitleAndSections(dataFinal);
                    setResultadoSeccionesTitleAndSections(dataFinal.secciones || []);
                    console.log("¡JSON procesado y parseado con éxito!", dataFinal);
                } catch (errorParse) {
                    console.error("Error al parsear el JSON sanitizado:", errorParse);
                    console.log("Texto que intentó parsear:", textoLimpio);
                }
            } else {
                console.error("No se encontró una estructura JSON válida en el stream.");
            }

        } catch (error) {
            console.error('Error al recibir el streaming de Spring Boot:', error);
        }
    };
	
    useEffect(() => {
        // Validamos que pdfData exista y no sea solo espacios en blanco
        if (pdfData && typeof pdfData === 'string' && pdfData.trim() !== '') {
            enviarDatoTitleAndSections(pdfData); // Le pasamos pdfData directamente
        }
    }, [pdfData]);
	
    const enviarDatoFlashCars = async () => {
        if (!pdfData) return;
        try {
            const baseUrl = import.meta.env.VITE_BACKEND_URL || ''; 
			const urlTuApi = `${baseUrl}/api/v1/flashcards`;
			const responseFlashCars = await fetch(urlTuApi, {
                method: 'POST',
                headers: { 'Content-Type': 'text/plain' },
                body: pdfData,
            });

            if (responseFlashCars.ok) {
                const dataFlashCars = await responseFlashCars.json();
                setResultadoFlashCars(dataFlashCars);
                setMostrarFlashcards(true);
                setVisible(false); 
            }
        } catch (error) {
            console.error('Error al conectar con Spring Boot:', error);
        }
    };

    const enviarDato = async (e) => {
        if (e && e.preventDefault) e.preventDefault();
        if (!pdfData) return;

        try {
            const baseUrl = import.meta.env.VITE_BACKEND_URL || ''; 
			const urlTuApi = `${baseUrl}/api/v1/quiz`;
			const response = await fetch(urlTuApi, {
                method: 'POST',
                headers: { 'Content-Type': 'text/plain' },
                body: pdfData,
            });

            if (response.ok) {
                const data = await response.json();
                setResultado(data);
                setVisible(true); 
                setMostrarFlashcards(false); 
            }
        } catch (error) {
            console.error('Error al conectar con Spring Boot:', error);
        }
    };

    return (
        <PdfContext.Provider value={{ 
            pdfUrl, pdfData, cargarDocumento, cargando, error, userData, 
            resultadoFlashCars, setResultadoFlashCars, visible, setVisible, 
            enviarDatoFlashCars, enviarDato, resultado, mostrarFlashcards, setMostrarFlashcards,
            enviarDatoTitleAndSections, resultadoTitleAndSections, resultadoSeccionesTitleAndSections,
            menuAbierto, setMenuAbierto,
        }}>
            {children}
        </PdfContext.Provider>
    );
};
