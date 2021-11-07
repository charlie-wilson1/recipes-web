import jwt from "next-auth/jwt";
import { signIn } from "next-auth/client";

const secret = process.env.JWT_KEY;

// eslint-disable-next-line no-unused-vars
export default async function error(req, res) {
  const token = await jwt.getToken({ req, secret });

  if (token) {
    signIn({ token });
  }

  res.redirect(301, "/login");
}
