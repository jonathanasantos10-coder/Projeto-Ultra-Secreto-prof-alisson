import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { GuerreiroService } from '../../services/guerreiro.service';
import { IntendenciaService } from '../../services/intendencia.service';
import { EnderecoModel, GuerreiroModel, GuerreiroPayload } from '../../models/guerreiro.model';
import { IntendenciaModel, IntendenciaPayload } from '../../models/intendencia.model';

@Component({
  selector: 'app-cadastro-militar',
  imports: [FormsModule],
  templateUrl: './cadastro-militar.html',
  styleUrl: './cadastro-militar.css',
})
export class CadastroMilitar {
  modoIntendencia = false;
  guerreiros: GuerreiroModel[] = [];
  integrantesIntendencia: IntendenciaModel[] = [];
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
  ativoPessoa = 'A';
  cep = '';
  numero = '';
  complemento = '';
  cargo = '';
  dataAdmissao = '';

  constructor(
    private guerreiroService: GuerreiroService,
    private intendenciaService: IntendenciaService,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
  ) {
    this.route.data.subscribe((data) => {
      this.modoIntendencia = !!data['intendencia'];
      this.limpar();
      this.carregar();
    });
  }

  carregar(): void {
    this.erro = '';
    if (this.modoIntendencia) {
      this.intendenciaService.listar().subscribe({
        next: (dados) => {
          this.integrantesIntendencia = dados;
          this.cdr.detectChanges();
        },
        error: (erro) => this.mostrarErro(erro),
      });
    } else {
      this.guerreiroService.listar().subscribe({
        next: (dados) => {
          this.guerreiros = dados;
          this.cdr.detectChanges();
        },
        error: (erro) => this.mostrarErro(erro),
      });
    }
  }

  salvar(): void {
    this.mensagem = '';
    this.erro = '';
    const endereco: EnderecoModel = {
      idendereco: this.idEndereco ?? 0,
      cep: this.cep,
      numero: this.numero,
      complemento: this.complemento,
    };

    const guerreiro: GuerreiroPayload = {
      nome: this.nome,
      cpf: Number(this.cpf ?? 0),
      dataNascimento: this.dataNascimento,
      sexo: this.sexo,
      email: this.email,
      telefone: this.telefone === null ? null : Number(this.telefone),
      ativoPessoa: 'A',
      enderecos: [endereco],
    };

    const requisicao = this.modoIntendencia
      ? this.intendenciaService.salvar(
          {
            ...guerreiro,
            cargo: this.cargo,
            dataAdmissao: this.dataAdmissao,
          } as IntendenciaPayload,
          this.idEditando ?? undefined,
        )
      : this.guerreiroService.salvar(guerreiro, this.idEditando ?? undefined);

    requisicao.subscribe({
      next: () => {
        this.mensagem = this.idEditando ? 'Registro alterado.' : 'Registro cadastrado.';
        this.limpar(false);
        this.carregar();
        this.cdr.detectChanges();
      },
      error: (erro) => this.mostrarErro(erro),
    });
  }

  editarGuerreiro(guerreiro: GuerreiroModel): void {
    this.idEditando = guerreiro.idpessoa;
    this.nome = guerreiro.nome ?? '';
    this.cpf = guerreiro.cpf ?? null;
    this.dataNascimento = (guerreiro.dataNascimento ?? '').substring(0, 10);
    this.sexo = guerreiro.sexo ?? 'N';
    this.email = guerreiro.email ?? '';
    this.telefone = guerreiro.telefone ?? null;
    this.preencherEndereco(guerreiro.enderecos?.[0]);
    this.cdr.detectChanges();
  }

  editarIntendencia(integrante: IntendenciaModel): void {
    const guerreiro = integrante.idpessoaNavigation;
    this.idEditando = integrante.idpessoa;
    this.nome = guerreiro?.nome ?? '';
    this.cpf = guerreiro?.cpf ?? null;
    this.dataNascimento = (guerreiro?.dataNascimento ?? '').substring(0, 10);
    this.sexo = guerreiro?.sexo ?? 'N';
    this.email = guerreiro?.email ?? '';
    this.telefone = guerreiro?.telefone ?? null;
    this.preencherEndereco(guerreiro?.enderecos?.[0]);
    this.cargo = integrante.cargo ?? '';
    this.dataAdmissao = (integrante.dataAdmissao ?? '').substring(0, 10);
    this.cdr.detectChanges();
  }

  excluir(id: number): void {
    const requisicao = this.modoIntendencia
      ? this.intendenciaService.excluir(id)
      : this.guerreiroService.excluir(id);

    requisicao.subscribe({
      next: () => {
        this.mensagem = 'Registro excluído.';
        this.carregar();
        this.cdr.detectChanges();
      },
      error: (erro) => this.mostrarErro(erro),
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
    this.ativoPessoa = 'A';
    this.cep = '';
    this.numero = '';
    this.complemento = '';
    this.cargo = '';
    this.dataAdmissao = '';
    if (apagarMensagens) {
      this.mensagem = '';
      this.erro = '';
    }
1
  }

  private preencherEndereco(endereco?: EnderecoModel): void {
    this.idEndereco = endereco?.idendereco ?? null;
    this.cep = endereco?.cep ?? '';
    this.numero = endereco?.numero ?? '';
    this.complemento = endereco?.complemento ?? '';
  }

  private mostrarErro(erro: any): void {
    this.erro =
      erro?.error?.mensagem ??
      erro?.error?.title ??
      'Não foi possível comunicar com a API. Confira se o backend está em execução.';
    this.cdr.detectChanges();
  }
}
