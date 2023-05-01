import NextAuth, { AuthOptions } from "next-auth";

export const authOptions: AuthOptions = {
  providers: [
    {
      id: "custom",
      name: "Custom",
      type: "oauth",
      wellKnown: "http://localhost:5093/.well-known/openid-configuration",
      authorization: { params: { scope: "api" } },
      checks: ["pkce", "state"],
      clientId: "webapp",
      clientSecret: "webapp-secret",
      idToken: false,
      profile: (profile: any) => ({
        id: profile.id,
        name: profile.username,
        email: profile.email,
      }),
    },
  ],
  secret: "www",
  callbacks: {
    jwt({ token, user, account }) {
      if (account) {
        token.user = user;
        token.accessToken = account.access_token!;
      }
      return token;
    },
    session({ session, token }) {
      // TODO: There has to be a better way
      return Object.assign(session, {
        accessToken: token.accessToken,
        user: token.user,
        expires: new Date((token.exp as number) * 1000).toISOString(),
      });
    },
  },
};

export default NextAuth(authOptions);
