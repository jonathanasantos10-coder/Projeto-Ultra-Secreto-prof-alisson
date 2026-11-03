import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IntendenciaModel, IntendenciaPayload } from '../models/intendencia.model';
import { API_URL } from './api-config';

@Injectable({ providedIn: 'root' })
export class IntendenciaService {
  // CadastroMilitarController: GET/POST/PUT/DELETE Funcionario.
  private readonly url = `${API_URL}/Funcionario`;

  constructor(private readonly http: HttpClient) {}

  listar(): Observable<IntendenciaModel[]> {
    return this.http.get<IntendenciaModel[]>(this.url);
  }

  consultar(id: number): Observable<IntendenciaModel> {
    return this.http.get<IntendenciaModel>(`${this.url}/${id}`);
  }

  salvar(dados: IntendenciaPayload, id?: number): Observable<unknown> {
    return id == null
      ? this.http.post<IntendenciaModel>(this.url, dados)
      : this.http.put<void>(`${this.url}/${id}`, dados);
  }

  excluir(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}
