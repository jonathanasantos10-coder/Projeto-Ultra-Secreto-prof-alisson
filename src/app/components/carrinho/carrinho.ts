import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CarrinhoService } from '../../services/carrinho.service';
import { IdentificacaoService } from '../../services/identificacao.service';
import { AtendimentoService } from '../../services/atendimento.service';
import { AlmoxarifadoService } from '../../services/almoxarifado.service';
import { ItemCatalogoModel } from '../../models/almoxarifado.model';
import { retornoApi } from '../../services/retorno-api';
@Component({
  selector: 'app-carrinho',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './carrinho.html',
  styleUrl: './carrinho.css',
})
export class Carrinho {
  erro = signal('');
  ocupado = signal(false);
  catalogo: ItemCatalogoModel[] = [];
  invalidos = signal<number[]>([]);
  constructor(
    public carrinho: CarrinhoService,
    public identificacao: IdentificacaoService,
    private atendimento: AtendimentoService,
    api: AlmoxarifadoService,
    private router: Router,
  ) {
    api
      .listarCatalogo()
      .subscribe({ next: (d) => (this.catalogo = d), error: (e) => this.erro.set(retornoApi(e)) });
  }
  alterar(id: number, q: number) {
    const i = this.catalogo.find((i) => i.iditem === id);
    const invalido =
      !Number.isInteger(q) || q < 1 || !i || (i.tipoItem === 'P' && q > (i.quantidadeEstoque || 0));
    this.invalidos.set([...this.invalidos().filter((x) => x !== id), ...(invalido ? [id] : [])]);
    if (invalido) {
      this.erro.set('Informe uma quantidade inteira positiva dentro do estoque disponível.');
      return;
    }
    this.erro.set('');
    this.carrinho.alterar(id, q);
  }
  remover(id: number) {
    this.carrinho.remover(id);
    this.invalidos.set(this.invalidos().filter((x) => x !== id));
    this.erro.set('');
  }
  confirmar() {
    if (this.ocupado() || this.invalidos().length || !this.carrinho.linhas().length) return;
    this.ocupado.set(true);
    this.erro.set('');
    this.atendimento
      .comprar(
        this.carrinho
          .linhas()
          .map((i) => ({ idItem: i.idItem, quantidadeItens: i.quantidadeItens })),
      )
      .subscribe({
        next: (d) => {
          this.carrinho.limpar();
          this.router.navigate(['/meus-atendimentos', d.idAtendimento], {
            queryParams: { confirmado: 1 },
          });
        },
        error: (e) => {
          this.erro.set(retornoApi(e));
          this.ocupado.set(false);
        },
      });
  }
}
