import Cookies from "cookies";

const cookieName = "callback-url";

export default async function callback(req, res) {
  const cookies = new Cookies(req, res);

  if (req.method === "POST") {
    const { callbackUrl } = JSON.parse(req.body);
    cookies.set(cookieName, callbackUrl);
    res.end();
  }

  if (req.method === "GET") {
    const callbackUrl = cookies.get(cookieName);
    cookies.set(cookieName);
    res.json(JSON.stringify({ callbackUrl }));
  }
}
