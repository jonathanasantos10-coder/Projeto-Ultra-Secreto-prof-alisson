import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CategoriaM, EntradaM, ItemM, ProdutoM } from '../Models/catalogoModel';
import { API_URL } from './api-config';

@Injectable({ providedIn: 'root' })
export class CatalogoService {
  private readonly categoriasUrl = `${API_URL}/Categorium`;
  private readonly produtosUrl = `${API_URL}/ProdutoItem`;
  private readonly servicosUrl = `${API_URL}/Itens`;
  private readonly entradasUrl = `${API_URL}/EntradaProduto`;
  constructor(private http: HttpClient) {}

  categorias(): Observable<CategoriaM[]> { return this.http.get<CategoriaM[]>(this.categoriasUrl); }
  salvarCategoria(categoria: Partial<CategoriaM>, id?: number): Observable<unknown> {
    return id ? this.http.put(`${this.categoriasUrl}/${id}`, { ...categoria, idcategoria: id }) : this.http.post(this.categoriasUrl, categoria);
  }
  excluirCategoria(id: number): Observable<unknown> { return this.http.delete(`${this.categoriasUrl}/${id}`); }

  produtos(): Observable<ProdutoM[]> { return this.http.get<ProdutoM[]>(this.produtosUrl); }
  salvarProduto(dados: unknown, id?: number): Observable<unknown> {
    return id ? this.http.put(`${this.produtosUrl}/${id}`, dados) : this.http.post(this.produtosUrl, dados);
  }
  excluirProduto(id: number): Observable<unknown> { return this.http.delete(`${this.produtosUrl}/${id}`); }

  servicos(): Observable<ItemM[]> { return this.http.get<ItemM[]>(this.servicosUrl); }
  salvarServico(dados: unknown, id?: number): Observable<unknown> {
    return id ? this.http.put(`${this.servicosUrl}/${id}`, dados) : this.http.post(this.servicosUrl, dados);
  }
  excluirServico(id: number): Observable<unknown> { return this.http.delete(`${this.servicosUrl}/${id}`); }

  entradas(): Observable<EntradaM[]> { return this.http.get<EntradaM[]>(this.entradasUrl); }
  salvarEntrada(dados: unknown): Observable<unknown> { return this.http.post(this.entradasUrl, dados); }
  excluirEntrada(id: number): Observable<unknown> { return this.http.delete(`${this.entradasUrl}/${id}`); }
}
