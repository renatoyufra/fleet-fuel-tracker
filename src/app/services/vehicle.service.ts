import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map, of } from 'rxjs';
import { Vehicle, FuelRecord } from '../models/vehicle.model';

@Injectable({
  providedIn: 'root'
})
export class VehicleService {
  private vehicles: Vehicle[] = [
    { plate: 'CJN-863', unit: 'Camioneta', type: 'Vehículo Ligero', lastKilometraje: 39011, lastHorometro: 13326.4, lastGalones: 14.5, lastDate: '11-08-2026', responsable: 'Yhon Segura' },
    { plate: '160-5', unit: 'Moto Guayandera', type: 'Motocicleta', lastKilometraje: 0, lastHorometro: 3554.1, lastGalones: 8.2, lastDate: '11-08-2026', responsable: 'Yhon Segura' },
    { plate: 'CCO-EVO-03', unit: 'Excavadora', type: 'Maquinaria Pesada', lastKilometraje: 4163.1, lastHorometro: 0, lastGalones: 8.5, lastDate: '11-08-2026', responsable: 'Yhon Segura' },
    { plate: 'ZQE-760', unit: 'Combi Neto', type: 'Vehículo Ligero', lastKilometraje: 0, lastHorometro: 6121.7, lastGalones: 16.5, lastDate: '11-08-2026', responsable: 'Yhon Segura' },
    { plate: 'RT-Hyundai', unit: 'Retro Excavadora', type: 'Maquinaria Pesada', lastKilometraje: 49402, lastHorometro: 2385.2, lastGalones: 29, lastDate: '11-08-2026', responsable: 'Yhon Segura' },
    { plate: 'BXR-897', unit: 'Volqueta', type: 'Vehículo Pesado', lastKilometraje: 51813, lastHorometro: 0, lastGalones: 23, lastDate: '11-08-2026', responsable: 'Yhon Segura' },
    { plate: 'CHN-817', unit: 'Volqueta', type: 'Vehículo Pesado', lastKilometraje: 11649, lastHorometro: 0, lastGalones: 41, lastDate: '11-08-2026', responsable: 'Yhon Segura' },
    { plate: 'CHN-998', unit: 'Cisterna', type: 'Vehículo Pesado', lastKilometraje: 45663.1, lastHorometro: 5443.2, lastGalones: 35.5, lastDate: '11-08-2026', responsable: 'Yhon Segura' },
    { plate: 'BUF-847', unit: 'Cisterna', type: 'Vehículo Pesado', lastKilometraje: 84359, lastHorometro: 7363.12, lastGalones: 46.5, lastDate: '11-08-2026', responsable: 'Yhon Segura' },
    { plate: 'VAW-827', unit: 'Volqueta', type: 'Vehículo Pesado', lastKilometraje: 56041, lastHorometro: 0, lastGalones: 24, lastDate: '11-08-2026', responsable: 'Yhon Segura' },
    { plate: 'CHK-755', unit: 'Volqueta', type: 'Vehículo Pesado', lastKilometraje: 59233, lastHorometro: 2029.2, lastGalones: 49.5, lastDate: '11-08-2026', responsable: 'Yhon Segura' },
    { plate: 'BLR-771', unit: 'Volqueta', type: 'Vehículo Pesado', lastKilometraje: 53414, lastHorometro: 0, lastGalones: 60, lastDate: '11-08-2026', responsable: 'Yhon Segura' },
    { plate: 'CHM-919', unit: 'Volqueta', type: 'Vehículo Pesado', lastKilometraje: 8433, lastHorometro: 0, lastGalones: 32, lastDate: '11-08-2026', responsable: 'Yhon Segura' },
    { plate: 'CHL-903', unit: 'Cisterna', type: 'Vehículo Pesado', lastKilometraje: 53546, lastHorometro: 0, lastGalones: 52, lastDate: '11-08-2026', responsable: 'Yhon Segura' },
    { plate: 'CHN-723', unit: 'Volqueta', type: 'Vehículo Pesado', lastKilometraje: 41145, lastHorometro: 0, lastGalones: 50, lastDate: '11-08-2026', responsable: 'Yhon Segura' },
    { plate: 'CHM-812', unit: 'Volqueta', type: 'Vehículo Pesado', lastKilometraje: 146108.7, lastHorometro: 6725, lastGalones: 41.5, lastDate: '11-08-2026', responsable: 'Yhon Segura' },
    { plate: 'DFC-917', unit: 'Volqueta', type: 'Vehículo Pesado', lastKilometraje: 54672, lastHorometro: 0, lastGalones: 46, lastDate: '11-08-2026', responsable: 'Yhon Segura' },
    { plate: 'CHP-762', unit: 'Volqueta', type: 'Vehículo Pesado', lastKilometraje: 47441, lastHorometro: 1652.5, lastGalones: 49.5, lastDate: '11-08-2026', responsable: 'Yhon Segura' },
    { plate: 'CHP-882', unit: 'Volqueta', type: 'Vehículo Pesado', lastKilometraje: 39371, lastHorometro: 0, lastGalones: 51.5, lastDate: '11-08-2026', responsable: 'Yhon Segura' },
    { plate: 'BZM-772', unit: 'Volqueta', type: 'Vehículo Pesado', lastKilometraje: 55907, lastHorometro: 0, lastGalones: 44.5, lastDate: '11-08-2026', responsable: 'Yhon Segura' },
    { plate: 'CHN-766', unit: 'Volqueta', type: 'Vehículo Pesado', lastKilometraje: 52512, lastHorometro: 0, lastGalones: 55.5, lastDate: '11-08-2026', responsable: 'Yhon Segura' },
    { plate: 'CHM-814', unit: 'Volqueta', type: 'Vehículo Pesado', lastKilometraje: 145678.5, lastHorometro: 11010.12, lastGalones: 31, lastDate: '11-08-2026', responsable: 'Yhon Segura' },
    { plate: 'DFC-918', unit: 'Volqueta', type: 'Vehículo Pesado', lastKilometraje: 224352.1, lastHorometro: 14247.56, lastGalones: 67.5, lastDate: '11-08-2026', responsable: 'Yhon Segura' },
    { plate: 'BBZ-792', unit: 'Volqueta', type: 'Vehículo Pesado', lastKilometraje: 55251, lastHorometro: 1333.5, lastGalones: 36, lastDate: '11-08-2026', responsable: 'Yhon Segura' },
    { plate: 'CFD-936', unit: 'Volqueta', type: 'Vehículo Pesado', lastKilometraje: 45734, lastHorometro: 0, lastGalones: 19, lastDate: '11-08-2026', responsable: 'Yhon Segura' },
    { plate: 'CHM-861', unit: 'Volqueta', type: 'Vehículo Pesado', lastKilometraje: 52632, lastHorometro: 2336.3, lastGalones: 40.5, lastDate: '11-08-2026', responsable: 'Yhon Segura' },
    { plate: 'TFG-854', unit: 'Volqueta', type: 'Vehículo Pesado', lastKilometraje: 47552, lastHorometro: 0, lastGalones: 41.5, lastDate: '11-08-2026', responsable: 'Yhon Segura' },
    { plate: 'CHM-882', unit: 'Volqueta', type: 'Vehículo Pesado', lastKilometraje: 53805, lastHorometro: 0, lastGalones: 61, lastDate: '11-08-2026', responsable: 'Yhon Segura' },
    { plate: 'CHL-861', unit: 'Volqueta', type: 'Vehículo Pesado', lastKilometraje: 0, lastHorometro: 1001.3, lastGalones: 8, lastDate: '11-08-2026', responsable: 'Yhon Segura' },
    { plate: 'CF-Fullen 1', unit: 'Volqueta', type: 'Vehículo Pesado', lastKilometraje: 0, lastHorometro: 1122.6, lastGalones: 8, lastDate: '11-08-2026', responsable: 'Yhon Segura' },
    { plate: 'CF-Fullen 2', unit: 'Volqueta', type: 'Vehículo Pesado', lastKilometraje: 0, lastHorometro: 5420.3, lastGalones: 35.5, lastDate: '11-08-2026', responsable: 'Yhon Segura' },
    { plate: 'MOT-07', unit: 'Moto Guayandera', type: 'Motocicleta', lastKilometraje: 0, lastHorometro: 3548.4, lastGalones: 46.5, lastDate: '11-08-2026', responsable: 'Yhon Segura' },
    { plate: 'CF-14', unit: 'Cargador Frontal', type: 'Maquinaria Pesada', lastKilometraje: 111051, lastHorometro: 0, lastGalones: 9.5, lastDate: '11-08-2026', responsable: 'Yhon Segura' },
    { plate: 'VDI-958', unit: 'Minibus', type: 'Vehículo Ligero', lastKilometraje: 111051, lastHorometro: 0, lastGalones: 9.5, lastDate: '11-08-2026', responsable: 'Yhon Segura' },
    { plate: 'AAQ-303', unit: 'Camion', type: 'Vehículo Pesado', lastKilometraje: 335593, lastHorometro: 1275.5, lastGalones: 40, lastDate: '14-08-2026', responsable: 'Operador Demo' }
  ];

