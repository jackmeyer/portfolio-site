// personal values live in .env (see .env.example), never in code
export const SITE_TITLE =
  process.env.PUBLIC_SITE_TITLE ?? import.meta.env.PUBLIC_SITE_TITLE ?? 'My Desktop';
