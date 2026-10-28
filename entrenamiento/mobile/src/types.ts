// Venue Control: zonas del recinto
export type ZoneStatus = 'OPEN' | 'FULL' | 'CLOSED';

export interface Zone {
  id: string;
  name: string;
  capacity: number;
  status: ZoneStatus;
}

export type ZoneInput = Omit<Zone, 'id'>;

// Tipos de eventos de festival (los que ya tenías)
export type EventStatus = 'CONFIRMED' | 'CANCELLED';

export interface FestivalEvent {
  id: string;
  artist: string;
  space: string;
  time: string;
  status: EventStatus;
}

export type EventInput = Omit<FestivalEvent, 'id'>;