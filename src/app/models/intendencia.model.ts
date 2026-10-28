import { GuerreiroModel, GuerreiroPayload } from './guerreiro.model';

export interface IntendenciaPayload extends GuerreiroPayload {
  cargo: string;
  dataAdmissao: string;
}

export interface IntendenciaModel {
  idpessoa: number;
  cargo: string;
  dataAdmissao: string;
  idpessoaNavigation?: GuerreiroModel;
}
