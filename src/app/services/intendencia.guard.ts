import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { catchError, map, of } from 'rxjs';
import { IdentificacaoService } from './identificacao.service';
export const intendenciaGuard: CanActivateFn = (_, state) => {
  const api = inject(IdentificacaoService),
    router = inject(Router);
  const entrar = () =>
    router.createUrlTree(['/identificacao'], { queryParams: { retorno: state.url } });
  return api.verificar().pipe(
    map((d) => (d.intendencia ? true : entrar())),
    catchError(() => {
      api.atual.set(null);
      return of(entrar());
    }),
  );
};
