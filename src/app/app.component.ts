import { Component } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  template: `
    <div class="app-container">
      <header class="app-header">
        <div class="header-content">
          <div class="logo-section" (click)="goHome()">
            <div class="logo-icon">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 13L5 7H19L21 13M3 13V19C3 19.5304 3.21071 20.0391 3.58579 20.4142C3.96086 20.7893 4.46957 21 5 21H6C6.53043 21 7.03914 20.7893 7.41421 20.4142C7.78929 20.0391 8 19.5304 8 19V17M3 13H8M16 13H21M21 13V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H18C17.4696 21 16.9609 20.7893 16.5858 20.4142C16.2107 20.0391 16 19.5304 16 19V17M16 13L17.5 9.5M8 13V17M16 17V17M8 17C8 17.5304 7.78929 18.0391 7.41421 18.4142C7.03914 18.7893 6.53043 19 6 19C5.46957 19 4.96086 18.7893 4.58579 18.4142C4.21071 18.0391 4 17.5304 4 17C4 16.4696 4.21071 15.9609 4.58579 15.5858C4.96086 15.2107 5.46957 15 6 15C6.53043 15 7.03914 15.2107 7.41421 15.5858C7.78929 15.9609 8 16.4696 8 17ZM16 17C16 17.5304 16.2107 18.0391 16.5858 18.4142C16.9609 18.7893 17.4696 19 18 19C18.5304 19 19.0391 18.7893 19.4142 18.4142C19.7893 18.0391 20 17.5304 20 17C20 16.4696 19.7893 15.9609 19.4142 15.5858C19.0391 15.2107 18.5304 15 18 15C17.4696 15 16.9609 15.2107 16.5858 15.5858C16.2107 15.9609 16 16.4696 16 17Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <div class="logo-text">
              <h1>Fleet Fuel Tracker</h1>
              <span>Control de Kilometraje y Horómetro</span>
            </div>
          </div>
          <div class="header-actions">
            <span class="date-badge">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 4H5C3.89543 4 3 4.89543 3 6V20C3 21.1046 3.89543 22 5 22H19C20.1046 22 21 21.1046 21 20V6C21 4.89543 20.1046 4 19 4Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M16 2V6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M8 2V6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M3 10H21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              {{ currentDate }}
            </span>
          </div>
        </div>
      </header>
      <main class="app-main">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [`
    .app-container {
      min-height: 100vh;
      background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
    }
    .app-header {
      background: white;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
      position: sticky;
      top: 0;
      z-index: 100;
    }
    .header-content {
      max-width: 1400px;
      margin: 0 auto;
      padding: 1rem 1.5rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .logo-section {
      display: flex;
      align-items: center;
      gap: 1rem;
      cursor: pointer;
      transition: opacity 0.2s;
      &:hover { opacity: 0.85; }
    }
    .logo-icon {
      width: 48px;
      height: 48px;
      background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      svg { width: 28px; height: 28px; }
    }
    .logo-text h1 {
      margin: 0;
      font-size: 1.25rem;
      font-weight: 700;
      color: #1e293b;
      line-height: 1.2;
    }
    .logo-text span {
      font-size: 0.8rem;
      color: #64748b;
    }
    .header-actions { display: flex; align-items: center; gap: 1rem; }
    .date-badge {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 1rem;
      background: #f1f5f9;
      border-radius: 8px;
      color: #475569;
      font-size: 0.875rem;
      font-weight: 500;
      svg { width: 18px; height: 18px; }
    }
    .app-main {
      max-width: 1400px;
      margin: 0 auto;
      padding: 2rem 1.5rem;
    }
  `]
})
export class AppComponent {
  currentDate: string;

  constructor(private router: Router) {
    const today = new Date();
    this.currentDate = today.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  }

  goHome() {
    this.router.navigate(['/']);
  }
}
