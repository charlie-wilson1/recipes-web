import { useEffect } from "react";
import { useRouter } from "next/router";
import { magic } from "../lib/magic";
import { Spinner } from "react-bootstrap";
import { signIn } from "next-auth/react";

export default function Callback() {
  const router = useRouter();
  const uri = process.env.LOCAL_URL;

  useEffect(() => {
    router.query.provider ? finishSocialLogin() : finishEmailRedirectLogin();
  }, [router.query]);

  const finishEmailRedirectLogin = async () => {
    const credential = router.query.magic_credential;

    if (credential) {
      const didToken = await magic.auth.loginWithCredential(credential);
      const callbackUrl = router.query["callbackUrl"];

      signIn("credentials", {
        didToken: didToken,
        callbackUrl: callbackUrl ? new URL(callbackUrl, uri).href : null,
      });
    }
  };

  const finishSocialLogin = async () => {
    const result = await magic.oauth.getRedirectResult();
    const callbackUrl = router.query["callbackUrl"];

    await signIn("credentials", {
      didToken: result.magic.idToken,
      callbackUrl: callbackUrl ? new URL(callbackUrl, uri).href : null,
    });
  };

  return (
    <Spinner animation="border" role="status">
      <span className="visually-hidden">Loading...</span>
    </Spinner>
  );
}
