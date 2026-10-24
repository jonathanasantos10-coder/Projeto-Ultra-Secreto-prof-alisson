import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CatalogoService } from '../../services/catalogo-service';
import { CategoriaM, EntradaM, ItemM, ProdutoM } from '../../Models/catalogoModel';

@Component({ selector: 'app-gestao', imports: [FormsModule], templateUrl: './gestao.html', styleUrl: './gestao.css' })
export class Gestao {
  aba = 'categorias';
  categorias: CategoriaM[] = [];
  produtos: ProdutoM[] = [];
  servicos: ItemM[] = [];
  entradas: EntradaM[] = [];
  mensagem = '';
  erro = '';
  idEditando: number | null = null;

  categoria = '';
  idCategoria: number | null = null;
  item = '';
  descricaoItem = '';
  preco: number | null = 0;
  ativoProdutoServico = 'S';
  codigoPreco: number | null = 1;
  precoVenda: number | null = 0;
  unidade = 'UN';

  idItemEntrada: number | null = null;
  dataEntradaProduto = '';
  quantidadeEntrada: number | null = 1;
  unidadeEntrada = 'UN';
  valorUnitarioEntrada: number | null = 0;

  constructor(private api: CatalogoService) { this.carregar(); }

  mudarAba(aba: string): void { this.aba = aba; this.limpar(); this.carregar(); }

  carregar(): void {
    this.erro = '';
    this.api.categorias().subscribe({ next: d => this.categorias = d, error: e => this.mostrarErro(e) });
    this.api.produtos().subscribe({ next: d => this.produtos = d, error: e => this.mostrarErro(e) });
    this.api.servicos().subscribe({ next: d => this.servicos = d, error: e => this.mostrarErro(e) });
    this.api.entradas().subscribe({ next: d => this.entradas = d, error: e => this.mostrarErro(e) });
  }

  salvarCategoria(): void {
    this.api.salvarCategoria({ categoria: this.categoria }, this.idEditando ?? undefined).subscribe({
      next: () => { this.mensagem = 'Categoria salva.'; this.limpar(false); this.carregar(); }, error: e => this.mostrarErro(e)
    });
  }
  editarCategoria(c: CategoriaM): void { this.aba = 'categorias'; this.idEditando = c.idcategoria; this.categoria = c.categoria; }
  excluirCategoria(id: number): void { this.api.excluirCategoria(id).subscribe({ next: () => { this.mensagem = 'Categoria excluída.'; this.carregar(); }, error: e => this.mostrarErro(e) }); }

  salvarProduto(): void {
    const dados = { idCategoria: Number(this.idCategoria ?? 0), item: this.item, descricaoItem: this.descricaoItem, preco: Number(this.preco ?? 0), tipoItem: 'P', ativoProdutoServico: this.ativoProdutoServico, codigoPreco: Number(this.codigoPreco ?? 0), precoVenda: Number(this.precoVenda ?? 0), unidade: this.unidade };
    this.api.salvarProduto(dados, this.idEditando ?? undefined).subscribe({ next: () => { this.mensagem = 'Produto salvo.'; this.limpar(false); this.carregar(); }, error: e => this.mostrarErro(e) });
  }
  editarProduto(p: ProdutoM): void {
    this.aba = 'produtos'; this.idEditando = p.iditem; this.idCategoria = p.iditemNavigation?.idcategoria ?? null; this.item = p.iditemNavigation?.item1 ?? ''; this.descricaoItem = p.iditemNavigation?.descricaoItem ?? ''; this.preco = Number(p.iditemNavigation?.preco ?? 0); this.ativoProdutoServico = p.iditemNavigation?.ativoProdutoServico ?? 'S'; this.codigoPreco = p.codigoPreco ?? 0; this.precoVenda = Number(p.precoVenda ?? 0); this.unidade = p.unidade ?? 'UN';
  }
  excluirProduto(id: number): void { this.api.excluirProduto(id).subscribe({ next: () => { this.mensagem = 'Produto excluído.'; this.carregar(); }, error: e => this.mostrarErro(e) }); }

  salvarServico(): void {
    const dados = { idCategoria: Number(this.idCategoria ?? 0), item: this.item, descricaoItem: this.descricaoItem, preco: Number(this.preco ?? 0), ativoProdutoServico: this.ativoProdutoServico };
    this.api.salvarServico(dados, this.idEditando ?? undefined).subscribe({ next: () => { this.mensagem = 'Serviço salvo.'; this.limpar(false); this.carregar(); }, error: e => this.mostrarErro(e) });
  }
  editarServico(s: ItemM): void { this.aba = 'servicos'; this.idEditando = s.iditem; this.idCategoria = s.idcategoria; this.item = s.item1; this.descricaoItem = s.descricaoItem ?? ''; this.preco = Number(s.preco ?? 0); this.ativoProdutoServico = s.ativoProdutoServico ?? 'S'; }
  excluirServico(id: number): void { this.api.excluirServico(id).subscribe({ next: () => { this.mensagem = 'Serviço excluído.'; this.carregar(); }, error: e => this.mostrarErro(e) }); }

  salvarEntrada(): void {
    const dados = { idItem: Number(this.idItemEntrada ?? 0), dataEntradaProduto: this.dataEntradaProduto, quantidadeEntrada: Number(this.quantidadeEntrada ?? 0), unidade: this.unidadeEntrada, valorUnitarioEntrada: Number(this.valorUnitarioEntrada ?? 0) };
    this.api.salvarEntrada(dados).subscribe({ next: () => { this.mensagem = 'Entrada registrada.'; this.limpar(false); this.carregar(); }, error: e => this.mostrarErro(e) });
  }
  excluirEntrada(id: number): void { this.api.excluirEntrada(id).subscribe({ next: () => { this.mensagem = 'Entrada excluída.'; this.carregar(); }, error: e => this.mostrarErro(e) }); }

  limpar(apagarMensagens = true): void {
    this.idEditando = null; this.categoria = ''; this.idCategoria = null; this.item = ''; this.descricaoItem = ''; this.preco = 0; this.ativoProdutoServico = 'S'; this.codigoPreco = 1; this.precoVenda = 0; this.unidade = 'UN';
    this.idItemEntrada = null; this.dataEntradaProduto = ''; this.quantidadeEntrada = 1; this.unidadeEntrada = 'UN'; this.valorUnitarioEntrada = 0;
    if (apagarMensagens) { this.mensagem = ''; this.erro = ''; }
  }
  private mostrarErro(erro: any): void { this.erro = erro?.error?.mensagem ?? erro?.error?.title ?? 'Não foi possível comunicar com a API. Confira se o backend está em execução.'; }
}
