
import type { APIGatewayProxyHandler } from 'aws-lambda';
import {
  catalog,
  isZoneInput,
  json,
  readBody
} from '../model/zone.js';

export const handler: APIGatewayProxyHandler = async event => {
  const id = event.pathParameters?.id;
  const body = readBody(event.body ?? null);

  console.log(`INFO PUT zona: ${id}`);

  if (!id) {
    return json(400, { message: 'Falta el identificador de la zona' });
  }

  if (!catalog.some(zone => zone.id === id)) {
    return json(404, { message: 'Zona no encontrada' });
  }

  if (!isZoneInput(body)) {
    return json(400, {
      message: 'PUT requiere name, capacity y status válidos'
    });
  }

  return json(200, {
    id,
    name: body.name.trim(),
    capacity: body.capacity,
    status: body.status,
    operation: 'REPLACED',
    persistence: 'simulated'
  });
};
