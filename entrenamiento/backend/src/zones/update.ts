
import type { APIGatewayProxyHandler } from 'aws-lambda';
import {
  catalog,
  isZonePatch,
  json,
  readBody
} from '../model/zone.js';

export const handler: APIGatewayProxyHandler = async event => {
  const id = event.pathParameters?.id;
  const body = readBody(event.body ?? null);

  console.log(`INFO PATCH zona: ${id}`);

  if (!id) {
    return json(400, { message: 'Falta el identificador de la zona' });
  }

  const zone = catalog.find(item => item.id === id);

  if (!zone) {
    return json(404, { message: 'Zona no encontrada' });
  }

  if (!isZonePatch(body)) {
    return json(400, {
      message: 'PATCH requiere al menos un campo válido'
    });
  }

  return json(200, {
    id,
    changes: body,
    operation: 'UPDATED',
    persistence: 'simulated'
  });
};
