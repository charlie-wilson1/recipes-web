import { useEffect } from "react";
import { useRouter } from "next/router";
import { magic } from "../lib/magic";
import { Spinner } from "react-bootstrap";
import { signIn, useSession } from "next-auth/client";

export default function Callback() {
  const router = useRouter();
  const [session] = useSession();
  const baseUrl = process.env.BASE_URL;

  // Redirect to / if the user is logged in
  useEffect(() => {
    session?.user && router.push("/");
  }, [session]);

  useEffect(() => {
    router.query.provider ? finishSocialLogin() : finishEmailRedirectLogin();
  }, [router.query]);

  const finishEmailRedirectLogin = async () => {
    const credential = router.query.magic_credential;

    if (credential) {
      const didToken = await magic.auth.loginWithCredential(credential);
      const redirectPath = router.query["callbackUrl"];

      const redirectUrl = baseUrl
        ? new URL(redirectPath, baseUrl).href
        : new URL(redirectPath, window.location.origin).href;

      signIn("credentials", {
        didToken: didToken,
        callbackUrl: redirectPath ? redirectUrl : null,
      });
    }
  };

  const finishSocialLogin = async () => {
    const result = await magic.oauth.getRedirectResult();
    const redirectPath = router.query["callbackUrl"];

    const redirectUrl = baseUrl
      ? new URL(redirectPath, baseUrl).href
      : new URL(redirectPath, window.location.origin).href;

    await signIn("credentials", {
      didToken: result.magic.idToken,
      callbackUrl: redirectPath ? redirectUrl : null,
    });
  };

  return (
    <Spinner animation="border" role="status">
      <span className="visually-hidden">Loading...</span>
    </Spinner>
  );
}
