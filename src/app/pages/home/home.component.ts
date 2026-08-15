import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { VehicleService } from '../../services/vehicle.service';
import { Vehicle } from '../../models/vehicle.model';
import { Observable, catchError, of } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="home-page">
      <div class="search-section">
        <div class="search-header">
          <h2>Buscar Vehículo</h2>
          <p>Ingrese la placa para ver el historial y registrar nuevo consumo</p>
        </div>
        <div class="search-box">
          <div class="search-input-wrapper">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="search-icon">
              <path d="M21 21L16.65 16.65M11 19C6.58172 19 3 15.4183 3 11C3 6.58172 6.58172 3 11 3C15.4183 3 19 6.58172 19 11C19 15.4183 15.4183 19 11 19Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <input
              type="text"
              [(ngModel)]="searchPlate"
              (keyup.enter)="onSearch()"
              placeholder="Ingrese placa (ej: AAQ-303, CJN-863...)"
              class="search-input"
            />
          </div>
          <button class="search-btn" (click)="onSearch()" [disabled]="searching">
            <span *ngIf="!searching">Buscar</span>
            <span *ngIf="searching">Buscando...</span>
          </button>
        </div>
        <div *ngIf="notFound" class="error-message">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M12 8V12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M12 16H12.01" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          No se encontró ningún vehículo con la placa "{{ searchPlate }}"
        </div>
        <div *ngIf="foundVehicle" class="vehicle-preview-card" (click)="goToVehicle(foundVehicle.plate)">
          <div class="vehicle-preview-header">
            <div class="vehicle-badge">{{ foundVehicle.type }}</div>
            <span class="vehicle-date">Último registro: {{ foundVehicle.lastDate }}</span>
          </div>
          <div class="vehicle-preview-body">
            <div class="vehicle-plate-block">
              <span class="label">Placa</span>
              <span class="plate-number">{{ foundVehicle.plate }}</span>
              <span class="vehicle-unit">{{ foundVehicle.unit }}</span>
            </div>
            <div class="vehicle-stats">
              <div class="stat-item">
                <div class="stat-icon km-icon">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4 14L8 6H16L20 14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M4 14V18C4 18.5304 4.21071 19.0391 4.58579 19.4142C4.96086 19.7893 5.46957 20 6 20H7C7.53043 20 8.03914 19.7893 8.41421 19.4142C8.78929 19.0391 9 18.5304 9 18V17H15V18C15 18.5304 15.2107 19.0391 15.5858 19.4142C15.9609 19.7893 16.4696 20 17 20H18C18.5304 20 19.0391 19.7893 19.4142 19.4142C19.7893 19.0391 20 18.5304 20 18V14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <circle cx="6.5" cy="14.5" r="1.5" stroke="currentColor" stroke-width="2"/>
                    <circle cx="17.5" cy="14.5" r="1.5" stroke="currentColor" stroke-width="2"/>
                  </svg>
                </div>
                <div class="stat-content">
                  <span class="stat-label">Kilometraje</span>
                  <span class="stat-value">{{ foundVehicle.lastKilometraje.toLocaleString() }} <small>km</small></span>
                </div>
              </div>
              <div class="stat-item">
                <div class="stat-icon hr-icon">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
                    <path d="M12 6V12L16 14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                  </svg>
                </div>
                <div class="stat-content">
                  <span class="stat-label">Horómetro</span>
                  <span class="stat-value">{{ foundVehicle.lastHorometro.toLocaleString() }} <small>hrs</small></span>
                </div>
              </div>
              <div class="stat-item">
                <div class="stat-icon fuel-icon">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 22V4C3 3.44772 3.44772 3 4 3H14C14.5523 3 15 3.44772 15 4V22" stroke="currentColor" stroke-width="2"/>
                    <path d="M3 22H15" stroke="currentColor" stroke-width="2"/>
                    <path d="M15 9H18L21 12V18C21 18.5523 20.5523 19 20 19H15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M6 10V14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                    <path d="M9 8V16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                    <path d="M12 11V13" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                  </svg>
                </div>
                <div class="stat-content">
                  <span class="stat-label">Galones</span>
                  <span class="stat-value">{{ foundVehicle.lastGalones }} <small>gl</small></span>
                </div>
              </div>
            </div>
          </div>
          <div class="vehicle-preview-footer">
            <span>Ver detalles y nuevo registro</span>
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 18L15 12L9 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
        </div>
      </div>

      <div class="vehicles-grid-section">
        <div class="section-header">
          <h3>Vehículos Recientes</h3>
          <span class="vehicles-count">{{ vehiclesList$ | async | length }} vehículos</span>
        </div>
        <div class="vehicles-grid">
          <div
            class="vehicle-card"
            *ngFor="let vehicle of vehiclesList$ | async | slice:0:8"
            (click)="goToVehicle(vehicle.plate)"
          >
            <div class="vehicle-card-top">
              <div class="type-badge">{{ vehicle.type }}</div>
              <span class="plate-text">{{ vehicle.plate }}</span>
            </div>
            <div class="vehicle-card-unit">{{ vehicle.unit }}</div>
            <div class="vehicle-card-stats">
              <div class="mini-stat">
                <span class="mini-label">KM</span>
                <span class="mini-value">{{ vehicle.lastKilometraje.toLocaleString() }}</span>
              </div>
              <div class="mini-stat">
                <span class="mini-label">HRS</span>
                <span class="mini-value">{{ vehicle.lastHorometro.toLocaleString() }}</span>
              </div>
              <div class="mini-stat">
                <span class="mini-label">GL</span>
                <span class="mini-value">{{ vehicle.lastGalones }}</span>
              </div>
            </div>
            <div class="vehicle-card-date">{{ vehicle.lastDate }}</div>
          </div>
        </div>
      </div>

      <div class="tips-section">
        <h3>Placas de prueba</h3>
        <div class="tips-chips">
          <span class="chip" *ngFor="let chip of suggestedPlates" (click)="setPlate(chip)">
            {{ chip }}
          </span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .home-page {
      display: flex;
      flex-direction: column;
      gap: 2.5rem;
    }
    .search-section {
      background: white;
      border-radius: 20px;
      padding: 2.5rem;
      box-shadow: 0 4px 24px rgba(0,0,0,0.06);
    }
    .search-header {
      text-align: center;
      margin-bottom: 2rem;
      h2 {
        margin: 0 0 0.5rem 0;
        font-size: 1.875rem;
        font-weight: 700;
        color: #1e293b;
      }
      p {
        margin: 0;
        color: #64748b;
        font-size: 1rem;
      }
    }
    .search-box {
      display: flex;
      gap: 0.75rem;
      max-width: 640px;
      margin: 0 auto;
    }
    .search-input-wrapper {
      flex: 1;
      position: relative;
      display: flex;
      align-items: center;
    }
    .search-icon {
      position: absolute;
      left: 1rem;
      width: 22px;
      height: 22px;
      color: #94a3b8;
    }
    .search-input {
      width: 100%;
      padding: 1rem 1rem 1rem 3rem;
      font-size: 1rem;
      border: 2px solid #e2e8f0;
      border-radius: 12px;
      outline: none;
      transition: all 0.2s;
      font-family: inherit;
      text-transform: uppercase;
      &::placeholder { color: #94a3b8; text-transform: none; }
      &:focus {
        border-color: #3b82f6;
        box-shadow: 0 0 0 4px rgba(59,130,246,0.1);
      }
    }
    .search-btn {
      padding: 1rem 2rem;
      font-size: 1rem;
      font-weight: 600;
      color: white;
      background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
      border: none;
      border-radius: 12px;
      cursor: pointer;
      transition: all 0.2s;
      white-space: nowrap;
      &:hover:not(:disabled) {
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(59,130,246,0.4);
      }
      &:disabled { opacity: 0.6; cursor: not-allowed; }
    }
    .error-message {
      max-width: 640px;
      margin: 1.5rem auto 0;
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 1rem 1.25rem;
      background: #fef2f2;
      border: 1px solid #fecaca;
      border-radius: 10px;
      color: #b91c1c;
      font-weight: 500;
      svg { width: 22px; height: 22px; flex-shrink: 0; }
    }
    .vehicle-preview-card {
      max-width: 720px;
      margin: 2rem auto 0;
      background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
      border: 1px solid #bae6fd;
      border-radius: 16px;
      overflow: hidden;
      cursor: pointer;
      transition: all 0.25s;
      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 24px rgba(14,165,233,0.15);
      }
    }
    .vehicle-preview-header {
      padding: 1rem 1.5rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: rgba(255,255,255,0.6);
      border-bottom: 1px solid #bae6fd;
    }
    .vehicle-badge {
      padding: 0.35rem 0.85rem;
      background: #0ea5e9;
      color: white;
      font-size: 0.75rem;
      font-weight: 600;
      border-radius: 20px;
    }
    .vehicle-date {
      font-size: 0.85rem;
      color: #475569;
      font-weight: 500;
    }
    .vehicle-preview-body {
      padding: 1.5rem;
      display: grid;
      grid-template-columns: auto 1fr;
      gap: 2rem;
      align-items: center;
    }
    .vehicle-plate-block {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 1.5rem 2rem;
      background: white;
      border-radius: 12px;
      border: 2px solid #cbd5e1;
      box-shadow: 0 2px 8px rgba(0,0,0,0.04);
      .label {
        font-size: 0.7rem;
        text-transform: uppercase;
        letter-spacing: 0.1em;
        color: #64748b;
        font-weight: 600;
      }
      .plate-number {
        font-size: 2rem;
        font-weight: 800;
        color: #1e293b;
        letter-spacing: 0.05em;
      }
      .vehicle-unit {
        margin-top: 0.25rem;
        font-size: 0.9rem;
        color: #475569;
        font-weight: 500;
      }
    }
    .vehicle-stats {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1rem;
    }
    .stat-item {
      display: flex;
      gap: 0.75rem;
      align-items: center;
      padding: 1rem;
      background: white;
      border-radius: 12px;
    }
    .stat-icon {
      width: 44px;
      height: 44px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      svg { width: 22px; height: 22px; }
    }
    .km-icon { background: #eff6ff; color: #2563eb; }
    .hr-icon { background: #fef3c7; color: #d97706; }
    .fuel-icon { background: #f0fdf4; color: #16a34a; }
    .stat-content { display: flex; flex-direction: column; }
    .stat-label { font-size: 0.75rem; color: #64748b; font-weight: 500; }
    .stat-value {
      font-size: 1.15rem;
      font-weight: 700;
      color: #1e293b;
      small { font-size: 0.75rem; font-weight: 500; color: #64748b; }
    }
    .vehicle-preview-footer {
      padding: 1rem 1.5rem;
      background: rgba(14,165,233,0.1);
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 0.5rem;
      color: #0369a1;
      font-weight: 600;
      font-size: 0.9rem;
      svg { width: 18px; height: 18px; }
    }
    .vehicles-grid-section { }
    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.25rem;
      h3 {
        margin: 0;
        font-size: 1.25rem;
        font-weight: 700;
        color: #1e293b;
      }
      .vehicles-count {
        padding: 0.35rem 0.85rem;
        background: #e2e8f0;
        border-radius: 20px;
        font-size: 0.8rem;
        font-weight: 600;
        color: #475569;
      }
    }
    .vehicles-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
      gap: 1rem;
    }
    .vehicle-card {
      background: white;
      border-radius: 14px;
      padding: 1.25rem;
      cursor: pointer;
      transition: all 0.2s;
      border: 1px solid #f1f5f9;
      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 20px rgba(0,0,0,0.08);
        border-color: #cbd5e1;
      }
    }
    .vehicle-card-top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.5rem;
    }
    .type-badge {
      padding: 0.25rem 0.6rem;
      background: #f1f5f9;
      color: #475569;
      font-size: 0.65rem;
      font-weight: 600;
      border-radius: 12px;
    }
    .plate-text {
      font-weight: 700;
      color: #1e293b;
      font-size: 0.95rem;
    }
    .vehicle-card-unit {
      font-size: 0.85rem;
      color: #64748b;
      margin-bottom: 1rem;
    }
    .vehicle-card-stats {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 0.5rem;
      padding-top: 0.75rem;
      border-top: 1px solid #f1f5f9;
    }
    .mini-stat {
      display: flex;
      flex-direction: column;
      gap: 0.15rem;
    }
    .mini-label {
      font-size: 0.65rem;
      color: #94a3b8;
      font-weight: 600;
    }
    .mini-value {
      font-size: 0.85rem;
      font-weight: 700;
      color: #334155;
    }
    .vehicle-card-date {
      margin-top: 0.75rem;
      padding-top: 0.75rem;
      border-top: 1px solid #f1f5f9;
      font-size: 0.75rem;
      color: #94a3b8;
    }
    .tips-section {
      background: white;
      border-radius: 16px;
      padding: 1.5rem;
      box-shadow: 0 2px 12px rgba(0,0,0,0.04);
      h3 {
        margin: 0 0 1rem 0;
        font-size: 1rem;
        font-weight: 600;
        color: #1e293b;
      }
    }
    .tips-chips {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
    }
    .chip {
      padding: 0.5rem 1rem;
      background: #f1f5f9;
      border-radius: 20px;
      font-size: 0.85rem;
      font-weight: 600;
      color: #475569;
      cursor: pointer;
      transition: all 0.15s;
      border: 1px solid transparent;
      &:hover {
        background: #dbeafe;
        color: #1d4ed8;
        border-color: #bfdbfe;
      }
    }
  `]
})
export class HomeComponent {
  searchPlate = '';
  searching = false;
  notFound = false;
  foundVehicle: Vehicle | null = null;
  vehiclesList$: Observable<Vehicle[]>;
  suggestedPlates = ['AAQ-303', 'CJN-863', 'CHN-817', 'BXR-897', 'CHM-812', 'DFC-918'];

  constructor(
    private vehicleService: VehicleService,
    private router: Router
  ) {
    this.vehiclesList$ = this.vehicleService.getAllVehicles();
  }

  onSearch() {
    if (!this.searchPlate.trim()) return;
    this.searching = true;
    this.notFound = false;
    this.foundVehicle = null;

    this.vehicleService.searchVehicle(this.searchPlate)
      .pipe(catchError(() => of(null)))
      .subscribe(vehicle => {
        this.searching = false;
        if (vehicle) {
          this.foundVehicle = vehicle;
        } else {
          this.notFound = true;
        }
      });
  }

  goToVehicle(plate: string) {
    this.router.navigate(['/vehicle', plate]);
  }

  setPlate(plate: string) {
    this.searchPlate = plate;
    this.onSearch();
  }
}
