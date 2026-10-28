import type { Zone, ZoneInput } from './types';

// API de Venue Control (AWS API Gateway).
export const API_URL = 'https://066zkons8a.execute-api.us-east-1.amazonaws.com/dev';

async function request(path: string, method = 'GET', body?: unknown): Promise<unknown> {
  const response = await fetch(API_URL + path, {
    method,
    ...(body !== undefined
      ? {
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body)
        }
      : {})
  });

  // CORREGIDO: antes se hacía response.json() directamente. Si la respuesta no trae
  // cuerpo (típico de un DELETE con 204) o no es JSON (errores del gateway),
  // json() lanzaba "Unexpected end of JSON input" aunque la operación hubiese ido bien.
  const text = await response.text();
  let value: unknown = null;

  if (text !== '') {
    try {
      value = JSON.parse(text);
    } catch {
      value = text;
    }
  }

  if (!response.ok) {
    const message =
      typeof value === 'object' && value !== null && 'message' in value
        ? String(value.message)
        : typeof value === 'string' && value !== ''
          ? value
          : response.statusText;

    throw new Error('HTTP ' + response.status + ': ' + message);
  }

  return value;
}

// CORREGIDO: ahora se exporta, para que la app pueda comprobar si una respuesta es una zona
export function isZone(value: unknown): value is Zone {
  return (
    typeof value === 'object' &&
    value !== null &&
    'id' in value &&
    typeof value.id === 'string' &&
    'name' in value &&
    typeof value.name === 'string' &&
    'capacity' in value &&
    typeof value.capacity === 'number' &&
    'status' in value &&
    (value.status === 'OPEN' ||
      value.status === 'FULL' ||
      value.status === 'CLOSED')
  );
}

export async function getZones(): Promise<Zone[]> {
  const value = await request('/zones');

  if (!Array.isArray(value) || !value.every(isZone)) {
    throw new Error('La API no devolvió una lista de zonas válida');
  }

  return value;
}

export async function getZone(id: string): Promise<Zone> {
  const value = await request('/zones/' + encodeURIComponent(id));

  if (!isZone(value)) {
    throw new Error('La API no devolvió una zona válida');
  }

  return value;
}

export const createZone = (input: ZoneInput) =>
  request('/zones', 'POST', input);

export const replaceZone = (id: string, input: ZoneInput) =>
  request('/zones/' + encodeURIComponent(id), 'PUT', input);

export const updateZone = (id: string, patch: Partial<ZoneInput>) =>
  request('/zones/' + encodeURIComponent(id), 'PATCH', patch);

export const deleteZone = (id: string) =>
  request('/zones/' + encodeURIComponent(id), 'DELETE');