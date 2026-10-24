export interface ItemAtendimentoPayload {
  idItem: number;
  idFuncionario: number;
  quantidadeItens: number;
  valorUnitarioEntrada: number;
}

export interface AtendimentoPayload {
  idPessoa: number;
  dataAtendimento: string;
  statusAtendimento: string;
  itens: ItemAtendimentoPayload[];
}

export interface AtendimentoItemM extends ItemAtendimentoPayload {
  idAtendimento: number;
  idItem: number;
  item?: string;
  nomeFuncionario?: string;
  cargo?: string;
}

export interface AtendimentoM {
  idAtendimento: number;
  idPessoa: number;
  nomePessoa?: string;
  dataAtendimento: string;
  statusAtendimento: string;
  itens: AtendimentoItemM[];
}
