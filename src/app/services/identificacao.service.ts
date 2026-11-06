import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { API_URL } from './api-config';

export interface IdentificacaoModel {
  idpessoa: number;
  nome: string;
  intendencia: boolean;
}

export interface IdentificacaoPayload {
  cpf: number;
  senha: string;
}

@Injectable({ providedIn: 'root' })
export class IdentificacaoService {
  readonly atual = signal<IdentificacaoModel | null>(null);
  private readonly url = `${API_URL}/Identificacao`;

  constructor(private readonly http: HttpClient) {}

  /** GET /api/Identificacao — verifica o cookie de sessão atual. */
  verificar(): Observable<IdentificacaoModel> {
    return this.http.get<IdentificacaoModel>(this.url).pipe(tap((dados) => this.atual.set(dados)));
  }

  /** POST /api/Identificacao — autenticação por CPF e senha. */
  entrar(cpf: number, senha: string): Observable<IdentificacaoModel> {
    const dados: IdentificacaoPayload = { cpf, senha };
    return this.http.post<IdentificacaoModel>(this.url, dados).pipe(tap((d) => this.atual.set(d)));
  }

  /** DELETE /api/Identificacao — encerra a sessão. */
  sair(): Observable<void> {
    return this.http.delete<void>(this.url).pipe(tap(() => this.atual.set(null)));
  }
}
