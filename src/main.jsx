import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'bootstrap/dist/css/bootstrap.min.css'
import './index.css'
import App from './App.jsx'

// 💡 Polyfill seguro para Safari: Solo se define si Math existe y sumPrecise NO existe
if (typeof Math !== 'undefined' && typeof Math.sumPrecise !== 'function') {
    try {
        Object.defineProperty(Math, 'sumPrecise', {
            value: function sumPrecise(numbers) {
                let sum = 0
                if (numbers && typeof numbers[Symbol.iterator] === 'function') {
                    for (const n of numbers) {
                        sum += Number(n) || 0
                    }
                }
                return sum
            },
            writable: true,
            configurable: true,
        })
    } catch (e) {
        // Fallback simple si Object.defineProperty está restringido
        Math.sumPrecise = function (numbers) {
            let sum = 0
            for (const n of numbers) { sum += Number(n) || 0 }
            return sum
        }
    }
}
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
