export interface CategoriaM { idcategoria: number; categoria: string; }

export interface ItemM {
  iditem: number;
  idcategoria: number;
  item1: string;
  descricaoItem?: string;
  preco: number;
  tipoItem: string;
  ativoProdutoServico?: string;
  idcategoriaNavigation?: CategoriaM;
}

export interface ProdutoM {
  iditem: number;
  codigoPreco?: number;
  precoVenda?: number;
  unidade?: string;
  estoque?: { iditem: number; quantidadeEstoque: number };
  iditemNavigation: ItemM;
}

export interface EntradaM {
  identradaProduto: number;
  iditem: number;
  dataEntradaProduto: string;
  quantidadeEntrada: number;
  unidade?: string;
  valorUnitarioEntrada: number;
  iditemNavigation?: ProdutoM;
}

export interface ItemOpcao {
  iditem: number;
  descricao: string;
  tipo: string;
  preco: number;
}
