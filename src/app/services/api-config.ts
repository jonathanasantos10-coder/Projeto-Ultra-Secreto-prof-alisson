/**
 * URL relativa consumida pelo Angular.
 * Em desenvolvimento, proxy.conf.json encaminha /api para o ASP.NET em
 * https://localhost:7067. Assim, o navegador faz chamadas same-origin e não
 * depende de CORS para enviar o cookie de autenticação.
 */
export const API_URL = 'https://localhost:7067/api';
