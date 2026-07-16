import type { APIRoute } from 'astro';
import { destroySession } from '../../lib/auth';

export const POST: APIRoute = (context) => {
  const token = context.cookies.get('session')?.value;
  if (token) destroySession(token);
  context.cookies.delete('session', { path: '/' });
  return context.redirect('/admin/login');
};
