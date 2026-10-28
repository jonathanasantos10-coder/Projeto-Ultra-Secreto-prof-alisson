import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CategoriaModel, EntradaProdutoModel, ItemCatalogoModel, ProdutoModel } from '../models/almoxarifado.model';
import { API_URL } from './api-config';

@Injectable({ providedIn: 'root' })
export class AlmoxarifadoService {
  private readonly categoriasUrl = `${API_URL}/Categorium`;
  private readonly produtosUrl = `${API_URL}/ProdutoItem`;
  private readonly servicosUrl = `${API_URL}/Itens`;
  private readonly entradasUrl = `${API_URL}/EntradaProduto`;

  constructor(private http: HttpClient) {}

  listarCategorias(): Observable<CategoriaModel[]> { return this.http.get<CategoriaModel[]>(this.categoriasUrl); }
  salvarCategoria(categoria: Partial<CategoriaModel>, id?: number): Observable<unknown> {
    return id ? this.http.put(`${this.categoriasUrl}/${id}`, { ...categoria, idcategoria: id }) : this.http.post(this.categoriasUrl, categoria);
  }
  excluirCategoria(id: number): Observable<unknown> { return this.http.delete(`${this.categoriasUrl}/${id}`); }

  listarProdutos(): Observable<ProdutoModel[]> { return this.http.get<ProdutoModel[]>(this.produtosUrl); }
  salvarProduto(dados: unknown, id?: number): Observable<unknown> {
    return id ? this.http.put(`${this.produtosUrl}/${id}`, dados) : this.http.post(this.produtosUrl, dados);
  }
  excluirProduto(id: number): Observable<unknown> { return this.http.delete(`${this.produtosUrl}/${id}`); }

  listarServicos(): Observable<ItemCatalogoModel[]> { return this.http.get<ItemCatalogoModel[]>(this.servicosUrl); }
  salvarServico(dados: unknown, id?: number): Observable<unknown> {
    return id ? this.http.put(`${this.servicosUrl}/${id}`, dados) : this.http.post(this.servicosUrl, dados);
  }
  excluirServico(id: number): Observable<unknown> { return this.http.delete(`${this.servicosUrl}/${id}`); }

  listarEntradas(): Observable<EntradaProdutoModel[]> { return this.http.get<EntradaProdutoModel[]>(this.entradasUrl); }
  salvarEntrada(dados: unknown): Observable<unknown> { return this.http.post(this.entradasUrl, dados); }
  excluirEntrada(id: number): Observable<unknown> { return this.http.delete(`${this.entradasUrl}/${id}`); }
}
