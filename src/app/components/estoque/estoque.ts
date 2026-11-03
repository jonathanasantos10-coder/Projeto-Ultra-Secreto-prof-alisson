import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlmoxarifadoService } from '../../services/almoxarifado.service';
import { EstoqueModel } from '../../models/almoxarifado.model';
import { ConsultaId } from '../consulta-id/consulta-id';
import { retornoApi } from '../../services/retorno-api';
@Component({
  selector: 'app-estoque',
  imports: [CommonModule, ConsultaId],
  styleUrl: './estoque.css',
  template: `<main class="pagina">
    <p class="eyebrow">Intendência</p>
    <h1>Estoque do Almoxarifado</h1>
    <app-consulta-id (consultar)="consultar($event)" (listar)="carregar()" />
    @if (erro()) {
      <p class="erro" role="alert">{{ erro() }}</p>
    }
    @if (carregando()) {
      <p>Consultando estoque…</p>
    } @else {
      <section class="painel tabela-wrap">
        <table>
          <thead>
            <tr>
              <th>ID / item</th>
              <th>Descrição</th>
              <th>Categoria</th>
              <th>Preço base</th>
              <th>Venda</th>
              <th>Unidade</th>
              <th>Quantidade</th>
              <th>Ativo</th>
            </tr>
          </thead>
          <tbody>
            @for (i of estoques(); track i.iditem) {
              <tr>
                <td>{{ i.iditem }} · {{ i.item1 }}</td>
                <td>{{ i.descricaoItem }}</td>
                <td>{{ i.categoria }}</td>
                <td>{{ i.preco | currency: 'BRL' }}</td>
                <td>{{ i.precoVenda | currency: 'BRL' }}</td>
                <td>{{ i.unidade }}</td>
                <td>{{ i.quantidadeEstoque }}</td>
                <td>
                  {{
                    i.ativoProdutoServico === 'A' || i.ativoProdutoServico === 'S' ? 'Sim' : 'Não'
                  }}
                </td>
              </tr>
            } @empty {
              <tr>
                <td colspan="8">Nenhum estoque encontrado.</td>
              </tr>
            }
          </tbody>
        </table>
      </section>
    }
  </main>`,
})
export class Estoque {
  estoques = signal<EstoqueModel[]>([]);
  erro = signal('');
  carregando = signal(true);
  constructor(private api: AlmoxarifadoService) {
    this.carregar();
  }
  carregar() {
    this.carregando.set(true);
    this.erro.set('');
    this.api.listarEstoque().subscribe({
      next: (d) => {
        this.estoques.set(d);
        this.carregando.set(false);
      },
      error: (e) => {
        this.erro.set(retornoApi(e));
        this.carregando.set(false);
      },
    });
  }
  consultar(id: number) {
    this.carregando.set(true);
    this.erro.set('');
    this.api.consultarEstoque(id).subscribe({
      next: (d) => {
        this.estoques.set([d]);
        this.carregando.set(false);
      },
      error: (e) => {
        this.estoques.set([]);
        this.erro.set(retornoApi(e));
        this.carregando.set(false);
      },
    });
  }
}