  private recordsSubject = new BehaviorSubject<FuelRecord[]>(this.generateMockRecords());
  records$ = this.recordsSubject.asObservable();

  private generateMockRecords(): FuelRecord[] {
    const records: FuelRecord[] = [];
    let id = 1;

    const aaQ303Records: FuelRecord[] = [
      {
        id: id++,
        plate: 'AAQ-303',
        unit: 'Camion',
        kilometraje: 335560,
        horometro: 1265.5,
        galones: 50,
        fecha: '13-08-2026',
        responsable: 'Operador Demo',
        turno: 'DIA',
        kmRecorridos: 0,
        horasTrabajadas: 0,
        consumoKm: 0,
        consumoHora: 0
      },
      {
        id: id++,
        plate: 'AAQ-303',
        unit: 'Camion',
        kilometraje: 335593,
        horometro: 1275.5,
        galones: 40,
        fecha: '14-08-2026',
        responsable: 'Operador Demo',
        turno: 'DIA',
        kmRecorridos: 33,
        horasTrabajadas: 10,
        consumoKm: 3.6,
        consumoHora: 3.5
      }
    ];

    records.push(...aaQ303Records);

    const plates = ['CJN-863', 'CHN-817', 'BXR-897', 'CHM-812', 'DFC-918'];
    plates.forEach(plate => {
      const vehicle = this.vehicles.find(v => v.plate === plate);
      if (vehicle) {
        for (let i = 0; i < 5; i++) {
          const daysAgo = 5 - i;
          const fecha = new Date(2026, 7, 14 - daysAgo);
          const fechaStr = `${String(fecha.getDate()).padStart(2, '0')}-${String(fecha.getMonth() + 1).padStart(2, '0')}-${fecha.getFullYear()}`;
          const kmBase = vehicle.lastKilometraje - (5 - i) * 50;
          const hrBase = vehicle.lastHorometro > 0 ? vehicle.lastHorometro - (5 - i) * 8 : 0;
          const prevKm = i > 0 ? records[records.length - 1].kilometraje : kmBase - 50;
          const prevHr = i > 0 ? records[records.length - 1].horometro : hrBase - 8;
          const galones = 30 + Math.floor(Math.random() * 30);
          const kmRec = kmBase - prevKm;
          const hrRec = hrBase - prevHr;

          records.push({
            id: id++,
            plate: plate,
            unit: vehicle.unit,
            kilometraje: kmBase,
            horometro: hrBase,
            galones: galones,
            fecha: fechaStr,
            responsable: vehicle.responsable || 'Yhon Segura',
            turno: 'DIA',
            kmRecorridos: kmRec > 0 ? kmRec : 0,
            horasTrabajadas: hrRec > 0 ? hrRec : 0,
            consumoKm: kmRec > 0 ? +(galones / kmRec).toFixed(2) : 0,
            consumoHora: hrRec > 0 ? +(galones / hrRec).toFixed(2) : 0
          });
        }
      }
    });

    return records;
  }

