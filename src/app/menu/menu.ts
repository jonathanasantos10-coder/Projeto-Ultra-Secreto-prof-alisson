import { Component, signal } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { IdentificacaoService } from '../services/identificacao.service';
import { CarrinhoService } from '../services/carrinho.service';
@Component({
  selector: 'app-menu',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './menu.html',
  styleUrl: './menu.css',
})
export class Menu {
  url = signal('');
  erro = signal('');
  constructor(
    public identificacao: IdentificacaoService,
    public carrinho: CarrinhoService,
    private router: Router,
  ) {
    this.url.set(router.url);
    router.events.subscribe((e) => {
      if (e instanceof NavigationEnd) this.url.set(e.urlAfterRedirects);
    });
    identificacao.verificar().subscribe({ error: () => identificacao.atual.set(null) });
  }
  administrativo() {
    return [
      '/home',
      '/guerreiros',
      '/intendencia',
      '/almoxarifado',
      '/estoque',
      '/atendimentos',
    ].includes(this.url().split('?')[0]);
  }
  sair() {
    this.identificacao
      .sair()
      .subscribe({
        next: () => this.router.navigate(['/loja']),
        error: () => this.erro.set('Não foi possível encerrar a sessão. Tente novamente.'),
      });
  }
}
