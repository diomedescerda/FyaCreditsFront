import { ChangeDetectionStrategy, Component, forwardRef, signal } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-money-input',
  standalone: true,
  templateUrl: './money-input.component.html',
  styleUrl: './money-input.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MoneyInputComponent),
      multi: true,
    },
  ],
})
export class MoneyInputComponent implements ControlValueAccessor {
  readonly displayValue = signal('');
  readonly disabled = signal(false);

  private value = 0;
  private onChange: (value: number) => void = () => {};
  private onTouched: () => void = () => {};

  writeValue(value: number | null | undefined): void {
    this.value = typeof value === 'number' ? value : 0;
    this.displayValue.set(this.format(this.value));
  }

  registerOnChange(fn: (value: number) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
  }

  onInput(event: Event): void {
    const raw = (event.target as HTMLInputElement).value;
    const digits = raw.replace(/\D/g, '');
    const parsed = digits === '' ? 0 : parseInt(digits, 10);
    this.value = parsed;
    this.onChange(parsed);
    this.displayValue.set(this.format(parsed));
  }

  onBlur(): void {
    this.onTouched();
    this.displayValue.set(this.format(this.value));
  }

  private format(value: number): string {
    if (!value) return '';
    return new Intl.NumberFormat('es-CO', { maximumFractionDigits: 0 }).format(value);
  }
}
