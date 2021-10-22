import NextAuth from "next-auth";
import Providers from "next-auth/providers";
import { Magic } from "@magic-sdk/admin";

const magic = new Magic(process.env.MAGIC_SECRET_KEY);

export default NextAuth({
  session: {
    jwt: {
      secret: process.env.JWT_KEY,
      signingKey: JSON.parse(process.env.JWT_SIGNING_KEY),
      encryption: true,
    },
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    Providers.Credentials({
      name: "Magic Link",
      credentials: {
        didToken: { label: "DID Token", type: "text" },
      },
      async authorize({ didToken }) {
        magic.token.validate(didToken);
        const metadata = await magic.users.getMetadataByToken(didToken);

        return {
          email: metadata.email,
          name: metadata.email,
        };
      },
    }),
  ],
});
