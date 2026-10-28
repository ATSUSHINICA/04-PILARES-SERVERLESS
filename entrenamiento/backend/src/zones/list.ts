
import type { APIGatewayProxyHandler } from 'aws-lambda';
import { catalog, json } from '../model/zone.js';

export const handler: APIGatewayProxyHandler = async () => {
  console.log('INFO LIST zonas');

  return json(200, catalog);
};
