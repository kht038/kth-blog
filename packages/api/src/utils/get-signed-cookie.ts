// Fuck no unsafe Unsigned
import type { Request } from 'express';

export function getSignedCookie(req: Request, key: string): string | undefined {
  const bag: unknown = (req as unknown as { signedCookies?: unknown })
    .signedCookies;
  if (typeof bag !== 'object' || bag === null) return undefined;

  const val = (bag as Record<string, unknown>)[key];
  return typeof val === 'string' ? val : undefined;
}
