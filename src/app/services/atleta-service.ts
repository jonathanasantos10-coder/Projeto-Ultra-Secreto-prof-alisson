import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FuncionarioM, FuncionarioPayload, PessoaM, PessoaPayload } from '../Models/atletaModel';
import { API_URL } from './api-config';

@Injectable({ providedIn: 'root' })
export class AtletaService {
  private readonly pessoasUrl = `${API_URL}/PessoaEndereco`;
  private readonly funcionariosUrl = `${API_URL}/Funcionario`;

  constructor(private http: HttpClient) {}

  list(): Observable<PessoaM[]> { return this.http.get<PessoaM[]>(this.pessoasUrl); }
  listFuncionarios(): Observable<FuncionarioM[]> { return this.http.get<FuncionarioM[]>(this.funcionariosUrl); }
  salvarPessoa(pessoa: PessoaPayload, id?: number): Observable<unknown> {
    return id ? this.http.put(`${this.pessoasUrl}/${id}`, pessoa) : this.http.post(this.pessoasUrl, pessoa);
  }
  salvarFuncionario(funcionario: FuncionarioPayload, id?: number): Observable<unknown> {
    return id ? this.http.put(`${this.funcionariosUrl}/${id}`, funcionario) : this.http.post(this.funcionariosUrl, funcionario);
  }
  removerAtleta(id: number): Observable<unknown> { return this.http.delete(`${this.pessoasUrl}/${id}`); }
  removerFuncionario(id: number): Observable<unknown> { return this.http.delete(`${this.funcionariosUrl}/${id}`); }
}
