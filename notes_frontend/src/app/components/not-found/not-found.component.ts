import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterModule],
  template: `
    <div class="page">
      <h1>404 - Not Found</h1>
      <p>Sorry, the page you requested was not found.</p>
      <a routerLink="/" class="btn">Go Home</a>
    </div>
  `,
  styles: [`
    .page { padding: 24px; max-width: 800px; margin: 0 auto; }
    h1 { margin-bottom: 8px; }
    .btn {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 8px 12px;
      border-radius: 8px;
      border: 1px solid transparent;
      cursor: pointer;
      text-decoration: none;
      background: #f5f7fa;
      color: #222;
    }
  `]
})
export class NotFoundComponent {}
