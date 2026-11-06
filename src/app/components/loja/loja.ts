import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AlmoxarifadoService } from '../../services/almoxarifado.service';
import { CarrinhoService } from '../../services/carrinho.service';
import { ItemCatalogoModel, CategoriaModel } from '../../models/almoxarifado.model';
import { retornoApi } from '../../services/retorno-api';
@Component({
  selector: 'app-loja',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './loja.html',
  styleUrl: './loja.css',
})
export class Loja {
  itens = signal<ItemCatalogoModel[]>([]);
  categorias = signal<CategoriaModel[]>([]);
  detalhe = signal<ItemCatalogoModel | null>(null);
  erro = signal('');
  mensagem = signal('');
  carregando = signal(true);
  nome = '';
  tipo = '';
  idcategoria: number | null = null;
  constructor(
    private api: AlmoxarifadoService,
    public carrinho: CarrinhoService,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    api
      .listarCategorias()
      .subscribe({
        next: (d) => this.categorias.set(d),
        error: (e) => this.erro.set(retornoApi(e)),
      });
    route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.carregando.set(true);
        api.consultarCatalogo(Number(id)).subscribe({
          next: (d) => {
            this.detalhe.set(d);
            this.carregando.set(false);
          },
          error: (e) => {
            this.erro.set(retornoApi(e));
            this.carregando.set(false);
          },
        });
      }
    });
    route.queryParamMap.subscribe((q) => {
      if (!route.snapshot.paramMap.has('id')) {
        this.nome = q.get('nome') || '';
        this.tipo = q.get('tipo') || '';
        this.idcategoria = Number(q.get('idcategoria')) || null;
        this.carregar();
      }
    });
  }
  carregar() {
    this.carregando.set(true);
    this.erro.set('');
    this.api.listarCatalogo(this.nome, this.idcategoria, this.tipo).subscribe({
      next: (d) => {
        this.itens.set(d);
        this.carregando.set(false);
      },
      error: (e) => {
        this.erro.set(retornoApi(e));
        this.carregando.set(false);
      },
    });
  }
  pesquisar() {
    this.router.navigate(['/loja'], {
      queryParams: {
        nome: this.nome || null,
        tipo: this.tipo || null,
        idcategoria: this.idcategoria,
      },
    });
  }
  imagemUrl(iditem: number): string {
    return this.api.imagemUrl(iditem);
  }

  adicionar(item: ItemCatalogoModel) {
    const erro = this.carrinho.adicionar(item);
    this.erro.set(erro);
    this.mensagem.set(erro ? '' : 'Item adicionado ao carrinho.');
  }
}
