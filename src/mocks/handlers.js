import { http, HttpResponse } from 'msw';

// 1. Cargar archivo PDF local
import pdfFile from '../../public/documento.pdf';

// 2. Cargar respuestas simuladas de la IA
import explainText from './explain_response.txt?raw';
import summaryText from './summary_response.txt?raw';
import flashcardsData from './flashcards_response.json';
import quizData from './quiz_response.json';

export const handlers = [
    // Cargar/Ver PDF (/api/v1/view)
    http.get('*/api/v1/view', async () => {
        const pdfBuffer = await fetch(pdfFile).then((res) => res.arrayBuffer());
        return new HttpResponse(pdfBuffer, {
            headers: { 'Content-Type': 'application/pdf' },
        });
    }),

    // Generar Flashcards (/api/v1/flashcards)
    http.post('*/api/v1/flashcards', () => {
        return HttpResponse.json(flashcardsData);
    }),

    // Generar Cuestionario (/api/v1/quiz)
    http.post('*/api/v1/quiz', () => {
        return HttpResponse.json(quizData);
    }),

    // Explicación de fragmentos (/api/v1/explanation)
    http.post('*/api/v1/explanation', () => {
        return new HttpResponse(explainText, {
            headers: { 'Content-Type': 'text/plain' },
        });
    }),

    // Resumen del documento (/api/v1/summarize)
    http.post('*/api/v1/summarize', () => {
        return new HttpResponse(summaryText, {
            headers: { 'Content-Type': 'text/plain' },
        });
    }),
];