  searchVehicle(plate: string): Observable<Vehicle | null> {
    const normalizedPlate = plate.trim().toUpperCase();
    const vehicle = this.vehicles.find(v =>
      v.plate.toUpperCase().replace(/[\s-]/g, '').includes(normalizedPlate.replace(/[\s-]/g, '')) ||
      v.plate.toUpperCase() === normalizedPlate
    );
    return of(vehicle || null);
  }

  getAllVehicles(): Observable<Vehicle[]> {
    return of(this.vehicles);
  }

  getVehicleRecords(plate: string): Observable<FuelRecord[]> {
    return this.records$.pipe(
      map(records => records
        .filter(r => r.plate.toUpperCase() === plate.toUpperCase())
        .sort((a, b) => new Date(b.fecha.split('-').reverse().join('-')).getTime() - new Date(a.fecha.split('-').reverse().join('-')).getTime()))
    );
  }

  addRecord(record: Omit<FuelRecord, 'id'>): Observable<FuelRecord> {
    const currentRecords = this.recordsSubject.value;
    const sortedRecords = [...currentRecords]
      .filter(r => r.plate.toUpperCase() === record.plate.toUpperCase())
      .sort((a, b) => new Date(b.fecha.split('-').reverse().join('-')).getTime() - new Date(a.fecha.split('-').reverse().join('-')).getTime());

    const lastRecord = sortedRecords[0];
    const kmRecorridos = lastRecord ? record.kilometraje - lastRecord.kilometraje : 0;
    const horasTrabajadas = lastRecord ? record.horometro - lastRecord.horometro : 0;

    const newRecord: FuelRecord = {
      ...record,
      id: Math.max(...currentRecords.map(r => r.id), 0) + 1,
      kmRecorridos: kmRecorridos > 0 ? kmRecorridos : 0,
      horasTrabajadas: horasTrabajadas > 0 ? horasTrabajadas : 0,
      consumoKm: kmRecorridos > 0 ? +(record.galones / kmRecorridos).toFixed(2) : 0,
      consumoHora: horasTrabajadas > 0 ? +(record.galones / horasTrabajadas).toFixed(2) : 0
    };

    const updatedRecords = [...currentRecords, newRecord];
    this.recordsSubject.next(updatedRecords);

    const vehicleIndex = this.vehicles.findIndex(v => v.plate.toUpperCase() === record.plate.toUpperCase());
    if (vehicleIndex !== -1) {
      this.vehicles[vehicleIndex] = {
        ...this.vehicles[vehicleIndex],
        lastKilometraje: record.kilometraje,
        lastHorometro: record.horometro,
        lastGalones: record.galones,
        lastDate: record.fecha,
        responsable: record.responsable
      };
    }

    return of(newRecord);
  }
}
