import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AtendimentoModel, AtendimentoPayload } from '../models/atendimento.model';
import { API_URL } from './api-config';

export interface LinhaCompraPayload {
  idItem: number;
  quantidadeItens: number;
}

export interface SituacaoPayload {
  statusAtendimento: string;
}

@Injectable({ providedIn: 'root' })
export class AtendimentoService {
  private readonly url = `${API_URL}/Atendimento`;

  constructor(private readonly http: HttpClient) {}

  /** GET /api/Atendimento?status=... — reservado à Intendência. */
  listar(status = ''): Observable<AtendimentoModel[]> {
    let params = new HttpParams();
    if (status) params = params.set('status', status);
    return this.http.get<AtendimentoModel[]>(this.url, { params });
  }

  /** POST /api/Atendimento ou PUT /api/Atendimento/{id}. */
  salvar(dados: AtendimentoPayload, id?: number): Observable<unknown> {
    return id == null
      ? this.http.post(this.url, dados)
      : this.http.put(`${this.url}/${id}`, dados);
  }

  consultar(id: number): Observable<AtendimentoModel> {
    return this.http.get<AtendimentoModel>(`${this.url}/${id}`);
  }

  excluir(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }

  /** PUT /api/Atendimento/{id}/status. */
  alterarSituacao(id: number, statusAtendimento: string): Observable<void> {
    const dados: SituacaoPayload = { statusAtendimento };
    return this.http.put<void>(`${this.url}/${id}/status`, dados);
  }

  /** GET /api/Atendimento/meus — pedidos do usuário autenticado. */
  meus(): Observable<AtendimentoModel[]> {
    return this.http.get<AtendimentoModel[]>(`${this.url}/meus`);
  }

  /** GET /api/Atendimento/meus/{id} — só permite pedido do usuário autenticado. */
  consultarMeu(id: number): Observable<AtendimentoModel> {
    return this.http.get<AtendimentoModel>(`${this.url}/meus/${id}`);
  }

  /** POST /api/Atendimento/compra — o backend define pessoa, responsável e preço. */
  comprar(itens: LinhaCompraPayload[]): Observable<AtendimentoModel> {
    return this.http.post<AtendimentoModel>(`${this.url}/compra`, { itens });
  }
}
