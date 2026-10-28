export interface EnderecoModel {
  idendereco?: number | null;
  cep: string;
  numero: string;
  complemento: string;
}

export interface GuerreiroPayload {
  nome: string;
  cpf: number;
  dataNascimento: string;
  sexo: string;
  email: string;
  telefone: number | null;
  ativoPessoa: string;
  enderecos: EnderecoModel[];
}

export interface GuerreiroModel extends GuerreiroPayload {
  idpessoa: number;
  enderecos: EnderecoModel[];
}
