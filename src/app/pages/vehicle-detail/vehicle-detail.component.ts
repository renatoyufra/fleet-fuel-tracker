import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { VehicleService } from '../../services/vehicle.service';
import { Vehicle, FuelRecord } from '../../models/vehicle.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-vehicle-detail',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="vehicle-detail-page" *ngIf="vehicle">
      <div class="page-header">
        <button class="back-btn" (click)="goBack()">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 12H5M12 19L5 12L12 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          Volver
        </button>
        <div class="page-title-group">
          <h2 class="page-title">Detalle del Vehículo</h2>
          <span class="page-subtitle">Gestión de kilometraje y horómetro</span>
        </div>
      </div>

      <div class="main-card">
        <div class="card-header">
          <div class="vehicle-identity">
            <div class="plate-display">
              <span class="plate-label">PLACA</span>
              <span class="plate-number">{{ vehicle.plate }}</span>
            </div>
            <div class="vehicle-info">
              <h3 class="vehicle-name">{{ vehicle.unit }}</h3>
              <span class="vehicle-type">{{ vehicle.type }}</span>
            </div>
          </div>
          <div class="vehicle-actions">
            <button
              class="tab-btn"
              [class.active]="activeTab === 'overview'"
              (click)="activeTab = 'overview'"
            >
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 12L12 3L21 12M5 10V20C5 20.5304 5.21071 21.0391 5.58579 21.4142C5.96086 21.7893 6.46957 22 7 22H17C17.5304 22 18.0391 21.7893 18.4142 21.4142C18.7893 21.0391 19 20.5304 19 20V10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              Resumen
            </button>
            <button
              class="tab-btn"
              [class.active]="activeTab === 'new'"
              (click)="activeTab = 'new'"
            >
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 5V19M5 12H19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              Nuevo Registro
            </button>
            <button
              class="tab-btn"
              [class.active]="activeTab === 'history'"
              (click)="activeTab = 'history'"
            >
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 8V12L15 14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M3.05005 11C3.28001 7.06999 6.47001 3.89998 10.42 3.89998C13.74 3.89998 16.65 5.72999 18.26 8.46998L21 11" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M20.95 13C20.72 16.93 17.53 20.1 13.58 20.1C10.26 20.1 7.34998 18.27 5.73998 15.53L3.00005 13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              Historial
            </button>
          </div>
        </div>

        <div class="card-body">
          <div class="tab-content" *ngIf="activeTab === 'overview'">
            <div class="stats-grid">
              <div class="stat-card km-card">
                <div class="stat-card-header">
                  <div class="stat-icon-wrap">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M4 14L8 6H16L20 14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      <path d="M4 14V18C4 18.5304 4.21071 19.0391 4.58579 19.4142C4.96086 19.7893 5.46957 20 6 20H7C7.53043 20 8.03914 19.7893 8.41421 19.4142C8.78929 19.0391 9 18.5304 9 18V17H15V18C15 18.5304 15.2107 19.0391 15.5858 19.4142C15.9609 19.7893 16.4696 20 17 20H18C18.5304 20 19.0391 19.7893 19.4142 19.4142C19.7893 19.0391 20 18.5304 20 18V14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      <circle cx="6.5" cy="14.5" r="1.5" stroke="currentColor" stroke-width="2"/>
                      <circle cx="17.5" cy="14.5" r="1.5" stroke="currentColor" stroke-width="2"/>
                    </svg>
                  </div>
                  <span class="stat-trend" *ngIf="lastRecord?.kmRecorridos">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M7 17L17 7M17 7H8M17 7V16" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    +{{ lastRecord.kmRecorridos }} km
                  </span>
                </div>
                <div class="stat-card-value">
                  {{ vehicle.lastKilometraje.toLocaleString() }}
                  <span class="unit">km</span>
                </div>
                <div class="stat-card-label">Kilometraje Actual</div>
              </div>

              <div class="stat-card hr-card">
                <div class="stat-card-header">
                  <div class="stat-icon-wrap">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
                      <path d="M12 6V12L16 14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                    </svg>
                  </div>
                  <span class="stat-trend" *ngIf="lastRecord?.horasTrabajadas">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M7 17L17 7M17 7H8M17 7V16" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    +{{ lastRecord.horasTrabajadas }} hrs
                  </span>
                </div>
                <div class="stat-card-value">
                  {{ vehicle.lastHorometro.toLocaleString() }}
                  <span class="unit">hrs</span>
                </div>
                <div class="stat-card-label">Horómetro Actual</div>
              </div>

              <div class="stat-card fuel-card">
                <div class="stat-card-header">
                  <div class="stat-icon-wrap">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M3 22V4C3 3.44772 3.44772 3 4 3H14C14.5523 3 15 3.44772 15 4V22" stroke="currentColor" stroke-width="2"/>
                      <path d="M3 22H15" stroke="currentColor" stroke-width="2"/>
                      <path d="M15 9H18L21 12V18C21 18.5523 20.5523 19 20 19H15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </div>
                </div>
                <div class="stat-card-value">
                  {{ vehicle.lastGalones }}
                  <span class="unit">gl</span>
                </div>
                <div class="stat-card-label">Última Recarga</div>
              </div>
            </div>

            <div class="info-section">
              <div class="info-block">
                <h4>Información General</h4>
                <div class="info-grid">
                  <div class="info-item">
                    <span class="info-label">Responsable</span>
                    <span class="info-value">{{ vehicle.responsable || 'No asignado' }}</span>
                  </div>
                  <div class="info-item">
                    <span class="info-label">Fecha último registro</span>
                    <span class="info-value">{{ vehicle.lastDate }}</span>
                  </div>
                  <div class="info-item">
                    <span class="info-label">Total registros</span>
                    <span class="info-value">{{ (vehicleRecords$ | async)?.length || 0 }}</span>
                  </div>
                </div>
              </div>

              <div class="info-block" *ngIf="lastRecord && (lastRecord.kmRecorridos || lastRecord.horasTrabajadas)">
                <h4>Consumo Promedio - Último Registro</h4>
                <div class="consumo-grid">
                  <div class="consumo-item" *ngIf="lastRecord.consumoKm">
                    <div class="consumo-badge" [ngClass]="getConsumoClass(lastRecord.consumoKm, 'km')">
                      {{ getConsumoStatus(lastRecord.consumoKm, 'km') }}
                    </div>
                    <div class="consumo-value">{{ lastRecord.consumoKm }} <small>gl/km</small></div>
                    <div class="consumo-label">Consumo / Kilómetro</div>
                    <div class="consumo-range">Rango óptimo: 3-6 gl/km</div>
                  </div>
                  <div class="consumo-item" *ngIf="lastRecord.consumoHora">
                    <div class="consumo-badge" [ngClass]="getConsumoClass(lastRecord.consumoHora, 'hr')">
                      {{ getConsumoStatus(lastRecord.consumoHora, 'hr') }}
                    </div>
                    <div class="consumo-value">{{ lastRecord.consumoHora }} <small>gl/hr</small></div>
                    <div class="consumo-label">Consumo / Hora</div>
                    <div class="consumo-range">Rango óptimo: 3-5 gl/hr</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="tab-content" *ngIf="activeTab === 'new'">
            <div class="form-section">
              <div class="form-header">
                <div>
                  <h4>Nuevo Registro de Combustible</h4>
                  <p>Ingrese los datos de la nueva recarga</p>
                </div>
              </div>

              <div class="form-alert" *ngIf="successMessage">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22 11.08V12C21.9988 14.1564 21.3005 16.2547 20.0093 17.9818C18.7182 19.709 16.9033 20.9725 14.8354 21.5839C12.7674 22.1953 10.5573 22.1219 8.53447 21.3746C6.51168 20.6273 4.78465 19.2461 3.61096 17.4371C2.43727 15.628 1.87979 13.4881 2.02168 11.3363C2.16356 9.18456 2.99721 7.13631 4.39828 5.49706C5.79935 3.85781 7.69279 2.71537 9.79619 2.24013C11.8996 1.7649 14.1003 1.98232 16.07 2.85999" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M22 4L12 14.01L9 11.01" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                {{ successMessage }}
              </div>

              <form class="record-form" (ngSubmit)="onSubmit()">
                <div class="form-row">
                  <div class="form-group">
                    <label for="kilometraje">Kilometraje Actual <span class="required">*</span></label>
                    <input
                      type="number"
                      id="kilometraje"
                      name="kilometraje"
                      [(ngModel)]="newRecord.kilometraje"
                      [min]="vehicle.lastKilometraje"
                      step="1"
                      placeholder="Ingrese kilometraje"
                      required
                    />
                    <span class="form-hint">Anterior: {{ vehicle.lastKilometraje.toLocaleString() }} km</span>
                    <span class="diff-hint" *ngIf="newRecord.kilometraje > vehicle.lastKilometraje">
                      +{{ (newRecord.kilometraje - vehicle.lastKilometraje).toLocaleString() }} km recorridos
                    </span>
                  </div>

                  <div class="form-group">
                    <label for="horometro">Horómetro Actual <span class="required">*</span></label>
                    <input
                      type="number"
                      id="horometro"
                      name="horometro"
                      [(ngModel)]="newRecord.horometro"
                      [min]="vehicle.lastHorometro"
                      step="0.1"
                      placeholder="Ingrese horómetro"
                      required
                    />
                    <span class="form-hint">Anterior: {{ vehicle.lastHorometro.toLocaleString() }} hrs</span>
                    <span class="diff-hint" *ngIf="newRecord.horometro > vehicle.lastHorometro">
                      +{{ (newRecord.horometro - vehicle.lastHorometro).toLocaleString() }} hrs trabajadas
                    </span>
                  </div>
                </div>

                <div class="form-row">
                  <div class="form-group">
                    <label for="galones">Galones Recargados <span class="required">*</span></label>
                    <input
                      type="number"
                      id="galones"
                      name="galones"
                      [(ngModel)]="newRecord.galones"
                      min="0"
                      step="0.1"
                      placeholder="Ingrese galones"
                      required
                    />
                    <span class="form-hint">Última recarga: {{ vehicle.lastGalones }} gl</span>
                  </div>

                  <div class="form-group">
                    <label for="fecha">Fecha <span class="required">*</span></label>
                    <input
                      type="date"
                      id="fecha"
                      name="fecha"
                      [(ngModel)]="newRecord.fecha"
                      required
                    />
                  </div>
                </div>

                <div class="form-row">
                  <div class="form-group">
                    <label for="turno">Turno <span class="required">*</span></label>
                    <select
                      id="turno"
                      name="turno"
                      [(ngModel)]="newRecord.turno"
                      required
                    >
                      <option value="">Seleccione turno</option>
                      <option value="DIA">Día</option>
                      <option value="NOCHE">Noche</option>
                      <option value="TURNO 1">Turno 1</option>
                      <option value="TURNO 2">Turno 2</option>
                    </select>
                  </div>

                  <div class="form-group">
                    <label for="responsable">Responsable <span class="required">*</span></label>
                    <input
                      type="text"
                      id="responsable"
                      name="responsable"
                      [(ngModel)]="newRecord.responsable"
                      placeholder="Nombre del responsable"
                      required
                    />
                  </div>
                </div>

                <div class="form-actions">
                  <button type="button" class="btn-secondary" (click)="resetForm()">Limpiar Formulario</button>
                  <button type="submit" class="btn-primary" [disabled]="!isFormValid()">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H16L21 8V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      <path d="M17 21V13H7V21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      <path d="M7 3V8H15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    Guardar Registro
                  </button>
                </div>
              </form>
            </div>
          </div>

          <div class="tab-content" *ngIf="activeTab === 'history'">
            <div class="history-section">
              <div class="history-header">
                <div>
                  <h4>Historial de Registros</h4>
                  <p>Registro completo de recargas y consumos</p>
                </div>
                <div class="history-summary">
                  <div class="summary-item">
                    <span class="summary-label">Total Registros</span>
                    <span class="summary-value">{{ (vehicleRecords$ | async)?.length || 0 }}</span>
                  </div>
                </div>
              </div>

              <div class="history-table-container">
                <table class="history-table" *ngIf="(vehicleRecords$ | async)?.length; else noRecords">
                  <thead>
                    <tr>
                      <th>Fecha</th>
                      <th>Turno</th>
                      <th>Kilometraje</th>
                      <th>Horómetro</th>
                      <th>Galones</th>
                      <th>KM Rec.</th>
                      <th>Horas Rec.</th>
                      <th>Cons. KM</th>
                      <th>Cons. HRS</th>
                      <th>Responsable</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr *ngFor="let record of vehicleRecords$ | async" [ngClass]="{'latest': record.id === lastRecord?.id}">
                      <td class="td-date">
                        <span class="date-badge-small">{{ record.fecha }}</span>
                      </td>
                      <td>
                        <span class="turno-badge" [ngClass]="record.turno.toLowerCase()">{{ record.turno }}</span>
                      </td>
                      <td class="td-number">{{ record.kilometraje.toLocaleString() }} <small>km</small></td>
                      <td class="td-number">{{ record.horometro.toLocaleString() }} <small>hrs</small></td>
                      <td class="td-number td-fuel">{{ record.galones }} <small>gl</small></td>
                      <td class="td-number td-diff" *ngIf="record.kmRecorridos">+{{ record.kmRecorridos }}</td>
                      <td class="td-empty" *ngIf="!record.kmRecorridos">-</td>
                      <td class="td-number td-diff" *ngIf="record.horasTrabajadas">+{{ record.horasTrabajadas }}</td>
                      <td class="td-empty" *ngIf="!record.horasTrabajadas">-</td>
                      <td class="td-number">
                        <span *ngIf="record.consumoKm" class="consumo-tag" [ngClass]="getConsumoClass(record.consumoKm, 'km')">
                          {{ record.consumoKm }}
                        </span>
                        <span *ngIf="!record.consumoKm">-</span>
                      </td>
                      <td class="td-number">
                        <span *ngIf="record.consumoHora" class="consumo-tag" [ngClass]="getConsumoClass(record.consumoHora, 'hr')">
                          {{ record.consumoHora }}
                        </span>
                        <span *ngIf="!record.consumoHora">-</span>
                      </td>
                      <td class="td-responsible">{{ record.responsable }}</td>
                    </tr>
                  </tbody>
                </table>
                <ng-template #noRecords>
                  <div class="empty-state">
                    <div class="empty-icon">
                      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9 12H15M12 9V15M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>
                    </div>
                    <h5>No hay registros aún</h5>
                    <p>Crea el primer registro de este vehículo en la pestaña "Nuevo Registro"</p>
                  </div>
                </ng-template>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="not-found-state" *ngIf="!vehicle && !loading">
      <div class="not-found-icon">
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
          <path d="M8 15C8.73687 14.3516 9.65157 14.0002 10.6 14C11.7776 13.9998 12.8187 14.5565 13.4 15.5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          <path d="M9 9H9.01" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          <path d="M15 9H15.01" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
      </div>
      <h3>Vehículo no encontrado</h3>
      <p>No se encontró ningún vehículo con la placa especificada</p>
      <button class="back-btn-primary" (click)="goBack()">
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M19 12H5M12 19L5 12L12 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        Volver a la búsqueda
      </button>
    </div>
  `,
  styles: [`
    .vehicle-detail-page { display: flex; flex-direction: column; gap: 1.5rem; }
    .page-header {
      display: flex;
      align-items: center;
      gap: 1.5rem;
    }
    .back-btn {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.65rem 1rem;
      background: white;
      border: 1px solid #e2e8f0;
      border-radius: 10px;
      color: #475569;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.15s;
      font-size: 0.9rem;
      svg { width: 18px; height: 18px; }
      &:hover {
        background: #f8fafc;
        border-color: #cbd5e1;
      }
    }
    .page-title-group {
      h2 { margin: 0; font-size: 1.5rem; font-weight: 700; color: #1e293b; }
      span { font-size: 0.875rem; color: #64748b; }
    }
    .main-card {
      background: white;
      border-radius: 20px;
      overflow: hidden;
      box-shadow: 0 4px 24px rgba(0,0,0,0.06);
    }
    .card-header {
      padding: 1.5rem 2rem;
      background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
      border-bottom: 1px solid #e2e8f0;
    }
    .vehicle-identity {
      display: flex;
      align-items: center;
      gap: 1.5rem;
      margin-bottom: 1.5rem;
    }
    .plate-display {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 1rem 1.75rem;
      background: linear-gradient(180deg, #1e40af 0%, #1e3a8a 100%);
      border-radius: 12px;
      color: white;
      .plate-label {
        font-size: 0.65rem;
        letter-spacing: 0.2em;
        font-weight: 600;
        opacity: 0.8;
      }
      .plate-number {
        font-size: 1.75rem;
        font-weight: 800;
        letter-spacing: 0.1em;
      }
    }
    .vehicle-info {
      h3 { margin: 0 0 0.25rem 0; font-size: 1.5rem; font-weight: 700; color: #1e293b; }
      span { font-size: 0.9rem; color: #64748b; padding: 0.25rem 0.75rem; background: #e2e8f0; border-radius: 6px; }
    }
    .vehicle-actions {
      display: flex;
      gap: 0.5rem;
      flex-wrap: wrap;
    }
    .tab-btn {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.65rem 1.25rem;
      background: white;
      border: 1px solid #e2e8f0;
      border-radius: 10px;
      color: #64748b;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.15s;
      font-size: 0.875rem;
      svg { width: 18px; height: 18px; }
      &:hover { background: #f8fafc; }
      &.active {
        background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
        color: white;
        border-color: transparent;
        box-shadow: 0 2px 8px rgba(59,130,246,0.3);
      }
    }
    .card-body { padding: 2rem; }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
      gap: 1.25rem;
      margin-bottom: 2rem;
    }
    .stat-card {
      padding: 1.5rem;
      border-radius: 16px;
      position: relative;
      overflow: hidden;
    }
    .stat-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 4px;
      height: 100%;
    }
    .km-card {
      background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
      &::before { background: #2563eb; }
      .stat-icon-wrap { background: #3b82f6; color: white; }
      .stat-trend { color: #1d4ed8; background: #bfdbfe; }
    }
    .hr-card {
      background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%);
      &::before { background: #d97706; }
      .stat-icon-wrap { background: #f59e0b; color: white; }
      .stat-trend { color: #b45309; background: #fde68a; }
    }
    .fuel-card {
      background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
      &::before { background: #16a34a; }
      .stat-icon-wrap { background: #22c55e; color: white; }
    }
    .stat-card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.75rem;
    }
    .stat-icon-wrap {
      width: 44px;
      height: 44px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      svg { width: 22px; height: 22px; }
    }
    .stat-trend {
      display: flex;
      align-items: center;
      gap: 0.25rem;
      padding: 0.3rem 0.6rem;
      border-radius: 20px;
      font-size: 0.75rem;
      font-weight: 700;
      svg { width: 14px; height: 14px; }
    }
    .stat-card-value {
      font-size: 2.25rem;
      font-weight: 800;
      color: #1e293b;
      line-height: 1.1;
      .unit { font-size: 1rem; font-weight: 600; color: #64748b; margin-left: 0.25rem; }
    }
    .stat-card-label {
      margin-top: 0.25rem;
      font-size: 0.875rem;
      color: #64748b;
      font-weight: 500;
    }

    .info-section {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
      gap: 1.5rem;
    }
    .info-block {
      padding: 1.5rem;
      background: #f8fafc;
      border-radius: 14px;
      h4 {
        margin: 0 0 1rem 0;
        font-size: 1rem;
        font-weight: 700;
        color: #1e293b;
      }
    }
    .info-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
      gap: 1rem;
    }
    .info-item {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }
    .info-label {
      font-size: 0.75rem;
      color: #64748b;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .info-value {
      font-size: 0.95rem;
      font-weight: 600;
      color: #1e293b;
    }
    .consumo-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
    }
    .consumo-item {
      background: white;
      padding: 1.25rem;
      border-radius: 12px;
      text-align: center;
    }
    .consumo-badge {
      display: inline-block;
      padding: 0.3rem 0.75rem;
      border-radius: 20px;
      font-size: 0.75rem;
      font-weight: 700;
      margin-bottom: 0.75rem;
      &.optimo { background: #dcfce7; color: #166534; }
      &.regular { background: #fef3c7; color: #92400e; }
      &.alto { background: #fee2e2; color: #991b1b; }
    }
    .consumo-value {
      font-size: 1.75rem;
      font-weight: 800;
      color: #1e293b;
      small { font-size: 0.85rem; font-weight: 500; color: #64748b; }
    }
    .consumo-label {
      font-size: 0.85rem;
      color: #64748b;
      margin: 0.25rem 0 0.5rem;
    }
    .consumo-range {
      font-size: 0.75rem;
      color: #94a3b8;
    }

    .form-section { }
    .form-header {
      margin-bottom: 1.5rem;
      padding-bottom: 1rem;
      border-bottom: 1px solid #f1f5f9;
      h4 { margin: 0 0 0.25rem 0; font-size: 1.25rem; font-weight: 700; color: #1e293b; }
      p { margin: 0; color: #64748b; font-size: 0.9rem; }
    }
    .form-alert {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 1rem 1.25rem;
      background: #f0fdf4;
      border: 1px solid #bbf7d0;
      border-radius: 12px;
      color: #166534;
      font-weight: 600;
      margin-bottom: 1.5rem;
      svg { width: 22px; height: 22px; flex-shrink: 0; }
    }
    .record-form {
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
    }
    .form-row {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 1.25rem;
    }
    .form-group {
      display: flex;
      flex-direction: column;
      gap: 0.4rem;
    }
    .form-group label {
      font-size: 0.875rem;
      font-weight: 600;
      color: #334155;
      .required { color: #dc2626; }
    }
    .form-group input,
    .form-group select {
      padding: 0.75rem 1rem;
      font-size: 0.95rem;
      border: 2px solid #e2e8f0;
      border-radius: 10px;
      outline: none;
      transition: all 0.15s;
      font-family: inherit;
      background: white;
      &:focus {
        border-color: #3b82f6;
        box-shadow: 0 0 0 4px rgba(59,130,246,0.1);
      }
    }
    .form-hint {
      font-size: 0.75rem;
      color: #64748b;
    }
    .diff-hint {
      font-size: 0.8rem;
      color: #16a34a;
      font-weight: 700;
    }
    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 1rem;
      padding-top: 1rem;
      border-top: 1px solid #f1f5f9;
    }
    .btn-secondary {
      padding: 0.75rem 1.5rem;
      font-size: 0.9rem;
      font-weight: 600;
      background: white;
      border: 1px solid #cbd5e1;
      color: #475569;
      border-radius: 10px;
      cursor: pointer;
      transition: all 0.15s;
      &:hover { background: #f8fafc; }
    }
    .btn-primary {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1.75rem;
      font-size: 0.9rem;
      font-weight: 600;
      color: white;
      background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
      border: none;
      border-radius: 10px;
      cursor: pointer;
      transition: all 0.15s;
      svg { width: 18px; height: 18px; }
      &:hover:not(:disabled) {
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(59,130,246,0.4);
      }
      &:disabled { opacity: 0.5; cursor: not-allowed; }
    }

    .history-section { }
    .history-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 1.5rem;
      flex-wrap: wrap;
      gap: 1rem;
      h4 { margin: 0 0 0.25rem 0; font-size: 1.25rem; font-weight: 700; color: #1e293b; }
      p { margin: 0; color: #64748b; font-size: 0.9rem; }
    }
    .history-summary { display: flex; gap: 1rem; }
    .summary-item {
      padding: 0.65rem 1.25rem;
      background: #f1f5f9;
      border-radius: 10px;
      display: flex;
      flex-direction: column;
      gap: 0.1rem;
    }
    .summary-label { font-size: 0.7rem; color: #64748b; text-transform: uppercase; font-weight: 600; letter-spacing: 0.05em; }
    .summary-value { font-size: 1.15rem; font-weight: 800; color: #1e293b; }
    .history-table-container {
      background: #f8fafc;
      border-radius: 14px;
      overflow: hidden;
      border: 1px solid #e2e8f0;
    }
    .history-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 0.875rem;
    }
    .history-table thead {
      background: #e2e8f0;
    }
    .history-table th {
      padding: 0.85rem 1rem;
      text-align: left;
      font-weight: 700;
      color: #334155;
      font-size: 0.75rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .history-table td {
      padding: 0.85rem 1rem;
      border-bottom: 1px solid #e2e8f0;
      color: #334155;
    }
    .history-table tbody tr {
      transition: background 0.1s;
      &:hover { background: #f1f5f9; }
      &.latest { background: #eff6ff; }
    }
    .history-table tbody tr:last-child td { border-bottom: none; }
    .td-date { min-width: 110px; }
    .date-badge-small {
      padding: 0.25rem 0.6rem;
      background: white;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      font-size: 0.8rem;
      font-weight: 600;
      color: #475569;
    }
    .turno-badge {
      padding: 0.25rem 0.6rem;
      border-radius: 6px;
      font-size: 0.75rem;
      font-weight: 700;
      &.dia { background: #fef3c7; color: #92400e; }
      &.noche { background: #e0e7ff; color: #3730a3; }
      &.turno { background: #fce7f3; color: #9d174d; }
    }
    .td-number {
      font-weight: 600;
      font-family: 'Inter', monospace;
      small { font-size: 0.7rem; font-weight: 500; color: #64748b; }
    }
    .td-fuel {
      color: #16a34a;
      font-weight: 700;
    }
    .td-diff {
      color: #2563eb;
    }
    .td-empty { color: #cbd5e1; text-align: center; }
    .td-responsible {
      font-weight: 500;
      color: #475569;
    }
    .consumo-tag {
      display: inline-block;
      padding: 0.15rem 0.5rem;
      border-radius: 6px;
      font-size: 0.75rem;
      font-weight: 700;
      &.optimo { background: #dcfce7; color: #166534; }
      &.regular { background: #fef3c7; color: #92400e; }
      &.alto { background: #fee2e2; color: #991b1b; }
    }
    .empty-state {
      padding: 3rem 2rem;
      text-align: center;
    }
    .empty-icon {
      width: 64px;
      height: 64px;
      margin: 0 auto 1rem;
      border-radius: 50%;
      background: #f1f5f9;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #94a3b8;
      svg { width: 32px; height: 32px; }
    }
    .empty-state h5 {
      margin: 0 0 0.5rem 0;
      font-size: 1.1rem;
      font-weight: 700;
      color: #1e293b;
    }
    .empty-state p {
      margin: 0;
      color: #64748b;
    }
    .not-found-state {
      text-align: center;
      padding: 4rem 2rem;
      max-width: 480px;
      margin: 2rem auto;
    }
    .not-found-icon {
      width: 80px;
      height: 80px;
      margin: 0 auto 1.5rem;
      border-radius: 50%;
      background: #fef2f2;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #ef4444;
      svg { width: 40px; height: 40px; }
    }
    .not-found-state h3 {
      margin: 0 0 0.5rem 0;
      font-size: 1.5rem;
      font-weight: 700;
      color: #1e293b;
    }
    .not-found-state p {
      margin: 0 0 1.5rem 0;
      color: #64748b;
    }
    .back-btn-primary {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1.5rem;
      background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
      color: white;
      border: none;
      border-radius: 10px;
      font-weight: 600;
      cursor: pointer;
      svg { width: 18px; height: 18px; }
    }
  `]
})
export class VehicleDetailComponent implements OnInit {
  vehicle: Vehicle | null = null;
  loading = true;
  activeTab: 'overview' | 'new' | 'history' = 'overview';
  vehicleRecords$: Observable<FuelRecord[]>;
  lastRecord: FuelRecord | null = null;
  successMessage = '';

  newRecord = {
    kilometraje: 0,
    horometro: 0,
    galones: 0,
    fecha: new Date().toISOString().split('T')[0],
    turno: '',
    responsable: ''
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private vehicleService: VehicleService
  ) {
    this.vehicleRecords$ = this.vehicleService.getVehicleRecords('');
  }

  ngOnInit() {
    const plate = this.route.snapshot.paramMap.get('plate') || '';
    this.vehicleService.searchVehicle(plate).subscribe(vehicle => {
      this.vehicle = vehicle;
      this.loading = false;
      if (vehicle) {
        this.newRecord.kilometraje = vehicle.lastKilometraje;
        this.newRecord.horometro = vehicle.lastHorometro;
        this.newRecord.responsable = vehicle.responsable || '';
        this.vehicleRecords$ = this.vehicleService.getVehicleRecords(vehicle.plate);
        this.vehicleRecords$.subscribe(records => {
          this.lastRecord = records[0] || null;
        });
      }
    });
  }

  goBack() {
    this.router.navigate(['/']);
  }

  getConsumoClass(value: number, type: 'km' | 'hr'): string {
    if (type === 'km') {
      if (value >= 3 && value <= 6) return 'optimo';
      if (value < 3 || value <= 8) return 'regular';
      return 'alto';
    } else {
      if (value >= 3 && value <= 5) return 'optimo';
      if (value < 3 || value <= 7) return 'regular';
      return 'alto';
    }
  }

  getConsumoStatus(value: number, type: 'km' | 'hr'): string {
    const cls = this.getConsumoClass(value, type);
    if (cls === 'optimo') return 'ÓPTIMO';
    if (cls === 'regular') return 'REGULAR';
    return 'ALTO';
  }

  isFormValid(): boolean {
    return this.newRecord.kilometraje >= (this.vehicle?.lastKilometraje || 0)
      && this.newRecord.horometro >= (this.vehicle?.lastHorometro || 0)
      && this.newRecord.galones > 0
      && !!this.newRecord.fecha
      && !!this.newRecord.turno
      && !!this.newRecord.responsable.trim();
  }

  resetForm() {
    if (this.vehicle) {
      this.newRecord = {
        kilometraje: this.vehicle.lastKilometraje,
        horometro: this.vehicle.lastHorometro,
        galones: 0,
        fecha: new Date().toISOString().split('T')[0],
        turno: '',
        responsable: this.vehicle.responsable || ''
      };
    }
    this.successMessage = '';
  }

  onSubmit() {
    if (!this.vehicle || !this.isFormValid()) return;

    const fechaParts = this.newRecord.fecha.split('-');
    const formattedDate = `${fechaParts[2]}-${fechaParts[1]}-${fechaParts[0]}`;

    this.vehicleService.addRecord({
      plate: this.vehicle.plate,
      unit: this.vehicle.unit,
      kilometraje: this.newRecord.kilometraje,
      horometro: this.newRecord.horometro,
      galones: this.newRecord.galones,
      fecha: formattedDate,
      turno: this.newRecord.turno,
      responsable: this.newRecord.responsable.trim()
    }).subscribe(() => {
      this.vehicleService.searchVehicle(this.vehicle!.plate).subscribe(v => {
        if (v) {
          this.vehicle = v;
        }
      });
      this.successMessage = '¡Registro guardado exitosamente!';
      this.activeTab = 'history';
      setTimeout(() => { this.successMessage = ''; }, 4000);
    });
  }
}
