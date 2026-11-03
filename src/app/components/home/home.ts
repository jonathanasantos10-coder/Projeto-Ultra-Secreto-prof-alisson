import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { GuerreiroService } from '../../services/guerreiro.service';
import { IntendenciaService } from '../../services/intendencia.service';
import { AlmoxarifadoService } from '../../services/almoxarifado.service';
import { AtendimentoService } from '../../services/atendimento.service';
import { retornoApi } from '../../services/retorno-api';
@Component({
  selector: 'app-home',
  imports: [RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  erro = signal('');
  carregando = signal(true);
  resumo = signal<{ nome: string; valor: number; rota: string }[]>([]);
  constructor(
    g: GuerreiroService,
    i: IntendenciaService,
    a: AlmoxarifadoService,
    p: AtendimentoService,
  ) {
    forkJoin({
      g: g.listar(),
      i: i.listar(),
      c: a.listarCategorias(),
      pr: a.listarProdutos(),
      s: a.listarServicos(),
      e: a.listarEstoque(),
      p: p.listar(),
    }).subscribe({
      next: (d) => {
        this.resumo.set([
          { nome: 'Guerreiros', valor: d.g.length, rota: '/guerreiros' },
          { nome: 'Intendência', valor: d.i.length, rota: '/intendencia' },
          { nome: 'Categorias', valor: d.c.length, rota: '/almoxarifado' },
          { nome: 'Produtos', valor: d.pr.length, rota: '/almoxarifado' },
          { nome: 'Serviços', valor: d.s.length, rota: '/almoxarifado' },
          { nome: 'Pedidos', valor: d.p.length, rota: '/atendimentos' },
          {
            nome: 'Em aberto',
            valor: d.p.filter((a) => a.statusAtendimento === 'A').length,
            rota: '/atendimentos',
          },
          {
            nome: 'Unidades em estoque',
            valor: d.e.reduce((s, i) => s + i.quantidadeEstoque, 0),
            rota: '/estoque',
          },
        ]);
        this.carregando.set(false);
      },
      error: (e) => {
        this.erro.set(retornoApi(e));
        this.carregando.set(false);
      },
    });
  }
}
