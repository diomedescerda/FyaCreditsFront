import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';
import { environment } from '../config/environment';

interface LoginResponse {
  accessToken: string;
  fullName: string;
  email: string;
}

const tokenKey = 'fya-credits-token';
const emailKey = 'fya-credits-email';
const nameKey = 'fya-credits-fullname';

@Injectable({ providedIn: 'root' })
export class AuthService {
  readonly token = signal(localStorage.getItem(tokenKey));
  readonly email = signal(localStorage.getItem(emailKey) ?? '');
  readonly fullName = signal(localStorage.getItem(nameKey) ?? '');

  constructor(private readonly http: HttpClient) {}

  register(fullName: string, email: string, password: string) {
    return this.http.post(`${environment.apiBaseUrl}/auth/register`, {
      fullName,
      email,
      password,
    });
  }

  login(email: string, password: string) {
    return this.http
      .post<LoginResponse>(`${environment.apiBaseUrl}/auth/login`, { email, password })
      .pipe(
        tap(({ accessToken, fullName, email: userEmail }) => {
          localStorage.setItem(tokenKey, accessToken);
          localStorage.setItem(emailKey, userEmail);
          localStorage.setItem(nameKey, fullName);
          this.token.set(accessToken);
          this.email.set(userEmail);
          this.fullName.set(fullName);
        }),
      );
  }

  forgotPassword(email: string) {
    return this.http.post(`${environment.apiBaseUrl}/auth/forgot-password`, { email });
  }

  resetPassword(email: string, token: string, password: string) {
    return this.http.post(`${environment.apiBaseUrl}/auth/reset-password`, {
      email,
      token,
      password,
    });
  }

  logout() {
    localStorage.removeItem(tokenKey);
    localStorage.removeItem(emailKey);
    localStorage.removeItem(nameKey);
    this.token.set(null);
    this.email.set('');
    this.fullName.set('');
  }
}
