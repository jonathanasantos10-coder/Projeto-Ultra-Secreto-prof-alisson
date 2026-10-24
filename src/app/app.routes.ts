import { Routes } from '@angular/router';
import { Home } from './components/home/home';
import { Cadastro } from './components/cadastro/cadastro';
import { CadastroCorrida } from './components/cadastro-corrida/cadastro-corrida';
import { Gestao } from './components/gestao/gestao';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: Home },
  { path: 'pessoas', component: Cadastro, data: { funcionario: false } },
  { path: 'funcionarios', component: Cadastro, data: { funcionario: true } },
  { path: 'atendimentos', component: CadastroCorrida },
  { path: 'gestao', component: Gestao },
  { path: '**', redirectTo: 'home' }
];
