
import type { APIGatewayProxyHandler } from 'aws-lambda';
import { catalog, json } from '../model/zone.js';

export const handler: APIGatewayProxyHandler = async event => {
  const id = event.pathParameters?.id;

  console.log(`INFO GET zona: ${id}`);

  if (!id) {
    return json(400, { message: 'Falta el identificador de la zona' });
  }

  const zone = catalog.find(item => item.id === id);

  if (!zone) {
    return json(404, { message: 'Zona no encontrada' });
  }

  return json(200, zone);
};
