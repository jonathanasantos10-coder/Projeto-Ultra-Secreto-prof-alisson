import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { IdentificacaoService } from '../../services/identificacao.service';
import { retornoApi } from '../../services/retorno-api';
import { Validacao } from '../validacao/validacao';
@Component({
  selector: 'app-identificacao',
  imports: [FormsModule, RouterLink, Validacao],
  styleUrl: './identificacao.css',
  template: `<main class="pagina">
    <section class="painel estreito">
      <p class="eyebrow">Acesso ao sistema</p>
      <h1>Identificação</h1>
      <p>
        Informe o CPF e o nascimento do cadastro. Integrantes da Intendência têm acesso
        administrativo.
      </p>
      @if (erro()) {
        <p class="erro" role="alert">{{ erro() }}</p>
      }
      <form #form="ngForm" (ngSubmit)="form.valid && entrar()">
        <div class="campo">
          <label for="cpf">CPF</label
          ><input
            id="cpf"
            name="CPF"
            type="number"
            [(ngModel)]="cpf"
            required
            min="1"
            max="99999999999"
          />
        </div>
        <div class="campo">
          <label for="nascimento">Data de nascimento</label
          ><input
            id="nascimento"
            name="Nascimento"
            type="date"
            [(ngModel)]="dataNascimento"
            required
          />
        </div>
        <app-validacao [form]="form" />
        <div class="botoes">
          <button [disabled]="ocupado()">Entrar</button
          ><a class="botao secundario" routerLink="/cadastro">Cadastrar Guerreiro</a
          ><a routerLink="/loja">Voltar ao catálogo</a>
        </div>
      </form>
    </section>
  </main>`,
})
export class Identificacao {
  cpf: number | null = null;
  dataNascimento = '';
  erro = signal('');
  ocupado = signal(false);
  constructor(
    private api: IdentificacaoService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}
  entrar() {
    this.ocupado.set(true);
    this.erro.set('');
    this.api.entrar(Number(this.cpf), this.dataNascimento).subscribe({
      next: (d) => {
        this.ocupado.set(false);
        const retorno =
          this.route.snapshot.queryParamMap.get('retorno') || (d.intendencia ? '/home' : '/loja');
        if (
          !d.intendencia &&
          !['/loja', '/carrinho', '/meus-atendimentos'].some(
            (p) => retorno === p || retorno.startsWith(p + '/'),
          )
        ) {
          this.erro.set('Este cadastro não pertence à Intendência. Acesse a loja pelo menu.');
          return;
        }
        this.router.navigateByUrl(
          retorno.startsWith('/') && !retorno.startsWith('//') ? retorno : '/loja',
        );
      },
      error: (e) => {
        this.ocupado.set(false);
        this.erro.set(retornoApi(e));
      },
    });
  }
}
