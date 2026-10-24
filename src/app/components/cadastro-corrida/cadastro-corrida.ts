import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AtletaService } from '../../services/atleta-service';
import { CatalogoService } from '../../services/catalogo-service';
import { CorridaService } from '../../services/corrida-service';
import { FuncionarioM, PessoaM } from '../../Models/atletaModel';
import { AtendimentoItemM, AtendimentoM, AtendimentoPayload, ItemAtendimentoPayload } from '../../Models/corridaModel';
import { ItemM, ItemOpcao, ProdutoM } from '../../Models/catalogoModel';

interface LinhaFormulario { idItem: number | null; idFuncionario: number | null; quantidadeItens: number; valorUnitarioEntrada: number; }

@Component({ selector: 'app-cadastro-corrida', imports: [FormsModule], templateUrl: './cadastro-corrida.html', styleUrl: './cadastro-corrida.css' })
export class CadastroCorrida {
  pessoas: PessoaM[] = [];
  funcionarios: FuncionarioM[] = [];
  opcoesItens: ItemOpcao[] = [];
  atendimentos: AtendimentoM[] = [];
  idPessoa: number | null = null;
  dataAtendimento = '';
  statusAtendimento = 'A';
  linhas: LinhaFormulario[] = [this.novaLinha()];
  idEditando: number | null = null;
  mensagem = '';
  erro = '';

  constructor(private atendimentoService: CorridaService, private pessoasService: AtletaService, private catalogo: CatalogoService) { this.carregar(); }

  carregar(): void {
    this.atendimentoService.list().subscribe({ next: dados => this.atendimentos = dados, error: erro => this.mostrarErro(erro) });
    this.pessoasService.list().subscribe({ next: dados => this.pessoas = dados, error: erro => this.mostrarErro(erro) });
    this.pessoasService.listFuncionarios().subscribe({ next: dados => this.funcionarios = dados, error: erro => this.mostrarErro(erro) });
    this.catalogo.produtos().subscribe({ next: dados => this.opcoesItens = [ ...this.opcoesItens.filter(i => i.tipo !== 'P'), ...dados.map(p => this.produtoOpcao(p)) ], error: erro => this.mostrarErro(erro) });
    this.catalogo.servicos().subscribe({ next: dados => this.opcoesItens = [ ...this.opcoesItens.filter(i => i.tipo !== 'S'), ...dados.map(s => this.servicoOpcao(s)) ], error: erro => this.mostrarErro(erro) });
  }

  novaLinha(): LinhaFormulario { return { idItem: null, idFuncionario: null, quantidadeItens: 1, valorUnitarioEntrada: 0 }; }
  adicionarLinha(): void { this.linhas.push(this.novaLinha()); }
  removerLinha(indice: number): void { this.linhas.splice(indice, 1); }

  salvar(): void {
    this.mensagem = '';
    this.erro = '';
    const itens: ItemAtendimentoPayload[] = this.linhas.map(linha => ({
      idItem: Number(linha.idItem ?? 0),
      idFuncionario: Number(linha.idFuncionario ?? 0),
      quantidadeItens: Number(linha.quantidadeItens),
      valorUnitarioEntrada: Number(linha.valorUnitarioEntrada)
    }));
    const dados: AtendimentoPayload = {
      idPessoa: Number(this.idPessoa ?? 0),
      dataAtendimento: this.dataAtendimento,
      statusAtendimento: this.statusAtendimento,
      itens
    };
    this.atendimentoService.salvar(dados, this.idEditando ?? undefined).subscribe({
      next: () => { this.mensagem = this.idEditando ? 'Atendimento alterado.' : 'Atendimento cadastrado.'; this.limpar(false); this.carregar(); },
      error: erro => this.mostrarErro(erro)
    });
  }

  editar(atendimento: AtendimentoM): void {
    this.idEditando = atendimento.idAtendimento;
    this.idPessoa = atendimento.idPessoa;
    this.dataAtendimento = (atendimento.dataAtendimento ?? '').substring(0, 10);
    this.statusAtendimento = atendimento.statusAtendimento ?? 'A';
    this.linhas = (atendimento.itens ?? []).map((item: AtendimentoItemM) => ({ idItem: item.idItem, idFuncionario: item.idFuncionario, quantidadeItens: item.quantidadeItens, valorUnitarioEntrada: item.valorUnitarioEntrada }));
    if (!this.linhas.length) this.linhas = [this.novaLinha()];
  }

  excluir(id: number): void {
    this.atendimentoService.removerCorrida(id).subscribe({ next: () => { this.mensagem = 'Atendimento excluído.'; this.carregar(); }, error: erro => this.mostrarErro(erro) });
  }

  limpar(apagarMensagens = true): void {
    this.idEditando = null;
    this.idPessoa = null;
    this.dataAtendimento = '';
    this.statusAtendimento = 'A';
    this.linhas = [this.novaLinha()];
    if (apagarMensagens) { this.mensagem = ''; this.erro = ''; }
  }

  private produtoOpcao(p: ProdutoM): ItemOpcao {
    const item = p.iditemNavigation;
    return { iditem: p.iditem, descricao: item?.item1 ?? `Produto ${p.iditem}`, tipo: 'P', preco: Number(item?.preco ?? p.precoVenda ?? 0) };
  }
  private servicoOpcao(s: ItemM): ItemOpcao { return { iditem: s.iditem, descricao: s.item1, tipo: 'S', preco: Number(s.preco ?? 0) }; }
  private mostrarErro(erro: any): void { this.erro = erro?.error?.mensagem ?? erro?.error?.title ?? 'Não foi possível comunicar com a API. Confira se o backend está em execução.'; }
}
