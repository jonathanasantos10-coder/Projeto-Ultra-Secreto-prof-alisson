import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AtendimentoService } from '../../services/atendimento.service';
import { AtendimentoModel } from '../../models/atendimento.model';
import { DetalhesAtendimento, nomeSituacao } from '../detalhes-atendimento/detalhes-atendimento';
import { retornoApi } from '../../services/retorno-api';
@Component({
  selector: 'app-meus-atendimentos',
  imports: [CommonModule, RouterLink, DetalhesAtendimento],
  styleUrl: './meus-atendimentos.css',
  template: `<main class="pagina">
    <h1>Meus pedidos</h1>
    @if (confirmado) {
      <p class="aviso">Pedido confirmado e registrado com sucesso.</p>
    }
    @if (erro()) {
      <p class="erro" role="alert">{{ erro() }}</p>
      <a routerLink="/identificacao" [queryParams]="{ retorno: '/meus-atendimentos' }"
        >Identificar-me</a
      >
    }
    @if (carregando()) {
      <p>Consultando pedidos…</p>
    }
    @if (detalhe(); as a) {
      <app-detalhes-atendimento [atendimento]="a" /><a routerLink="/meus-atendimentos"
        >Ver todos os meus pedidos</a
      >
    } @else if (!carregando() && !erro()) {
      <section class="painel tabela-wrap">
        <table>
          <thead>
            <tr>
              <th>Número</th>
              <th>Data</th>
              <th>Situação</th>
              <th>Total</th>
              <th>Detalhes</th>
            </tr>
          </thead>
          <tbody>
            @for (a of atendimentos(); track a.idAtendimento) {
              <tr>
                <td>#{{ a.idAtendimento }}</td>
                <td>{{ a.dataAtendimento | date: 'dd/MM/yyyy' : 'UTC' }}</td>
                <td>{{ situacao(a.statusAtendimento) }}</td>
                <td>{{ a.valorTotal | currency: 'BRL' }}</td>
                <td><a [routerLink]="['/meus-atendimentos', a.idAtendimento]">Abrir pedido</a></td>
              </tr>
            } @empty {
              <tr>
                <td colspan="5">Você ainda não possui pedidos.</td>
              </tr>
            }
          </tbody>
        </table>
      </section>
    }
  </main>`,
})
export class MeusAtendimentos {
  atendimentos = signal<AtendimentoModel[]>([]);
  detalhe = signal<AtendimentoModel | null>(null);
  erro = signal('');
  carregando = signal(true);
  confirmado = false;
  situacao = nomeSituacao;
  constructor(api: AtendimentoService, route: ActivatedRoute) {
    route.paramMap.subscribe((p) => {
      this.confirmado = route.snapshot.queryParamMap.has('confirmado');
      this.erro.set('');
      this.carregando.set(true);
      const id = p.get('id');
      if (id)
        api.consultarMeu(Number(id)).subscribe({
          next: (d) => {
            this.detalhe.set(d);
            this.carregando.set(false);
          },
          error: (e) => {
            this.erro.set(retornoApi(e));
            this.carregando.set(false);
          },
        });
      else
        api.meus().subscribe({
          next: (d) => {
            this.detalhe.set(null);
            this.atendimentos.set(d);
            this.carregando.set(false);
          },
          error: (e) => {
            this.erro.set(retornoApi(e));
            this.carregando.set(false);
          },
        });
    });
  }
}
