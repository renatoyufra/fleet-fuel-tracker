export interface Vehicle {
  plate: string;
  unit: string;
  type: string;
  lastKilometraje: number;
  lastHorometro: number;
  lastGalones: number;
  lastDate: string;
  responsable?: string;
}

export interface FuelRecord {
  id: number;
  plate: string;
  unit: string;
  kilometraje: number;
  horometro: number;
  galones: number;
  fecha: string;
  responsable: string;
  turno: string;
  kmRecorridos?: number;
  horasTrabajadas?: number;
  consumoKm?: number;
  consumoHora?: number;
}
