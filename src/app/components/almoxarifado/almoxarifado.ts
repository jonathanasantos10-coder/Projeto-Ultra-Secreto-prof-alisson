import { ConsultaId } from '../consulta-id/consulta-id';
import { Validacao } from '../validacao/validacao';
import { retornoApi } from '../../services/retorno-api';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AlmoxarifadoService } from '../../services/almoxarifado.service';
import {
  CategoriaModel,
  EntradaProdutoModel,
  ItemCatalogoModel,
  ProdutoModel,
} from '../../models/almoxarifado.model';

@Component({
  selector: 'app-almoxarifado',
  imports: [FormsModule, ConsultaId, Validacao],
  templateUrl: './almoxarifado.html',
  styleUrl: './almoxarifado.css',
})
export class Almoxarifado {
  aba = 'categorias';
  categorias: CategoriaModel[] = [];
  produtos: ProdutoModel[] = [];
  servicos: ItemCatalogoModel[] = [];
  entradas: EntradaProdutoModel[] = [];
  mensagem = '';
  erro = '';
  idEditando: number | null = null;

  categoria = '';
  idCategoria: number | null = null;
  item = '';
  descricaoItem = '';
  preco: number | null = 0;
  ativoProdutoServico = 'A';
  codigoPreco: number | null = 1;
  precoVenda: number | null = 0;
  unidade = 'UN';

  idItemEntrada: number | null = null;
  dataEntradaProduto = '';
  quantidadeEntrada: number | null = 1;
  unidadeEntrada = 'UN';
  valorUnitarioEntrada: number | null = 0;

  constructor(
    private api: AlmoxarifadoService,
    private cdr: ChangeDetectorRef,
  ) {
    this.carregar();
  }

  mudarAba(aba: string): void {
    this.aba = aba;
    this.limpar();
    this.carregar();
  }

  carregar(): void {
    this.erro = '';
    this.api.listarCategorias().subscribe({
      next: (dados) => {
        this.categorias = dados;
        this.cdr.detectChanges();
      },
      error: (erro) => this.mostrarErro(erro),
    });
    this.api.listarProdutos().subscribe({
      next: (dados) => {
        this.produtos = dados;
        this.cdr.detectChanges();
      },
      error: (erro) => this.mostrarErro(erro),
    });
    this.api.listarServicos().subscribe({
      next: (dados) => {
        this.servicos = dados;
        this.cdr.detectChanges();
      },
      error: (erro) => this.mostrarErro(erro),
    });
    this.api.listarEntradas().subscribe({
      next: (dados) => {
        this.entradas = dados;
        this.cdr.detectChanges();
      },
      error: (erro) => this.mostrarErro(erro),
    });
  }

  salvarCategoria(): void {
    this.api
      .salvarCategoria({ categoria: this.categoria }, this.idEditando ?? undefined)
      .subscribe({
        next: () => {
          this.mensagem = 'Categoria salva.';
          this.limpar(false);
          this.carregar();
          this.cdr.detectChanges();
        },
        error: (erro) => this.mostrarErro(erro),
      });
  }

  editarCategoria(categoria: CategoriaModel): void {
    this.aba = 'categorias';
    this.idEditando = categoria.idcategoria;
    this.categoria = categoria.categoria;
    this.cdr.detectChanges();
  }

  excluirCategoria(id: number): void {
    this.api.excluirCategoria(id).subscribe({
      next: () => {
        this.mensagem = 'Categoria excluída.';
        this.carregar();
        this.cdr.detectChanges();
      },
      error: (erro) => this.mostrarErro(erro),
    });
  }

  salvarProduto(): void {
    const dados = {
      idCategoria: Number(this.idCategoria ?? 0),
      item: this.item,
      descricaoItem: this.descricaoItem,
      preco: Number(this.preco ?? 0),
      ativoProdutoServico: this.ativoProdutoServico,
      codigoPreco: Number(this.codigoPreco ?? 0),
      precoVenda: Number(this.precoVenda ?? 0),
      unidade: this.unidade,
    };
    this.api.salvarProduto(dados, this.idEditando ?? undefined).subscribe({
      next: () => {
        this.mensagem = 'Produto salvo.';
        this.limpar(false);
        this.carregar();
        this.cdr.detectChanges();
      },
      error: (erro) => this.mostrarErro(erro),
    });
  }

  editarProduto(produto: ProdutoModel): void {
    this.aba = 'produtos';
    this.idEditando = produto.iditem;
    this.idCategoria = produto.iditemNavigation?.idcategoria ?? null;
    this.item = produto.iditemNavigation?.item1 ?? '';
    this.descricaoItem = produto.iditemNavigation?.descricaoItem ?? '';
    this.preco = Number(produto.iditemNavigation?.preco ?? 0);
    this.ativoProdutoServico = produto.iditemNavigation?.ativoProdutoServico ?? 'A';
    this.codigoPreco = produto.codigoPreco ?? 0;
    this.precoVenda = Number(produto.precoVenda ?? 0);
    this.unidade = produto.unidade ?? 'UN';
    this.cdr.detectChanges();
  }

