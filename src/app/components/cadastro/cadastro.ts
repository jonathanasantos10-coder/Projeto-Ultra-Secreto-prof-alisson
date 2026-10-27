import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AtletaService } from '../../services/atleta-service';
import { EnderecoM, FuncionarioM, FuncionarioPayload, PessoaM, PessoaPayload } from '../../Models/atletaModel';

@Component({ selector: 'app-cadastro', imports: [FormsModule], templateUrl: './cadastro.html', styleUrl: './cadastro.css' })
export class Cadastro {
  modoFuncionario = false;
  pessoas: PessoaM[] = [];
  funcionarios: FuncionarioM[] = [];
  idEditando: number | null = null;
  idEndereco: number | null = null;
  mensagem = '';
  erro = '';

  nome = '';
  cpf: number | null = null;
  dataNascimento = '';
  sexo = 'N';
  email = '';
  telefone: number | null = null;
  ativoPessoa = 'S';
  cep = '';
  numero = '';
  complemento = '';
  cargo = '';
  dataAdmissao = '';

  constructor(private service: AtletaService, private route: ActivatedRoute) {
    this.route.data.subscribe(data => {
      this.modoFuncionario = !!data['funcionario'];
      this.limpar();
      this.carregar();
    });
  }

  carregar(): void {
    this.erro = '';
    if (this.modoFuncionario) {
      this.service.listFuncionarios().subscribe({ next: dados => this.funcionarios = dados, error: erro => this.mostrarErro(erro) });
    } else {
      this.service.list().subscribe({ next: dados => this.pessoas = dados, error: erro => this.mostrarErro(erro) });
    }
  }

  salvar(): void {
    this.mensagem = '';
    this.erro = '';
    const endereco: EnderecoM = { cep: this.cep, numero: this.numero, complemento: this.complemento };
    if (this.idEndereco !== null) endereco.idendereco = this.idEndereco;
    const pessoa: PessoaPayload = {
      nome: this.nome,
      cpf: Number(this.cpf ?? 0),
      dataNascimento: this.dataNascimento,
      sexo: this.sexo,
      email: this.email,
      telefone: this.telefone === null ? null : Number(this.telefone),
      ativoPessoa: this.ativoPessoa,
      enderecos: [endereco]
    };

    const requisicao = this.modoFuncionario
      ? this.service.salvarFuncionario({ ...pessoa, cargo: this.cargo, dataAdmissao: this.dataAdmissao } as FuncionarioPayload, this.idEditando ?? undefined)
      : this.service.salvarPessoa(pessoa, this.idEditando ?? undefined);

    requisicao.subscribe({
      next: () => {
        this.mensagem = this.idEditando ? 'Registro alterado.' : 'Registro cadastrado.';
        this.limpar(false);
        this.carregar();
      },
      error: erro => this.mostrarErro(erro)
    });

    this.limpar()
    this.carregar()
  }

  editarPessoa(pessoa: PessoaM): void {
    this.idEditando = pessoa.idpessoa;
    this.nome = pessoa.nome ?? '';
    this.cpf = pessoa.cpf ?? null;
    this.dataNascimento = (pessoa.dataNascimento ?? '').substring(0, 10);
    this.sexo = pessoa.sexo ?? 'N';
    this.email = pessoa.email ?? '';
    this.telefone = pessoa.telefone ?? null;
    this.ativoPessoa = pessoa.ativoPessoa ?? 'S';
    this.preencherEndereco(pessoa.enderecos?.[0]);
  }

  editarFuncionario(funcionario: FuncionarioM): void {
    const pessoa = funcionario.idpessoaNavigation;
    this.idEditando = funcionario.idpessoa;
    this.nome = pessoa?.nome ?? '';
    this.cpf = pessoa?.cpf ?? null;
    this.dataNascimento = (pessoa?.dataNascimento ?? '').substring(0, 10);
    this.sexo = pessoa?.sexo ?? 'N';
    this.email = pessoa?.email ?? '';
    this.telefone = pessoa?.telefone ?? null;
    this.ativoPessoa = pessoa?.ativoPessoa ?? 'S';
    this.preencherEndereco(pessoa?.enderecos?.[0]);
    this.cargo = funcionario.cargo ?? '';
    this.dataAdmissao = (funcionario.dataAdmissao ?? '').substring(0, 10);
  }

  excluir(id: number): void {
    const requisicao = this.modoFuncionario ? this.service.removerFuncionario(id) : this.service.removerAtleta(id);
    requisicao.subscribe({
      next: () => { this.mensagem = 'Registro excluído.'; this.carregar(); },
      error: erro => this.mostrarErro(erro)
    });
  }

  limpar(apagarMensagens = true): void {
    this.idEditando = null;
    this.idEndereco = null;
    this.nome = '';
    this.cpf = null;
    this.dataNascimento = '';
    this.sexo = 'N';
    this.email = '';
    this.telefone = null;
    this.ativoPessoa = 'S';
    this.cep = '';
    this.numero = '';
    this.complemento = '';
    this.cargo = '';
    this.dataAdmissao = '';
    if (apagarMensagens) { this.mensagem = ''; this.erro = ''; }
  }

  private preencherEndereco(endereco?: EnderecoM): void {
    this.idEndereco = endereco?.idendereco ?? null;
    this.cep = endereco?.cep ?? '';
    this.numero = endereco?.numero ?? '';
    this.complemento = endereco?.complemento ?? '';
  }

  private mostrarErro(erro: any): void {
    this.erro = erro?.error?.mensagem ?? erro?.error?.title ?? 'Não foi possível comunicar com a API. Confira se o backend está em execução.';
  }
}
