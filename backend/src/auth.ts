import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { createAuthMiddleware } from "better-auth/api";
import db from "./db"; // Your Drizzle database instance
import { user, session, verification, account } from "./schema"; // Import your schema

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg", // PostgreSQL
    schema: {
      user,
      session,
      verification,
      account, // Add the account table to the schema
    },
  }),
  emailAndPassword: {
    enabled: false,
  },
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string
    },
  },
  verification: {
    modelName: "verification", // Match your table name
    fields: {
      identifier: "identifier" // Match your field name
    },
    disableCleanup: false
  },
  advanced: {
    crossSubDomainCookies: {
      enabled: true,
    },
  },
  baseURL: "http://localhost:3001", // Ensure this matches your server URL
  trustedOrigins: ["http://localhost:3000" ],
  hooks: {
    // Add a before hook to log authentication requests
    before: createAuthMiddleware(async (ctx) => {
      console.log("Auth before hook:", ctx.path, ctx.body);
      
      // If this is a GitHub callback, log more details
      if (ctx.path === "/callback/github") {
        console.log("GitHub callback details:", {
          query: ctx.query,
          headers: ctx.headers,
        });
      }
    }),
    
    // Add an after hook to log the authentication process and handle redirects
    after: createAuthMiddleware(async (ctx) => {
      console.log("Auth after hook:", ctx.path);
      
      // Check if this is a social sign-in callback path
      if (ctx.path === "/callback/github") {
        const newSession = ctx.context.newSession;
        
        if (newSession) {
          console.log("New session created:", {
            userId: newSession.user.id,
            userName: newSession.user.name,
            userEmail: newSession.user.email,
          });
          
          // Redirect to frontend after successful authentication
          throw ctx.redirect("http://localhost:3000");
        } else {
          console.error("No session created after social login");
          
          // Redirect to frontend error page if authentication failed
          throw ctx.redirect("http://localhost:3000/auth-error");
        }
      }
    }),
  },
});