  excluirProduto(id: number): void {
    this.api.excluirProduto(id).subscribe({
      next: () => {
        this.mensagem = 'Produto excluído.';
        this.carregar();
        this.cdr.detectChanges();
      },
      error: (erro) => this.mostrarErro(erro),
    });
  }

  salvarServico(): void {
    const dados = {
      idCategoria: Number(this.idCategoria ?? 0),
      item: this.item,
      descricaoItem: this.descricaoItem,
      preco: Number(this.preco ?? 0),
      ativoProdutoServico: this.ativoProdutoServico,
      codigoPreco: 1,
      precoVenda: 0,
      unidade: 'UN',
    };
    this.api.salvarServico(dados, this.idEditando ?? undefined).subscribe({
      next: () => {
        this.mensagem = 'Serviço salvo.';
        this.limpar(false);
        this.carregar();
        this.cdr.detectChanges();
      },
      error: (erro) => this.mostrarErro(erro),
    });
  }

  editarServico(servico: ItemCatalogoModel): void {
    this.aba = 'servicos';
    this.idEditando = servico.iditem;
    this.idCategoria = servico.idcategoria;
    this.item = servico.item1;
    this.descricaoItem = servico.descricaoItem ?? '';
    this.preco = Number(servico.preco ?? 0);
    this.ativoProdutoServico = servico.ativoProdutoServico ?? 'A';
    this.cdr.detectChanges();
  }

  excluirServico(id: number): void {
    this.api.excluirServico(id).subscribe({
      next: () => {
        this.mensagem = 'Serviço excluído.';
        this.carregar();
        this.cdr.detectChanges();
      },
      error: (erro) => this.mostrarErro(erro),
    });
  }

  salvarEntrada(): void {
    const dados = {
      idItem: Number(this.idItemEntrada ?? 0),
      dataEntradaProduto: this.dataEntradaProduto,
      quantidadeEntrada: Number(this.quantidadeEntrada ?? 0),
      unidade: this.unidadeEntrada,
      valorUnitarioEntrada: Number(this.valorUnitarioEntrada ?? 0),
    };
    this.api.salvarEntrada(dados).subscribe({
      next: () => {
        this.mensagem = 'Entrada registrada.';
        this.limpar(false);
        this.carregar();
        this.cdr.detectChanges();
      },
      error: (erro) => this.mostrarErro(erro),
    });
  }

  estornarEntrada(id: number): void {
    this.api.estornarEntrada(id).subscribe({
      next: () => {
        this.mensagem = 'Entrada estornada. O saldo do estoque foi atualizado.';
        this.carregar();
        this.cdr.detectChanges();
      },
      error: (erro) => this.mostrarErro(erro),
    });
  }

  limpar(apagarMensagens = true): void {
    this.idEditando = null;
    this.categoria = '';
    this.idCategoria = null;
    this.item = '';
    this.descricaoItem = '';
    this.preco = 0;
    this.ativoProdutoServico = 'A';
    this.codigoPreco = 1;
    this.precoVenda = 0;
    this.unidade = 'UN';
    this.idItemEntrada = null;
    this.dataEntradaProduto = '';
    this.quantidadeEntrada = 1;
    this.unidadeEntrada = 'UN';
    this.valorUnitarioEntrada = 0;
    if (apagarMensagens) {
      this.mensagem = '';
      this.erro = '';
    }
  }

  private mostrarErro(erro: any): void {
    this.erro = retornoApi(erro);
    this.cdr.detectChanges();
  }
  consultar(id: number) {
    this.erro = '';
    if (this.aba === 'categorias')
      this.api.consultarCategoria(id).subscribe({
        next: (d) => {
          this.categorias = [d];
          this.cdr.detectChanges();
        },
        error: (e) => {
          this.categorias = [];
          this.mostrarErro(e);
        },
      });
    if (this.aba === 'produtos')
      this.api.consultarProduto(id).subscribe({
        next: (d) => {
          this.produtos = [d];
          this.cdr.detectChanges();
        },
        error: (e) => {
          this.produtos = [];
          this.mostrarErro(e);
        },
      });
    if (this.aba === 'servicos')
      this.api.consultarServico(id).subscribe({
        next: (d) => {
          this.servicos = [d];
          this.cdr.detectChanges();
        },
        error: (e) => {
          this.servicos = [];
          this.mostrarErro(e);
        },
      });
    if (this.aba === 'entradas')
      this.api.consultarEntrada(id).subscribe({
        next: (d) => {
          this.entradas = [d];
          this.cdr.detectChanges();
        },
        error: (e) => {
          this.entradas = [];
          this.mostrarErro(e);
        },
      });
  }
  desativarProduto(produto: ProdutoModel) {
    this.editarProduto(produto);
    this.ativoProdutoServico = 'I';
    this.salvarProduto();
  }
  desativarServico(servico: ItemCatalogoModel) {
    this.editarServico(servico);
    this.ativoProdutoServico = 'I';
    this.salvarServico();
  }
}
