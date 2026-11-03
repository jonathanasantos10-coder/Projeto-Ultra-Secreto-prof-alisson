import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { App } from './app';
import { API_URL } from './services/api-config';
describe('Navegação por perfil', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [App],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    }),
  );
  afterEach(() => TestBed.inject(HttpTestingController).verify());
  it('convida o visitante a se identificar', async () => {
    const f = TestBed.createComponent(App);
    f.detectChanges();
    TestBed.inject(HttpTestingController)
      .expectOne(`${API_URL}/Identificacao`)
      .flush({}, { status: 401, statusText: 'Unauthorized' });
    await f.whenStable();
    expect(f.nativeElement.textContent).toContain('Identificar-me');
    expect(f.nativeElement.textContent).not.toContain('Painel da Intendência');
  });
  it('mostra ao guerreiro suas compras sem menu administrativo', async () => {
    const f = TestBed.createComponent(App);
    f.detectChanges();
    TestBed.inject(HttpTestingController)
      .expectOne(`${API_URL}/Identificacao`)
      .flush({ idpessoa: 10, nome: 'Guerreiro', intendencia: false });
    await f.whenStable();
    expect(f.nativeElement.textContent).toContain('Meus pedidos');
    expect(f.nativeElement.textContent).not.toContain('Painel da Intendência');
  });
  it('libera o link do painel para a intendência', async () => {
    const f = TestBed.createComponent(App);
    f.detectChanges();
    TestBed.inject(HttpTestingController)
      .expectOne(`${API_URL}/Identificacao`)
      .flush({ idpessoa: 1, nome: 'Intendente', intendencia: true });
    await f.whenStable();
    expect(f.nativeElement.textContent).toContain('Painel da Intendência');
  });
});
