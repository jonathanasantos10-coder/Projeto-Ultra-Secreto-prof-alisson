import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AtendimentoModel, AtendimentoPayload } from '../models/atendimento.model';
import { API_URL } from './api-config';

@Injectable({ providedIn: 'root' })
export class AtendimentoService {
  private readonly url = `${API_URL}/Atendimento`;

  constructor(private http: HttpClient) {}

  listar(): Observable<AtendimentoModel[]> {
    return this.http.get<AtendimentoModel[]>(this.url);
  }

  salvar(dados: AtendimentoPayload, id?: number): Observable<unknown> {
    return id ? this.http.put(`${this.url}/${id}`, dados) : this.http.post(this.url, dados);
  }

  excluir(id: number): Observable<unknown> {
    return this.http.delete(`${this.url}/${id}`);
  }
}
