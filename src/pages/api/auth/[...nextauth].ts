import NextAuth from "next-auth";

export default NextAuth({
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
      return Object.assign(session, { accessToken: token.accessToken, user: token.user });
    },
  },
});
