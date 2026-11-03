import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-consulta-id',
  imports: [FormsModule],
  styleUrl: './consulta-id.css',
  template: `<form class="consulta-id" (ngSubmit)="buscar()">
    <label for="consultaId">Consultar por ID</label
    ><input
      id="consultaId"
      type="number"
      name="consultaId"
      [(ngModel)]="id"
      min="1"
      step="1"
      required
    /><button [disabled]="!valido() || carregando">Consultar</button
    ><button type="button" class="secundario" (click)="id = null; listar.emit()">
      Listar todos
    </button>
  </form>`,
})
export class ConsultaId {
  id: number | null = null;
  @Input() carregando = false;
  @Output() consultar = new EventEmitter<number>();
  @Output() listar = new EventEmitter<void>();
  valido() {
    return Number.isInteger(this.id) && this.id! > 0;
  }
  buscar() {
    if (this.valido()) this.consultar.emit(this.id!);
  }
}
