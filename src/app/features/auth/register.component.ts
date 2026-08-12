import { Component, inject, signal } from '@angular/core';
import { AbstractControl, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  private readonly formBuilder = inject(NonNullableFormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  readonly form = this.formBuilder.group(
    {
      fullName: ['', [Validators.required, Validators.maxLength(150)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required],
    },
    { validators: [this.matchingPasswords] },
  );
  readonly error = signal('');
  readonly success = signal('');
  readonly loading = signal(false);

  register(): void {
    this.error.set('');
    this.success.set('');
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    const { fullName, email, password } = this.form.getRawValue();
    this.auth.register(fullName, email, password).subscribe({
      next: () => {
        this.loading.set(false);
        this.success.set('Cuenta creada. Ahora puedes iniciar sesión.');
        setTimeout(() => this.router.navigate(['/login']), 1200);
      },
      error: () => {
        this.loading.set(false);
        this.error.set('No se pudo crear la cuenta. Verifica los datos o si el correo ya existe.');
      },
    });
  }

  private matchingPasswords(group: AbstractControl) {
    const password = group.get('password')?.value as string;
    const confirm = group.get('confirmPassword')?.value as string;
    return password === confirm ? null : { passwordsMismatch: true };
  }
}
