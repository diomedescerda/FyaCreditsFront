import { Component, inject, signal } from '@angular/core';
import { AbstractControl, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss',
})
export class ResetPasswordComponent {
  private readonly formBuilder = inject(NonNullableFormBuilder);
  private readonly auth = inject(AuthService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  readonly email = this.route.snapshot.queryParamMap.get('email') ?? '';
  readonly token = this.route.snapshot.queryParamMap.get('token') ?? '';
  readonly form = this.formBuilder.group(
    {
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required],
    },
    { validators: [this.matchingPasswords] },
  );
  readonly error = signal('');
  readonly success = signal('');
  readonly loading = signal(false);

  submit(): void {
    this.error.set('');
    if (!this.token || !this.email) {
      this.error.set('El enlace no es válido o ya expiró.');
      return;
    }
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    const { password } = this.form.getRawValue();
    this.auth.resetPassword(this.email, this.token, password).subscribe({
      next: () => {
        this.loading.set(false);
        this.success.set('Contraseña actualizada. Ya puedes iniciar sesión.');
        setTimeout(() => this.router.navigate(['/login']), 1200);
      },
      error: () => {
        this.loading.set(false);
        this.error.set('No se pudo restablecer la contraseña. El enlace puede estar vencido.');
      },
    });
  }

  private matchingPasswords(group: AbstractControl) {
    const password = group.get('password')?.value as string;
    const confirm = group.get('confirmPassword')?.value as string;
    return password === confirm ? null : { passwordsMismatch: true };
  }
}
