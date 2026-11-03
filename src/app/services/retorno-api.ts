import { HttpErrorResponse } from '@angular/common/http';

export function retornoApi(erro: HttpErrorResponse): string {
  if (erro.status === 0) {
    return 'Não foi possível comunicar com a API. Verifique se o backend está ativo em https://localhost:7067 e se o Angular foi iniciado com npm start (proxy /api habilitado).';
  }
  if (erro.status === 401) return 'Identifique-se para continuar.';
  if (erro.status === 403) return 'Acesso restrito à Intendência.';
  if (erro.status === 404) return erro.error?.mensagem || 'Registro não encontrado.';
  if (erro.status === 409) return erro.error?.mensagem || 'A operação conflita com os dados registrados.';
  if (erro.error?.errors) return Object.values(erro.error.errors).flat().join(' ');
  return erro.error?.mensagem || 'Não foi possível concluir a operação. Confira os dados.';
}
