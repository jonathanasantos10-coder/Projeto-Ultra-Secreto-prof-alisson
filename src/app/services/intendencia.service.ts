import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IntendenciaModel, IntendenciaPayload } from '../models/intendencia.model';
import { API_URL } from './api-config';

@Injectable({ providedIn: 'root' })
export class IntendenciaService {
  private readonly url = `${API_URL}/Funcionario`;

  constructor(private http: HttpClient) {}

  listar(): Observable<IntendenciaModel[]> {
    return this.http.get<IntendenciaModel[]>(this.url);
  }

  salvar(dados: IntendenciaPayload, id?: number): Observable<unknown> {
    return id ? this.http.put(`${this.url}/${id}`, dados) : this.http.post(this.url, dados);
  }

  excluir(id: number): Observable<unknown> {
    return this.http.delete(`${this.url}/${id}`);
  }
}
