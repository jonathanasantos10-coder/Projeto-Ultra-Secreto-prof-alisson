import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GuerreiroModel, GuerreiroPayload } from '../models/guerreiro.model';
import { API_URL } from './api-config';

@Injectable({ providedIn: 'root' })
export class GuerreiroService {
  // CadastroMilitarController: GET/POST/PUT/DELETE PessoaEndereco.
  private readonly url = `${API_URL}/PessoaEndereco`;

  constructor(private readonly http: HttpClient) {}

  listar(): Observable<GuerreiroModel[]> {
    return this.http.get<GuerreiroModel[]>(this.url);
  }

  consultar(id: number): Observable<GuerreiroModel> {
    return this.http.get<GuerreiroModel>(`${this.url}/${id}`);
  }

  salvar(dados: GuerreiroPayload, id?: number): Observable<unknown> {
    return id == null
      ? this.http.post<GuerreiroModel>(this.url, dados)
      : this.http.put<void>(`${this.url}/${id}`, dados);
  }

  excluir(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}
