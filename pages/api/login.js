import { Magic } from "@magic-sdk/admin";

// Initiating Magic instance for server-side methods
// eslint-disable-next-line no-undef
const magic = new Magic(process.env.MAGIC_SECRET_KEY);

export default async function login(req, res) {
  try {
    const didToken = magic.utils.parseAuthorizationHeader("Authorization");
    await magic.token.validate(didToken);
    res.status(200).json({ authenticated: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
