export interface CategoriaModel {
  idcategoria: number;
  categoria: string;
}

export interface CategoriaPayload {
  categoria: string;
}

export type TipoItem = 'P' | 'S';

/** Objeto retornado pelo endpoint público /api/Catalogo. */
export interface ItemCatalogoModel {
  iditem: number;
  idcategoria: number;
  item1: string;
  descricaoItem: string;
  preco: number;
  tipoItem: TipoItem;
  ativoProdutoServico: string;
  temImagem?: boolean;
  idcategoriaNavigation?: CategoriaModel | null;
  precoVenda?: number | null;
  unidade?: string | null;
  quantidadeEstoque?: number | null;
}

/** Payload esperado por POST/PUT /api/ProdutoItem e /api/Itens. */
export interface ItemCatalogoPayload {
  idCategoria: number;
  item: string;
  descricaoItem: string;
  preco: number;
  ativoProdutoServico: string;
  codigoPreco: number;
  precoVenda: number;
  unidade: string;
}

/** Formato retornado pelo endpoint administrativo /api/ProdutoItem. */
export interface ProdutoModel {
  iditem: number;
  codigoPreco: number;
  precoVenda: number;
  unidade: string;
  estoque?: {
    iditem: number;
    quantidadeEstoque: number;
  } | null;
  iditemNavigation: ItemCatalogoModel;
}

export interface EntradaProdutoPayload {
  idItem: number;
  dataEntradaProduto: string;
  quantidadeEntrada: number;
  unidade: string;
  valorUnitarioEntrada: number;
}

/** Formato reduzido realmente devolvido por /api/EntradaProduto. */
export interface EntradaProdutoModel {
  identradaProduto: number;
  iditem: number;
  dataEntradaProduto: string;
  quantidadeEntrada: number;
  unidade: string;
  valorUnitarioEntrada: number;
  iditemNavigation?: {
    iditem: number;
    iditemNavigation?: {
      item1: string;
    };
  } | null;
}

/** Formato devolvido por /api/Estoque e /api/Estoque/{id}. */
export interface EstoqueModel {
  iditem: number;
  item1: string;
  descricaoItem: string;
  categoria: string;
  preco: number;
  precoVenda: number;
  unidade: string;
  quantidadeEstoque: number;
  ativoProdutoServico: string;
}

export interface ItemOpcao {
  iditem: number;
  descricao: string;
  tipo: TipoItem;
  preco: number;
  quantidadeEstoque?: number | null;
}
