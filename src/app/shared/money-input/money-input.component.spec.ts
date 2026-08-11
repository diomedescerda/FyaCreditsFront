import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MoneyInputComponent } from './money-input.component';

@Component({
  standalone: true,
  imports: [MoneyInputComponent, ReactiveFormsModule],
  template: `<app-money-input [formControl]="control" />`,
})
class HostComponent {
  control = new FormControl<number>(0);
}

describe('MoneyInputComponent', () => {
  let fixture: ComponentFixture<HostComponent>;
  let host: HostComponent;
  let input: HTMLInputElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HostComponent);
    host = fixture.componentInstance;
    fixture.detectChanges();
    input = fixture.nativeElement.querySelector('input') as HTMLInputElement;
  });

  function type(value: string) {
    input.value = value;
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
  }

  it('formats thousands separators in es-CO', () => {
    type('1000');
    expect(input.value).toBe('1.000');
    expect(host.control.value).toBe(1000);
  });

  it('formats millions with dots', () => {
    type('1000000');
    expect(input.value).toBe('1.000.000');
    expect(host.control.value).toBe(1000000);
  });

  it('emits the raw integer without formatting', () => {
    type('7800000');
    expect(host.control.value).toBe(7800000);
  });

  it('shows an empty display when the control is reset to zero', () => {
    host.control.setValue(0);
    fixture.detectChanges();
    expect(input.value).toBe('');
  });
});
