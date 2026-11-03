import { ConsultaId } from '../consulta-id/consulta-id';
import { Validacao } from '../validacao/validacao';
import { DetalhesAtendimento, nomeSituacao } from '../detalhes-atendimento/detalhes-atendimento';
import { retornoApi } from '../../services/retorno-api';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { GuerreiroService } from '../../services/guerreiro.service';
import { IntendenciaService } from '../../services/intendencia.service';
import { AlmoxarifadoService } from '../../services/almoxarifado.service';
import { AtendimentoService } from '../../services/atendimento.service';
import { GuerreiroModel } from '../../models/guerreiro.model';
import { IntendenciaModel } from '../../models/intendencia.model';
import {
  AtendimentoItemModel,
  AtendimentoModel,
  AtendimentoPayload,
  ItemAtendimentoPayload,
} from '../../models/atendimento.model';
import { ItemCatalogoModel, ItemOpcao, ProdutoModel } from '../../models/almoxarifado.model';

interface LinhaAtendimento {
  idItem: number | null;
  idFuncionario: number | null;
  quantidadeItens: number;
  valorUnitarioEntrada: number;
}

@Component({
  selector: 'app-atendimento',
  imports: [FormsModule, ConsultaId, Validacao, DetalhesAtendimento],
  templateUrl: './atendimento.html',
  styleUrl: './atendimento.css',
})
export class Atendimento {
  filtroStatus = '';
  detalhe: AtendimentoModel | null = null;
  nomeSituacao = nomeSituacao;
  guerreiros: GuerreiroModel[] = [];
  integrantesIntendencia: IntendenciaModel[] = [];
  opcoesItens: ItemOpcao[] = [];
  atendimentos: AtendimentoModel[] = [];
  idGuerreiro: number | null = null;
  dataAtendimento = '';
  statusAtendimento = 'A';
  linhas: LinhaAtendimento[] = [this.novaLinha()];
  idEditando: number | null = null;
  mensagem = '';
  erro = '';

  constructor(
    private atendimentoService: AtendimentoService,
    private guerreiroService: GuerreiroService,
    private intendenciaService: IntendenciaService,
    private almoxarifado: AlmoxarifadoService,
    private cdr: ChangeDetectorRef,
  ) {
    this.carregar();
  }

  carregar(): void {
    this.atendimentoService.listar(this.filtroStatus).subscribe({
      next: (dados) => {
        this.atendimentos = dados;
        this.cdr.detectChanges();
      },
      error: (erro) => this.mostrarErro(erro),
    });
    this.guerreiroService.listar().subscribe({
      next: (dados) => {
        this.guerreiros = dados;
        this.cdr.detectChanges();
      },
      error: (erro) => this.mostrarErro(erro),
    });
    this.intendenciaService.listar().subscribe({
      next: (dados) => {
        this.integrantesIntendencia = dados;
        this.cdr.detectChanges();
      },
      error: (erro) => this.mostrarErro(erro),
    });
    this.almoxarifado.listarProdutos().subscribe({
      next: (dados) => {
        this.opcoesItens = [
          ...this.opcoesItens.filter((item) => item.tipo !== 'P'),
          ...dados.map((produto) => this.produtoOpcao(produto)),
        ];
        this.cdr.detectChanges();
      },
      error: (erro) => this.mostrarErro(erro),
    });
    this.almoxarifado.listarServicos().subscribe({
      next: (dados) => {
        this.opcoesItens = [
          ...this.opcoesItens.filter((item) => item.tipo !== 'S'),
          ...dados.map((servico) => this.servicoOpcao(servico)),
        ];
        this.cdr.detectChanges();
      },
      error: (erro) => this.mostrarErro(erro),
    });
  }

  novaLinha(): LinhaAtendimento {
    return { idItem: null, idFuncionario: null, quantidadeItens: 1, valorUnitarioEntrada: 0 };
  }

  adicionarLinha(): void {
    this.linhas.push(this.novaLinha());
  }

