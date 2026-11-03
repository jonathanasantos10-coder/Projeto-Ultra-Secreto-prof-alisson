import { Home } from './components/home/home';
import { CadastroMilitar } from './components/cadastro-militar/cadastro-militar';
import { Atendimento } from './components/atendimento/atendimento';
import { Almoxarifado } from './components/almoxarifado/almoxarifado';
import { Loja } from './components/loja/loja';
import { Carrinho } from './components/carrinho/carrinho';
import { Identificacao } from './components/identificacao/identificacao';
import { MeusAtendimentos } from './components/meus-atendimentos/meus-atendimentos';
import { Estoque } from './components/estoque/estoque';
import { intendenciaGuard } from './services/intendencia.guard';
export const routes = [
    { path: '', redirectTo: 'loja', pathMatch: 'full' },
    { path: 'loja', component: Loja },
    { path: 'loja/item/:id', component: Loja },
    { path: 'cadastro', component: CadastroMilitar, data: { publico: true, intendencia: false } },
    { path: 'identificacao', component: Identificacao },
    { path: 'carrinho', component: Carrinho },
    { path: 'meus-atendimentos', component: MeusAtendimentos },
    { path: 'meus-atendimentos/:id', component: MeusAtendimentos },
    { path: 'home', component: Home, canActivate: [intendenciaGuard] },
    {
        path: 'guerreiros',
        component: CadastroMilitar,
        data: { intendencia: false },
        canActivate: [intendenciaGuard],
    },
    {
        path: 'intendencia',
        component: CadastroMilitar,
        data: { intendencia: true },
        canActivate: [intendenciaGuard],
    },
    { path: 'atendimentos', component: Atendimento, canActivate: [intendenciaGuard] },
    { path: 'almoxarifado', component: Almoxarifado, canActivate: [intendenciaGuard] },
    { path: 'estoque', component: Estoque, canActivate: [intendenciaGuard] },
    { path: '**', redirectTo: 'loja' },
];
