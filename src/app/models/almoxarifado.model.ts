export interface CategoriaModel {
  idcategoria: number;
  categoria: string;
}

export interface ItemCatalogoModel {
  iditem: number;
  idcategoria: number;
  item1: string;
  descricaoItem?: string;
  preco: number;
  tipoItem: string;
  ativoProdutoServico?: string;
  idcategoriaNavigation?: CategoriaModel;
}

export interface ProdutoModel {
  iditem: number;
  codigoPreco?: number;
  precoVenda?: number;
  unidade?: string;
  estoque?: { iditem: number; quantidadeEstoque: number };
  iditemNavigation: ItemCatalogoModel;
}

export interface EntradaProdutoModel {
  identradaProduto: number;
  iditem: number;
  dataEntradaProduto: string;
  quantidadeEntrada: number;
  unidade?: string;
  valorUnitarioEntrada: number;
  iditemNavigation?: ProdutoModel;
}

export interface ItemOpcao {
  iditem: number;
  descricao: string;
  tipo: string;
  preco: number;
}
