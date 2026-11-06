import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  CategoriaModel,
  CategoriaPayload,
  EntradaProdutoModel,
  EntradaProdutoPayload,
  EstoqueModel,
  ItemCatalogoModel,
  ItemCatalogoPayload,
  ProdutoModel,
} from '../models/almoxarifado.model';
import { API_URL } from './api-config';

@Injectable({ providedIn: 'root' })
export class AlmoxarifadoService {
  // O backend usa [Route("api")], portanto estes segmentos são diretos em /api.
  private readonly categoriasUrl = `${API_URL}/Categorium`;
  private readonly catalogoUrl = `${API_URL}/Catalogo`;
  private readonly produtosUrl = `${API_URL}/ProdutoItem`;
  private readonly servicosUrl = `${API_URL}/Itens`;
  private readonly estoqueUrl = `${API_URL}/Estoque`;
  private readonly entradasUrl = `${API_URL}/EntradaProduto`;
  private readonly imagensUrl = `${API_URL}/ItemImagem`;

  constructor(private readonly http: HttpClient) {}

  listarCategorias(): Observable<CategoriaModel[]> {
    return this.http.get<CategoriaModel[]>(this.categoriasUrl);
  }

  consultarCategoria(id: number): Observable<CategoriaModel> {
    return this.http.get<CategoriaModel>(`${this.categoriasUrl}/${id}`);
  }

  salvarCategoria(dados: CategoriaPayload, id?: number): Observable<unknown> {
    return id == null
      ? this.http.post(this.categoriasUrl, dados)
      : this.http.put(`${this.categoriasUrl}/${id}`, dados);
  }

  excluirCategoria(id: number): Observable<void> {
    return this.http.delete<void>(`${this.categoriasUrl}/${id}`);
  }

  listarProdutos(): Observable<ProdutoModel[]> {
    return this.http.get<ProdutoModel[]>(this.produtosUrl);
  }

  consultarProduto(id: number): Observable<ProdutoModel> {
    return this.http.get<ProdutoModel>(`${this.produtosUrl}/${id}`);
  }

  salvarProduto(dados: ItemCatalogoPayload, id?: number): Observable<unknown> {
    return id == null
      ? this.http.post(this.produtosUrl, dados)
      : this.http.put(`${this.produtosUrl}/${id}`, dados);
  }

  excluirProduto(id: number): Observable<void> {
    return this.http.delete<void>(`${this.produtosUrl}/${id}`);
  }

  imagemUrl(iditem: number): string {
    return `${this.imagensUrl}/${iditem}`;
  }

  salvarImagem(iditem: number, arquivo: File, descricao: string, possuiImagem: boolean): Observable<void> {
    const dados = new FormData();
    dados.append('Descricao', descricao || 'Imagem do produto');
    dados.append('Arquivo', arquivo, arquivo.name);
    const url = `${this.imagensUrl}/${iditem}`;
    return possuiImagem ? this.http.put<void>(url, dados) : this.http.post<void>(url, dados);
  }

  listarServicos(): Observable<ItemCatalogoModel[]> {
    return this.http.get<ItemCatalogoModel[]>(this.servicosUrl);
  }

  consultarServico(id: number): Observable<ItemCatalogoModel> {
    return this.http.get<ItemCatalogoModel>(`${this.servicosUrl}/${id}`);
  }

  salvarServico(dados: ItemCatalogoPayload, id?: number): Observable<unknown> {
    return id == null
      ? this.http.post(this.servicosUrl, dados)
      : this.http.put(`${this.servicosUrl}/${id}`, dados);
  }

  excluirServico(id: number): Observable<void> {
    return this.http.delete<void>(`${this.servicosUrl}/${id}`);
  }

  listarEntradas(): Observable<EntradaProdutoModel[]> {
    return this.http.get<EntradaProdutoModel[]>(this.entradasUrl);
  }

  consultarEntrada(id: number): Observable<EntradaProdutoModel> {
    return this.http.get<EntradaProdutoModel>(`${this.entradasUrl}/${id}`);
  }

  salvarEntrada(dados: EntradaProdutoPayload): Observable<{ identradaProduto: number }> {
    return this.http.post<{ identradaProduto: number }>(this.entradasUrl, dados);
  }

  estornarEntrada(id: number): Observable<void> {
    return this.http.delete<void>(`${this.entradasUrl}/${id}`);
  }

  listarCatalogo(
    nome = '',
    idcategoria: number | null = null,
    tipo: string = '',
  ): Observable<ItemCatalogoModel[]> {
    let params = new HttpParams();
    if (nome.trim()) params = params.set('nome', nome.trim());
    if (idcategoria != null) params = params.set('idcategoria', idcategoria);
    if (tipo) params = params.set('tipo', tipo);
    return this.http.get<ItemCatalogoModel[]>(this.catalogoUrl, { params });
  }

  consultarCatalogo(id: number): Observable<ItemCatalogoModel> {
    return this.http.get<ItemCatalogoModel>(`${this.catalogoUrl}/${id}`);
  }

  listarEstoque(): Observable<EstoqueModel[]> {
    return this.http.get<EstoqueModel[]>(this.estoqueUrl);
  }

  consultarEstoque(id: number): Observable<EstoqueModel> {
    return this.http.get<EstoqueModel>(`${this.estoqueUrl}/${id}`);
  }
}
