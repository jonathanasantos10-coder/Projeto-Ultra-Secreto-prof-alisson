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

export interface AtendimentoItemModel extends ItemAtendimentoPayload {
  idAtendimento: number;
  item?: string;
  nomeFuncionario?: string;
  cargo?: string;
}

export interface AtendimentoModel {
  idAtendimento: number;
  idPessoa: number;
  nomePessoa?: string;
  dataAtendimento: string;
  statusAtendimento: string;
  itens: AtendimentoItemModel[];
}
