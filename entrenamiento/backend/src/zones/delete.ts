
import type { APIGatewayProxyHandler } from 'aws-lambda';
import { catalog, json } from '../model/zone.js';

export const handler: APIGatewayProxyHandler = async event => {
  const id = event.pathParameters?.id;

  console.log(`INFO DELETE zona: ${id}`);

  if (!id) {
    return json(400, { message: 'Falta el identificador de la zona' });
  }

  if (!catalog.some(zone => zone.id === id)) {
    return json(404, { message: 'Zona no encontrada' });
  }

  return json(200, {
    id,
    operation: 'DELETED',
    persistence: 'simulated'
  });
};
