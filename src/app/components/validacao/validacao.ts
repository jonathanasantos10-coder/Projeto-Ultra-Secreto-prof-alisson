import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { NgForm } from '@angular/forms';
@Component({
  selector: 'app-validacao',
  changeDetection: ChangeDetectionStrategy.Default,
  styleUrl: './validacao.css',
  template: `@if (form.submitted && form.invalid) {
    <div class="erro" role="alert">
      Confira os campos obrigatórios e o formato dos dados.
      <ul>
        @for (campo of campos(); track campo) {
          <li>{{ campo }}: preenchimento inválido.</li>
        }
      </ul>
    </div>
  }`,
})
export class Validacao {
  @Input({ required: true }) form!: NgForm;
  campos() {
    return Object.entries(this.form.controls)
      .filter(([, c]) => c.invalid)
      .map(([nome]) => nome);
  }
}
