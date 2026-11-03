import { RenderMode } from '@angular/ssr';
// Este sistema depende de sessão por cookie e de dados locais da API.
// As telas são renderizadas no navegador, sem chamadas à API durante prerender.
export const serverRoutes = [
    {
        path: '**',
        renderMode: RenderMode.Client,
    },
];
