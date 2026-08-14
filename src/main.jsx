import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'bootstrap/dist/css/bootstrap.min.css'
import './index.css'
import App from './App.jsx'

async function enableMocking() {
    // Por defecto usará Mocks a menos que explicitamente definas VITE_USE_MOCKS='false'
    const useMocks = import.meta.env.VITE_USE_MOCKS !== 'false'

    if (useMocks) {
        const { worker } = await import('./mocks/browser')
        return worker.start({
            serviceWorker: { url: '/mockServiceWorker.js' },
            onUnhandledRequest: 'bypass',
        })
    }
}

enableMocking().then(() => {
    createRoot(document.getElementById('root')).render(
        <StrictMode>
            <App />
        </StrictMode>,
    )
})
