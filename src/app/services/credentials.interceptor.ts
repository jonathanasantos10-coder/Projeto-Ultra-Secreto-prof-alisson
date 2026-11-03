import { HttpInterceptorFn } from '@angular/common/http';
import { API_URL } from './api-config';

/**
 * Envia o cookie de sessão nas chamadas relativas à API.
 * Com o proxy, /api é same-origin com o Angular e o cookie Lax do backend
 * funciona sem exigir CORS com credenciais no ambiente de desenvolvimento.
 */
export const credentialsInterceptor: HttpInterceptorFn = (request, next) => {
  if (request.url.startsWith(API_URL)) {
    return next(request.clone({ withCredentials: true }));
  }
  return next(request);
};
