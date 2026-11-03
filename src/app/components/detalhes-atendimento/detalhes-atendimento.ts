import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AtendimentoModel } from '../../models/atendimento.model';
export function nomeSituacao(s: string) {
  return s === 'P'
    ? 'Em processamento'
    : s === 'F'
      ? 'Concluído'
      : s === 'C'
        ? 'Cancelado'
        : 'Aberto';
}
@Component({
  selector: 'app-detalhes-atendimento',
  imports: [CommonModule],
  styleUrl: './detalhes-atendimento.css',
  template: `<section class="detalhes">
    <h2>Pedido #{{ atendimento.idAtendimento }}</h2>
    <p>Guerreiro #{{ atendimento.idPessoa }} · {{ atendimento.nomePessoa }}</p>
    <p>
      {{ atendimento.dataAtendimento | date: 'dd/MM/yyyy' : 'UTC' }} ·
      <strong>{{ situacao(atendimento.statusAtendimento) }}</strong>
    </p>
    @for (e of atendimento.enderecos; track e.idendereco) {
      <p>CEP {{ e.cep }} · Nº {{ e.numero }} · {{ e.complemento }}</p>
    }
    <div class="tabela-wrap">
      <table>
        <thead>
          <tr>
            <th>Item</th>
            <th>Intendência / cargo</th>
            <th>Quantidade</th>
            <th>Preço praticado</th>
            <th>Subtotal</th>
          </tr>
        </thead>
        <tbody>
          @for (i of atendimento.itens; track i.idItem) {
            <tr>
              <td>{{ i.item }}</td>
              <td>{{ i.nomeFuncionario }} · {{ i.cargo }}</td>
              <td>{{ i.quantidadeItens }}</td>
              <td>{{ i.valorUnitarioEntrada | currency: 'BRL' }}</td>
              <td>{{ i.quantidadeItens * i.valorUnitarioEntrada | currency: 'BRL' }}</td>
            </tr>
          }
        </tbody>
      </table>
    </div>
    <p class="total">Total: {{ atendimento.valorTotal | currency: 'BRL' }}</p>
  </section>`,
})
export class DetalhesAtendimento {
  @Input({ required: true }) atendimento!: AtendimentoModel;
  situacao = nomeSituacao;
}
