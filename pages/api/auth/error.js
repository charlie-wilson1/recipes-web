import { getToken } from "next-auth/jwt";
import { signIn } from "next-auth/react";

const secret = process.env.JWT_KEY;

// eslint-disable-next-line no-unused-vars
export default async function error(req, res) {
  const token = await getToken({ req, secret });

  if (token) {
    signIn({ token });
  }

  res.redirect(301, "/login");
}
