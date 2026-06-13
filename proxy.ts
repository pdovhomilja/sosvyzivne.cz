// Next.js 16 renamed `middleware` → `proxy` (nodejs runtime). next-intl's
// middleware factory works unchanged as the proxy's default export.
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  // Run on everything except API, Next internals, and files with extensions.
  matcher: "/((?!api|_next|_vercel|.*\\..*).*)",
};
