import './App.css';
import { ColorProvider } from './Context/fondoContext';
import Navbar from './Componentes/Navbar/Navbar.jsx';
import VisorNuevo from './Componentes/VisorPDF/VisorNuevo.jsx';
import Nexa from './Componentes/Nexa/Nexa.jsx'; // Importamos la landing completa
import { PdfProvider } from './Context/PdfContext.jsx';

function App() {
  // Verificamos si existen parámetros en la URL (lo que indica que se hizo clic en el simulador LTI)
  const queryParams = new URLSearchParams(window.location.search);
  const isToolActive = queryParams.has('pdfUrl') || queryParams.has('userId');

  // Si la herramienta no está activa, mostramos la Landing Page completa de NEXA (sin Navbar)
  if (!isToolActive) {
    return <Nexa />;
  }

  // Si se hizo clic en el botón y los parámetros están activos, cargamos el visor con la app completa
  return (
    <PdfProvider> 
      <Navbar />
      <ColorProvider>
        <VisorNuevo />
      </ColorProvider>
    </PdfProvider>
  );
}

export default App;