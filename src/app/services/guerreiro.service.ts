import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GuerreiroModel, GuerreiroPayload } from '../models/guerreiro.model';
import { API_URL } from './api-config';

@Injectable({ providedIn: 'root' })
export class GuerreiroService {
  private readonly url = `${API_URL}/PessoaEndereco`;

  constructor(private http: HttpClient) {}

  listar(): Observable<GuerreiroModel[]> {
    return this.http.get<GuerreiroModel[]>(this.url);
  }

  salvar(dados: GuerreiroPayload, id?: number): Observable<unknown> {
    return id ? this.http.put(`${this.url}/${id}`, dados) : this.http.post(this.url, dados);
  }

  excluir(id: number): Observable<unknown> {
    return this.http.delete(`${this.url}/${id}`);
  }
}