  atualizarValor(linha: LinhaAtendimento, idItem: number | null): void {
    const opcao = this.opcoesItens.find((item) => item.iditem === Number(idItem));
    linha.valorUnitarioEntrada = opcao?.preco ?? 0;
  }
  removerLinha(indice: number): void {
    this.linhas.splice(indice, 1);
  }

  salvar(): void {
    this.mensagem = '';
    this.erro = '';
    const itens: ItemAtendimentoPayload[] = this.linhas.map((linha) => ({
      idItem: Number(linha.idItem ?? 0),
      idFuncionario: Number(linha.idFuncionario ?? 0),
      quantidadeItens: Number(linha.quantidadeItens),
      valorUnitarioEntrada: Number(linha.valorUnitarioEntrada),
    }));
    const dados: AtendimentoPayload = {
      idPessoa: Number(this.idGuerreiro ?? 0),
      dataAtendimento: this.dataAtendimento,
      statusAtendimento: this.statusAtendimento,
      itens,
    };

    this.atendimentoService.salvar(dados, this.idEditando ?? undefined).subscribe({
      next: () => {
        this.mensagem = this.idEditando ? 'Atendimento alterado.' : 'Atendimento cadastrado.';
        this.limpar(false);
        this.carregar();
        this.cdr.detectChanges();
      },
      error: (erro) => this.mostrarErro(erro),
    });
  }

  editar(atendimento: AtendimentoModel): void {
    this.idEditando = atendimento.idAtendimento;
    this.idGuerreiro = atendimento.idPessoa;
    this.dataAtendimento = (atendimento.dataAtendimento ?? '').substring(0, 10);
    this.statusAtendimento = atendimento.statusAtendimento ?? 'A';
    this.linhas = (atendimento.itens ?? []).map((item: AtendimentoItemModel) => ({
      idItem: item.idItem,
      idFuncionario: item.idFuncionario,
      quantidadeItens: item.quantidadeItens,
      valorUnitarioEntrada: item.valorUnitarioEntrada,
    }));
    if (!this.linhas.length) this.linhas = [this.novaLinha()];
    this.cdr.detectChanges();
  }

  excluir(id: number): void {
    this.atendimentoService.excluir(id).subscribe({
      next: () => {
        this.mensagem = 'Atendimento excluído.';
        this.carregar();
        this.cdr.detectChanges();
      },
      error: (erro) => this.mostrarErro(erro),
    });
  }

  limpar(apagarMensagens = true): void {
    this.idEditando = null;
    this.idGuerreiro = null;
    this.dataAtendimento = '';
    this.statusAtendimento = 'A';
    this.linhas = [this.novaLinha()];
    if (apagarMensagens) {
      this.mensagem = '';
      this.erro = '';
    }
  }

  private produtoOpcao(produto: ProdutoModel): ItemOpcao {
    const item = produto.iditemNavigation;
    return {
      iditem: produto.iditem,
      descricao: item?.item1 ?? `Produto ${produto.iditem}`,
      tipo: 'P',
      preco: Number(produto.precoVenda ?? item?.preco ?? 0),
    };
  }

  private servicoOpcao(servico: ItemCatalogoModel): ItemOpcao {
    return {
      iditem: servico.iditem,
      descricao: servico.item1,
      tipo: 'S',
      preco: Number(servico.preco ?? 0),
    };
  }

  private mostrarErro(erro: any): void {
    this.erro = retornoApi(erro);
    this.cdr.detectChanges();
  }
  consultar(id: number) {
    this.erro = '';
    this.detalhe = null;
    this.atendimentoService.consultar(id).subscribe({
      next: (d) => {
        this.detalhe = d;
        this.cdr.detectChanges();
      },
      error: (e) => this.mostrarErro(e),
    });
  }
  mudarSituacao(atendimento: AtendimentoModel, status: string) {
    this.atendimentoService.alterarSituacao(atendimento.idAtendimento, status).subscribe({
      next: () => {
        this.mensagem = 'Situação atualizada.';
        this.detalhe = null;
        this.carregar();
      },
      error: (e) => this.mostrarErro(e),
    });
  }
}
