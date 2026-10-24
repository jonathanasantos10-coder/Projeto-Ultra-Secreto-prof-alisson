import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AtendimentoM, AtendimentoPayload } from '../Models/corridaModel';
import { API_URL } from './api-config';

@Injectable({ providedIn: 'root' })
export class CorridaService {
  private readonly url = `${API_URL}/Atendimento`;
  constructor(private http: HttpClient) {}
  list(): Observable<AtendimentoM[]> { return this.http.get<AtendimentoM[]>(this.url); }
  salvar(atendimento: AtendimentoPayload, id?: number): Observable<unknown> {
    return id ? this.http.put(`${this.url}/${id}`, atendimento) : this.http.post(this.url, atendimento);
  }
  removerCorrida(id: number): Observable<unknown> { return this.http.delete(`${this.url}/${id}`); }
}
