export interface EnderecoM {
  idendereco?: number | null;
  cep: string;
  numero: string;
  complemento: string;
}

export interface PessoaPayload {
  nome: string;
  cpf: number;
  dataNascimento: string;
  sexo: string;
  email: string;
  telefone: number | null;
  ativoPessoa: string;
  enderecos: EnderecoM[];
}

export interface FuncionarioPayload extends PessoaPayload {
  cargo: string;
  dataAdmissao: string;
}

export interface PessoaM extends PessoaPayload {
  idpessoa: number;
  enderecos: EnderecoM[];
}

export interface FuncionarioM {
  idpessoa: number;
  cargo: string;
  dataAdmissao: string;
  idpessoaNavigation?: PessoaM;
}
