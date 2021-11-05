import { useEffect } from "react";
import { signIn } from "next-auth/client";
import { Spinner } from "react-bootstrap";
import useSWR from "swr";

export default function Callback() {
  const { data } = useSWR("/api/auth/callback", fetcher);

  useEffect(() => {
    if (typeof window !== "undefined" && data?.callbackUrl) {
      window.addEventListener("@magic/ready", (event) => {
        const { idToken } = event.detail;
        finishLogin(idToken);
      });
    }
  }, [data]);

  const finishLogin = async (didToken) => {
    await signIn("credentials", {
      didToken,
      callbackUrl: data.callbackUrl ?? null,
    });
  };

  return (
    <>
      <Spinner animation="border" role="status">
        <span className="visually-hidden">Loading...</span>
      </Spinner>
      <script
        src="https://auth.magic.link/pnp/callback"
        data-magic-publishable-api-key={
          process.env.NEXT_PUBLIC_MAGIC_PUBLISHABLE_KEY
        }
      ></script>
    </>
  );
}

const fetcher = async (url) => {
  const res = await fetch(url);
  const data = await res.json();

  if (res.status !== 200) {
    throw new Error(data.message);
  }
  return data;
};
