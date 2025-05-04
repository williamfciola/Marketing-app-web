import NextAuth from "next-auth";
import { authConfig } from "@/auth.config";
import { getRequestContext } from "@cloudflare/next-on-pages";

// The request object needs to be enriched with the Cloudflare context
// See: https://github.com/nextauthjs/next-auth/discussions/9017#discussioncomment-7118968
export const { handlers, auth, signIn, signOut } = NextAuth(async (request) => {
  if (request) {
    (request as any).context = getRequestContext();
  }
  return {
    ...authConfig,
  };
});

