
import type { APIGatewayProxyHandler } from 'aws-lambda';
import { isZoneInput, json, readBody } from '../model/zone.js';

export const handler: APIGatewayProxyHandler = async event => {
  const body = readBody(event.body ?? null);

  console.log('INFO POST zona');

  if (!isZoneInput(body)) {
    return json(400, {
      message: 'Datos inválidos: name, capacity y status son obligatorios'
    });
  }

  const zone = {
    id: `ZONE-${Date.now()}`,
    name: body.name.trim(),
    capacity: body.capacity,
    status: body.status
  };

  return json(201, {
    message: 'Zona creada (escritura simulada)',
    zone
  });
};
