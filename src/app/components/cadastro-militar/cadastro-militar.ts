import { IdentificacaoService } from '../../services/identificacao.service';
import { ConsultaId } from '../consulta-id/consulta-id';
import { Validacao } from '../validacao/validacao';
import { retornoApi } from '../../services/retorno-api';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router, ActivatedRoute } from '@angular/router';
import { GuerreiroService } from '../../services/guerreiro.service';
import { IntendenciaService } from '../../services/intendencia.service';
import { EnderecoModel, GuerreiroModel, GuerreiroPayload } from '../../models/guerreiro.model';
import { IntendenciaModel, IntendenciaPayload } from '../../models/intendencia.model';

@Component({
  selector: 'app-cadastro-militar',
  imports: [FormsModule, RouterLink, ConsultaId, Validacao],
  templateUrl: './cadastro-militar.html',
  styleUrl: './cadastro-militar.css',
})
export class CadastroMilitar {
  modoIntendencia = false;
  publico = false;
  enderecosAdicionais: EnderecoModel[] = [];
  carregando = false;
  salvando = false;
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
  senha = '';
  confirmarSenha = '';

  constructor(
    private guerreiroService: GuerreiroService,
    private intendenciaService: IntendenciaService,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private identificacao: IdentificacaoService,
    private router: Router,
  ) {
    this.route.data.subscribe((data) => {
      this.modoIntendencia = !!data['intendencia'];
      this.publico = !!data['publico'];
      this.limpar();
      this.carregar();
    });
  }

  carregar(): void {
    this.erro = '';
    if (this.publico) return;
    this.carregando = true;
    if (this.modoIntendencia) {
      this.intendenciaService.listar().subscribe({
        next: (dados) => {
          this.integrantesIntendencia = dados;
          this.carregando = false;
          this.cdr.detectChanges();
        },
        error: (erro) => this.mostrarErro(erro),
      });
    } else {
      this.guerreiroService.listar().subscribe({
        next: (dados) => {
          this.guerreiros = dados;
          this.carregando = false;
          this.cdr.detectChanges();
        },
        error: (erro) => this.mostrarErro(erro),
      });
    }
  }

  salvar(): void {
    if (this.salvando) return;
    this.salvando = true;
    this.mensagem = '';
    this.erro = '';
    if (this.idEditando === null) {
      if (this.senha.length < 8 || this.senha.length > 100) {
        this.erro = 'A senha deve conter entre 8 e 100 caracteres.';
        this.salvando = false;
        return;
      }
      if (this.senha !== this.confirmarSenha) {
        this.erro = 'A confirmação da senha não corresponde.';
        this.salvando = false;
        return;
      }
    }
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
      telefone: Number(this.telefone ?? 0),
      ativoPessoa: this.ativoPessoa,
      enderecos: [endereco, ...this.enderecosAdicionais],
      ...(this.idEditando === null ? { senha: this.senha } : {}),
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
        this.salvando = false;
        if (this.publico) {
          this.identificacao
            .entrar(guerreiro.cpf, this.senha)
            .subscribe({
              next: () => this.router.navigate(['/carrinho']),
              error: (e) => this.mostrarErro(e),
            });
          return;
        }
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
    this.ativoPessoa = guerreiro.ativoPessoa;
    this.enderecosAdicionais = structuredClone(guerreiro.enderecos?.slice(1) || []);
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
    this.ativoPessoa = guerreiro?.ativoPessoa || 'A';
    this.enderecosAdicionais = structuredClone(guerreiro?.enderecos?.slice(1) || []);
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
    this.enderecosAdicionais = [];
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
    this.senha = '';
    this.confirmarSenha = '';
    if (apagarMensagens) {
      this.mensagem = '';
      this.erro = '';
    }
  }

  private preencherEndereco(endereco?: EnderecoModel): void {
    this.idEndereco = endereco?.idendereco ?? null;
    this.cep = endereco?.cep ?? '';
    this.numero = endereco?.numero ?? '';
    this.complemento = endereco?.complemento ?? '';
  }

  private mostrarErro(erro: any): void {
    this.erro = retornoApi(erro);
    this.salvando = false;
    this.carregando = false;
    this.cdr.detectChanges();
  }
  consultar(id: number) {
    this.erro = '';
    this.carregando = true;
    if (this.modoIntendencia)
      this.intendenciaService.consultar(id).subscribe({
        next: (d) => {
          this.integrantesIntendencia = [d];
          this.editarIntendencia(d);
          this.carregando = false;
          this.cdr.detectChanges();
        },
        error: (e) => {
          this.integrantesIntendencia = [];
          this.mostrarErro(e);
        },
      });
    else
      this.guerreiroService.consultar(id).subscribe({
        next: (d) => {
          this.guerreiros = [d];
          this.editarGuerreiro(d);
          this.carregando = false;
          this.cdr.detectChanges();
        },
        error: (e) => {
          this.guerreiros = [];
          this.mostrarErro(e);
        },
      });
  }
  adicionarEndereco() {
    this.enderecosAdicionais.push({ cep: '', numero: '', complemento: '' });
  }
}
