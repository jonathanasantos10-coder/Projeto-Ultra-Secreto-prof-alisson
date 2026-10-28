import { Routes } from '@angular/router';
import { Home } from './components/home/home';
import { CadastroMilitar } from './components/cadastro-militar/cadastro-militar';
import { Atendimento } from './components/atendimento/atendimento';
import { Almoxarifado } from './components/almoxarifado/almoxarifado';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: Home },
  { path: 'guerreiros', component: CadastroMilitar, data: { intendencia: false } },
  { path: 'intendencia', component: CadastroMilitar, data: { intendencia: true } },
  { path: 'atendimentos', component: Atendimento },
  { path: 'almoxarifado', component: Almoxarifado },
  { path: '**', redirectTo: 'home' }
];
