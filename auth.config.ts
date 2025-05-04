import type { NextAuthConfig } from "next-auth";
import { D1Adapter } from "@auth/d1-adapter";
import { getRequestContext } from "@cloudflare/next-on-pages";
import EmailProvider from "next-auth/providers/email";

// Note: This requires setting AUTH_SECRET environment variable
// and configuring email sending (e.g., Resend, SMTP)

// Helper function to get the D1 database instance
function getDb() {
  try {
    const { env } = getRequestContext();
    // Ensure the binding name matches your wrangler.toml for the appropriate environment
    // Using DB_LOCAL for development as configured earlier
    return env.DB_LOCAL;
  } catch (error) {
    console.error("Failed to get D1 database instance:", error);
    // Fallback or error handling - In a real app, might throw or use a mock
    // For now, throwing to make the configuration error explicit
    throw new Error("Could not retrieve D1 database binding. Ensure the code runs in a Cloudflare Pages environment or wrangler dev.");
  }
}

export const authConfig = {
  adapter: D1Adapter(getDb()),
  providers: [
    EmailProvider({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: Number(process.env.EMAIL_SERVER_PORT),
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      },
      from: process.env.EMAIL_FROM,
      // maxAge: 24 * 60 * 60, // How long email links are valid for (default 24h)
    }),
    // Add other providers like Google, GitHub etc. if needed
  ],
  pages: {
    signIn: 
'/login
',
    // signOut: '/auth/signout',
    // error: '/auth/error', // Error code passed in query string as ?error=
    verifyRequest: 
'/auth/verify-request
', // Used for check email message
    // newUser: '/auth/new-user' // New users will be directed here on first sign in (leave the property out to disable)
  },
  callbacks: {
    // Use callbacks to control session data or access rights
    async session({ session, user }) {
      // Add user ID and potentially plan/role to the session object
      if (session.user) {
        session.user.id = user.id;
        // Fetch plan info if needed, or store it during signIn
        // const db = getDb();
        // const userData = await db.prepare("SELECT plan FROM users WHERE id = ?").bind(user.id).first<{ plan: string }>();
        // session.user.plan = userData?.plan || 'gratuito';
      }
      return session;
    },
    async signIn({ user, account, profile, email, credentials }) {
        // Ensure user exists in our custom users table or create them
        // The D1 adapter handles user creation/linking automatically for Email provider
        // but we might want to initialize custom fields like 'plan' or 'product_count'
        const db = getDb();
        const existingUser = await db.prepare("SELECT id FROM users WHERE email = ?").bind(user.email).first<{ id: number }>();
        if (!existingUser) {
            // If adapter didn't create it (should for Email), or if we need defaults
            // This part might be redundant with the adapter but ensures our table schema is met
            try {
                await db.prepare("INSERT INTO users (email, plan, product_count) VALUES (?, 'gratuito', 0)").bind(user.email).run();
                console.log(`Created new user entry for ${user.email} in custom users table.`);
            } catch (dbError: any) {
                // Handle potential race condition if adapter created user between SELECT and INSERT
                if (!dbError.message.includes("UNIQUE constraint failed")) {
                    console.error("Failed to insert new user into custom table:", dbError);
                    return false; // Prevent sign in if DB setup fails
                }
                 console.log(`User ${user.email} likely created by adapter, proceeding.`);
            }
        }
        return true; // Allow sign in
    },
    // redirect({ url, baseUrl }) {
    //   // Allows customizing redirect behavior
    //   return baseUrl;
    // },
  },
  // Enable debug messages in development
  // debug: process.env.NODE_ENV === 'development',
  session: {
    strategy: "jwt", // Use JWT for session strategy with Cloudflare Workers
  },
  // Add AUTH_SECRET environment variable
  secret: process.env.AUTH_SECRET,
} satisfies NextAuthConfig;

