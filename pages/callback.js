import { useEffect } from "react";
import { useRouter } from "next/router";
import { magic } from "../lib/magic";
import { Spinner } from "react-bootstrap";
import { signIn } from "next-auth/react";

export default function Callback() {
  const router = useRouter();

  useEffect(() => {
    router.query.provider ? finishSocialLogin() : finishEmailRedirectLogin();
  }, [router.query]);

  const finishEmailRedirectLogin = async () => {
    const credential = router.query.magic_credential;

    if (credential) {
      const didToken = await magic.auth.loginWithCredential(credential);
      signIn("credentials", {
        didToken: didToken,
        callbackUrl:
          router.query["callbackUrl"] ?? new URL(window.location.hostname).href,
      });
    }
  };

  const finishSocialLogin = async () => {
    const result = await magic.oauth.getRedirectResult();

    await signIn("credentials", {
      didToken: result.magic.idToken,
      callbackUrl:
        router.query["callbackUrl"] ?? new URL(window.location.hostname).href,
    });
  };

  return (
    <Spinner animation="border" role="status">
      <span className="visually-hidden">Loading...</span>
    </Spinner>
  );
}
