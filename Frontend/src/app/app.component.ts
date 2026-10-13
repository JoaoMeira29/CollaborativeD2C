import { Component, signal } from '@angular/core';
import { NavigationEnd, Router } from "@angular/router";

@Component({
  selector: 'app-root',
  standalone: false,
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  // Login and register fill the whole screen, without header and footer
  showChrome = signal(true);
  title = 'Collaborative D2C';

  constructor(
    private router: Router
  ) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.showChrome.set(!(this.hasRoute('login') || this.hasRoute('register')));
      }
    });
  }

  hasRoute(route: string) {
    return this.router.url.includes(route);
  }
}
