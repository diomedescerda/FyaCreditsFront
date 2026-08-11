import { CurrencyPipe, DatePipe, DecimalPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  inject,
  OnDestroy,
  signal,
} from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../core/auth/auth.service';
import { CreditsApiService } from '../../core/api/credits-api.service';
import { Credit, PagedResult } from '../../core/models/credit.model';
import { MoneyInputComponent } from '../../shared/money-input/money-input.component';
import { ScrollRevealDirective } from '../../shared/scroll-reveal/scroll-reveal.directive';

@Component({
  selector: 'app-credit-dashboard',
  imports: [
    CurrencyPipe,
    DatePipe,
    DecimalPipe,
    ReactiveFormsModule,
    MoneyInputComponent,
    ScrollRevealDirective,
  ],
  templateUrl: './credit-dashboard.component.html',
  styleUrl: './credit-dashboard.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditDashboardComponent implements OnDestroy {
  private readonly formBuilder = inject(NonNullableFormBuilder);
  private readonly creditsApi = inject(CreditsApiService);
  readonly auth = inject(AuthService);

  readonly loginForm = this.formBuilder.group({
    commercialName: ['', [Validators.required, Validators.maxLength(150)]],
    password: ['', Validators.required],
  });
  readonly creditForm = this.formBuilder.group({
    clientName: ['', [Validators.required, Validators.maxLength(150)]],
    clientId: ['', [Validators.required, Validators.maxLength(50)]],
    amount: [0, [Validators.required, Validators.min(1)]],
    interestRate: [0, [Validators.required, Validators.min(0), Validators.max(100)]],
    termMonths: [1, [Validators.required, Validators.min(1), Validators.max(600)]],
  });
  readonly filterForm = this.formBuilder.group({
    clientName: [''],
    clientId: [''],
    commercialName: [''],
    sortBy: ['date' as 'date' | 'amount'],
    sortDirection: ['desc' as 'asc' | 'desc'],
  });

  readonly credits = signal<Credit[]>([]);
  readonly totalCount = signal(0);
  readonly page = signal(1);
  readonly loading = signal(false);
  readonly submitting = signal(false);
  readonly message = signal('');
  readonly error = signal('');
  readonly loginError = signal('');
  readonly selectedCredit = signal<Credit | null>(null);
  readonly transitioning = signal(false);
  readonly leaving = signal(false);
  readonly pageSize = 20;
  private readonly timers: ReturnType<typeof setTimeout>[] = [];

  ngOnDestroy(): void {
    this.timers.forEach(clearTimeout);
  }

  @HostListener('document:keydown.escape')
  closeDetails(): void {
    this.selectedCredit.set(null);
  }

  private after(delayMs: number, action: () => void): void {
    this.timers.push(setTimeout(action, delayMs));
  }

  private runLoginTransition(): void {
    this.transitioning.set(true);
    this.leaving.set(false);
    this.after(600, () => this.leaving.set(true));
    this.after(1000, () => {
      this.transitioning.set(false);
      this.leaving.set(false);
      this.loadCredits();
    });
  }

  openDetails(credit: Credit): void {
    this.selectedCredit.set(credit);
  }

  login() {
    this.loginError.set('');
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const { commercialName, password } = this.loginForm.getRawValue();
    this.auth.login(commercialName, password).subscribe({
      next: () => this.runLoginTransition(),
      error: () => this.loginError.set('No fue posible iniciar sesión. Verifica tus datos.'),
    });
  }

  logout() {
    this.auth.logout();
    this.credits.set([]);
    this.totalCount.set(0);
  }

  registerCredit() {
    this.message.set('');
    this.error.set('');
    if (this.creditForm.invalid || this.submitting()) {
      this.creditForm.markAllAsTouched();
      return;
    }

    this.submitting.set(true);
    this.creditsApi.register(this.creditForm.getRawValue()).subscribe({
      next: () => {
        this.message.set('Crédito registrado correctamente.');
        this.creditForm.reset({ amount: 0, interestRate: 0, termMonths: 1 });
        this.loadCredits();
        this.submitting.set(false);
      },
      error: () => {
        this.error.set('No fue posible registrar el crédito. Intenta nuevamente.');
        this.submitting.set(false);
      },
    });
  }

  loadCredits() {
    if (!this.auth.token()) return;

    this.loading.set(true);
    this.error.set('');
    const filters = this.filterForm.getRawValue();
    this.creditsApi
      .search({ ...filters, page: this.page(), pageSize: this.pageSize })
      .subscribe({
        next: (result: PagedResult<Credit>) => {
          this.credits.set(result.items);
          this.totalCount.set(result.totalCount);
          this.loading.set(false);
        },
        error: () => {
          this.error.set('No fue posible cargar los créditos.');
          this.loading.set(false);
        },
      });
  }

  applyFilters() {
    this.page.set(1);
    this.loadCredits();
  }

  changePage(delta: number) {
    const nextPage = this.page() + delta;
    if (nextPage < 1 || nextPage > this.totalPages()) return;
    this.page.set(nextPage);
    this.loadCredits();
  }

  totalPages() {
    return Math.max(1, Math.ceil(this.totalCount() / this.pageSize));
  }

  hasFieldError(formName: 'loginForm' | 'creditForm', fieldName: string) {
    if (formName === 'loginForm') {
      const control = this.loginForm.get(fieldName);
      return control?.invalid && control.touched;
    }

    const control = this.creditForm.get(fieldName);
    return control?.invalid && control.touched;
  }

  creditError(fieldName: 'clientName' | 'clientId' | 'amount' | 'interestRate' | 'termMonths'): string {
    const control = this.creditForm.get(fieldName);
    if (!control || !control.errors || !control.touched) return '';

    if (control.errors['required']) {
      return fieldName === 'clientId'
        ? 'La cédula o ID es obligatoria.'
        : fieldName === 'clientName'
          ? 'El nombre del cliente es obligatorio.'
          : 'Este campo es obligatorio.';
    }
    if (control.errors['maxlength']) {
      return fieldName === 'clientName' ? 'Máximo 150 caracteres.' : 'Máximo 50 caracteres.';
    }
    if (fieldName === 'amount' && control.errors['min']) {
      return 'El valor debe ser mayor que cero.';
    }
    if (fieldName === 'interestRate') {
      return 'La tasa debe estar entre 0 y 100.';
    }
    if (fieldName === 'termMonths') {
      return 'El plazo debe estar entre 1 y 600 meses.';
    }
    return 'Valor no válido.';
  }
}
