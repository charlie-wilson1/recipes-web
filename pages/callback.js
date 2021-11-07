import { useEffect } from "react";
import { signIn } from "next-auth/client";
import { Spinner } from "react-bootstrap";

export default function Callback() {
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.addEventListener("@magic/ready", (event) => {
        const { idToken } = event.detail;
        finishLogin(idToken);
      });
    }
  }, []);

  const finishLogin = async (didToken) => {
    const response = await fetch("/api/auth/callback");
    const data = await response.json();

    await signIn("credentials", {
      didToken,
      callbackUrl: data?.callbackUrl ?? null,
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
