import { Injectable, computed, signal } from '@angular/core';
import { ItemCatalogoModel } from '../models/almoxarifado.model';
export interface LinhaCarrinho {
  idItem: number;
  item1: string;
  tipoItem: string;
  quantidadeItens: number;
  preco: number;
}
@Injectable({ providedIn: 'root' })
export class CarrinhoService {
  linhas = signal<LinhaCarrinho[]>([]);
  total = computed(() => this.linhas().reduce((s, i) => s + i.preco * i.quantidadeItens, 0));
  quantidade = computed(() => this.linhas().reduce((s, i) => s + i.quantidadeItens, 0));
  constructor() {
    if (typeof localStorage === 'undefined') return;
    try {
      const d = JSON.parse(localStorage.getItem('intendencia.carrinho') || '[]');
      if (Array.isArray(d))
        this.linhas.set(
          d.filter(
            (i) =>
              i &&
              Number.isInteger(i.idItem) &&
              i.idItem > 0 &&
              Number.isInteger(i.quantidadeItens) &&
              i.quantidadeItens > 0 &&
              Number.isFinite(i.preco) &&
              i.preco >= 0,
          ),
        );
    } catch {
      this.linhas.set([]);
    }
  }
  adicionar(item: ItemCatalogoModel): string {
    const linhas = structuredClone(this.linhas());
    const anterior = linhas.find((i) => i.idItem === item.iditem);
    const quantidade = (anterior?.quantidadeItens || 0) + 1;
    if (item.tipoItem === 'P' && quantidade > (item.quantidadeEstoque || 0))
      return 'Quantidade maior que o estoque disponível.';
    if (anterior) anterior.quantidadeItens = quantidade;
    else
      linhas.push({
        idItem: item.iditem,
        item1: item.item1,
        tipoItem: item.tipoItem,
        quantidadeItens: 1,
        preco: item.precoVenda ?? item.preco,
      });
    this.salvar(linhas);
    return '';
  }
  alterar(id: number, quantidadeItens: number) {
    this.salvar(this.linhas().map((i) => (i.idItem === id ? { ...i, quantidadeItens } : i)));
  }
  remover(id: number) {
    this.salvar(this.linhas().filter((i) => i.idItem !== id));
  }
  limpar() {
    this.salvar([]);
  }
  private salvar(dados: LinhaCarrinho[]) {
    this.linhas.set(dados);
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('intendencia.carrinho', JSON.stringify(dados));
      }
    } catch {
      /* Mantém em memória. */
    }
  }
}
