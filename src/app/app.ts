import { Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { Capacitor } from '@capacitor/core';
import { App as CapApp } from '@capacitor/app';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  private readonly router = inject(Router);

  constructor() {
    if (Capacitor.isNativePlatform()) {
      CapApp.addListener('appUrlOpen', ({ url }) => this.handleDeepLink(url));
      CapApp.getLaunchUrl().then((launch) => {
        if (launch?.url) this.handleDeepLink(launch.url);
      });
    }
  }

  private handleDeepLink(url: string): void {
    try {
      const parsed = new URL(url);
      if (parsed.host === 'reset-password') {
        this.router.navigate(['/reset-password'], {
          queryParams: {
            token: parsed.searchParams.get('token'),
            email: parsed.searchParams.get('email'),
          },
        });
      }
    } catch {
      // Ignore malformed deep links.
    }
  }
}
