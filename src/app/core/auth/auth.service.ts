import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';
import { environment } from '../config/environment';

interface TokenResponse {
  accessToken: string;
}

const tokenKey = 'fya-credits-token';
const commercialKey = 'fya-credits-commercial';

@Injectable({ providedIn: 'root' })
export class AuthService {
  readonly token = signal(localStorage.getItem(tokenKey));
  readonly commercialName = signal(localStorage.getItem(commercialKey) ?? '');

  constructor(private readonly http: HttpClient) {}

  login(commercialName: string, password: string) {
    return this.http
      .post<TokenResponse>(`${environment.apiBaseUrl}/auth/token`, { commercialName, password })
      .pipe(
        tap(({ accessToken }) => {
          localStorage.setItem(tokenKey, accessToken);
          localStorage.setItem(commercialKey, commercialName.trim());
          this.token.set(accessToken);
          this.commercialName.set(commercialName.trim());
        }),
      );
  }

  logout() {
    localStorage.removeItem(tokenKey);
    localStorage.removeItem(commercialKey);
    this.token.set(null);
    this.commercialName.set('');
  }
}
