import React, { useState, useEffect } from "react";
import styles from "../styles/Login.module.css";
import { useRouter } from "next/router";
import { magic } from "../lib/magic";
import { signIn, useSession } from "next-auth/client";
import { Button, Form } from "react-bootstrap";

export default function Login() {
  const router = useRouter();
  const [session] = useSession();
  const [disabled, setDisabled] = useState(false);
  const [email, setEmail] = useState("");
  const providers = ["google", "facebook"];
  const [isRedirecting, setIsRedirecting] = useState(false);
  const baseUrl = process.env.BASE_URL;

  // Redirect to / if the user is logged in
  useEffect(() => {
    session?.user && router.push("/");
  }, [session]);

  const handleLoginWithEmail = async () => {
    setDisabled(true);
    try {
      let redirectPath = "/callback";
      const callbackUrl = router.query["callbackUrl"];

      if (callbackUrl) {
        redirectPath += `?callbackUrl=${callbackUrl}`;
      }

      const redirectUrl = baseUrl
        ? new URL(redirectPath, baseUrl).href
        : new URL(redirectPath, window.location.origin).href;

      const didToken = await magic.auth.loginWithMagicLink({
        email,
        redirectURI: redirectUrl,
      });

      await signIn("credential", {
        didToken,
        callbackUrl: callbackUrl ? redirectUrl : null,
      });
    } catch {
      setDisabled(false);
    }
  };

  const handleLoginWithSocial = async (provider) => {
    if (!magic?.auth) {
      throw new Error("magic not defined");
    }

    let redirectPath = "/callback";
    const callbackUrl = router.query["callbackUrl"];

    if (callbackUrl) {
      redirectPath += `?callbackUrl=${callbackUrl}`;
    }

    const redirectUrl = baseUrl
      ? new URL(redirectPath, baseUrl).href
      : new URL(redirectPath, window.location.origin).href;

    await magic.oauth.loginWithRedirect({
      provider, // google, facebook, etc
      redirectURI: redirectUrl,
    });
  };

  return (
    <div className={styles.login}>
      <form>
        <h3 className={styles.formHeader}>Login</h3>
        <div className={styles.inputWrapper}>
          <Form.Group>
            <Form.Label>Email address</Form.Label>
            <Form.Control
              placeholder="Enter your email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={styles.input}
            />
          </Form.Group>
        </div>
        <div>
          <Button
            variant="success"
            size="sm"
            disabled={disabled}
            onClick={handleLoginWithEmail}
            className={styles.magicBtn}
          >
            Send Magic Link
          </Button>
        </div>
      </form>
      <div className={styles.orLoginWith}>Or login with</div>
      {providers.map((provider) => {
        return (
          <div key={provider}>
            <button
              type="submit"
              className={styles.socialBtn}
              onClick={() => {
                setIsRedirecting(true);
                handleLoginWithSocial(provider);
              }}
              key={provider}
              style={{ backgroundImage: `url(${provider}.png)` }}
            >
              {/* turns "google" to "Google" */}
              {provider.replace(/^\w/, (c) => c.toUpperCase())}
            </button>
          </div>
        );
      })}
      {isRedirecting && (
        <div className={styles.redirecting}>Redirecting...</div>
      )}
      <style jsx>{`
        form,
        label {
          display: flex;
          flex-flow: column;
          text-align: center;
        }
      `}</style>
    </div>
  );
}
