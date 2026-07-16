import type { APIRoute } from 'astro';
import { db } from '../lib/db';

export const GET: APIRoute = () => {
  db.prepare('SELECT 1').get();
  return new Response('ok');
};
