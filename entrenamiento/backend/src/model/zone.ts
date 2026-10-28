
import type { APIGatewayProxyResult } from 'aws-lambda';

export type ZoneStatus = 'OPEN' | 'FULL' | 'CLOSED';

export interface Zone {
  id: string;
  name: string;
  capacity: number;
  status: ZoneStatus;
}

export type ZoneInput = Omit<Zone, 'id'>;

export const catalog: Zone[] = [
  {
    id: 'ZONE-07',
    name: 'Garden Stage',
    capacity: 2500,
    status: 'OPEN'
  },
  {
    id: 'ZONE-08',
    name: 'Main Arena',
    capacity: 5000,
    status: 'FULL'
  }
];

export const json = (
  statusCode: number,
  value: unknown
): APIGatewayProxyResult => ({
  statusCode,
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*'
  },
  body: JSON.stringify(value)
});

export function readBody(
  text: string | null
): Record<string, unknown> | null {
  try {
    const value: unknown = JSON.parse(text ?? 'null');

    return typeof value === 'object' &&
      value !== null &&
      !Array.isArray(value)
      ? value as Record<string, unknown>
      : null;
  } catch {
    return null;
  }
}

export function isZoneInput(
  value: Record<string, unknown> | null
): value is Record<string, unknown> & ZoneInput {
  return value !== null &&
    typeof value.name === 'string' &&
    value.name.trim().length > 0 &&
    typeof value.capacity === 'number' &&
    Number.isInteger(value.capacity) &&
    value.capacity > 0 &&
    (
      value.status === 'OPEN' ||
      value.status === 'FULL' ||
      value.status === 'CLOSED'
    );
}

export function isZonePatch(
  value: Record<string, unknown> | null
): value is Record<string, unknown> {
  if (value === null) return false;

  const keys = Object.keys(value);
  if (keys.length === 0) return false;

  return keys.every(key => {
    if (key === 'name') {
      return typeof value.name === 'string' &&
        value.name.trim().length > 0;
    }

    if (key === 'capacity') {
      return typeof value.capacity === 'number' &&
        Number.isInteger(value.capacity) &&
        value.capacity > 0;
    }

    if (key === 'status') {
      return value.status === 'OPEN' ||
        value.status === 'FULL' ||
        value.status === 'CLOSED';
    }

    return false;
  });
}
