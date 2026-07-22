// Shared by the login action and the middleware. Lives apart from auth.ts so
// the middleware (edge bundle) never pulls in better-sqlite3/argon2.

// A Secure cookie is dropped by the browser over plain HTTP, which makes login
// silently do nothing on a LAN deployment with no certificate. INSECURE_COOKIES
// is the opt-out for exactly that case: behind a reverse proxy terminating TLS,
// leave it unset.
const insecure = process.env.INSECURE_COOKIES === 'true';
if (insecure) {
  console.warn(
    'INSECURE_COOKIES=true: session cookies are not marked Secure and will travel in cleartext over HTTP. Do not use this on a public deployment.'
  );
}

export const sessionCookieOptions = {
  httpOnly: true,
  sameSite: 'strict',
  secure: !insecure && process.env.NODE_ENV === 'production',
  path: '/',
  maxAge: 30 * 86400,
} as const;
