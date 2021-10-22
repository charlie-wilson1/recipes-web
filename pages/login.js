import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { magic } from "../lib/magic";
import { signIn, useSession } from "next-auth/react";
import { Button, Form } from "react-bootstrap";
import CredentialsProvider from "next-auth/providers/credentials";

export default function Login() {
  const router = useRouter();
  const { status } = useSession();
  const [disabled, setDisabled] = useState(false);
  const [email, setEmail] = useState("");
  const providers = ["google", "facebook"];
  const [isRedirecting, setIsRedirecting] = useState(false);

  // Redirect to / if the user is logged in
  useEffect(() => {
    status === "authenticated" && router.push("/");
  }, [status]);

  const handleLoginWithEmail = async () => {
    setDisabled(true);
    try {
      let redirectURI = new URL("/callback", window.location.hostname).href;
      const callbackUrl = router.query["callbackUrl"];

      if (callbackUrl) {
        redirectURI += `?callbackUrl=${callbackUrl}`;
      }

      const didToken = await magic.auth.loginWithMagicLink({
        email,
        redirectURI,
      });

      await signIn(CredentialsProvider, {
        didToken,
        callbackUrl: callbackUrl ?? new URL(window.location.hostname).href,
      });
    } catch {
      setDisabled(false);
    }
  };

  const handleLoginWithSocial = async (provider) => {
    if (!magic?.auth) {
      throw new Error("magic not defined");
    }

    let redirectURI = new URL("/callback", window.location.hostname).href;
    const callbackUrl = router.query["callbackUrl"];

    if (callbackUrl) {
      redirectURI += `?callbackUrl=${callbackUrl}`;
    }

    await magic.oauth.loginWithRedirect({
      provider, // google, facebook, etc
      redirectURI,
    });
  };

  return (
    <div className="login">
      <form>
        <h3 className="form-header">Login</h3>
        <div className="input-wrapper">
          <Form.Group>
            <Form.Label>Email address</Form.Label>
            <Form.Control
              placeholder="Enter your email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Group>
        </div>
        <div>
          <Button
            variant="success"
            size="sm"
            disabled={disabled}
            onClick={handleLoginWithEmail}
          >
            Send Magic Link
          </Button>
        </div>
      </form>
      <div className="or-login-with">Or login with</div>
      {providers.map((provider) => {
        return (
          <div key={provider}>
            <button
              type="submit"
              className="social-btn"
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
      {isRedirecting && <div className="redirecting">Redirecting...</div>}
      <style jsx>{`
        .login {
          max-width: 20rem;
          margin: 40px auto 0;
          padding: 1rem;
          border: 1px solid #dfe1e5;
          border-radius: 4px;
          text-align: center;
          box-shadow: 0px 0px 6px 6px #f7f7f7;
          box-sizing: border-box;
        }
        form,
        label {
          display: flex;
          flex-flow: column;
          text-align: center;
        }
        .form-header {
          font-size: 22px;
          margin: 25px 0;
        }
        .input-wrapper {
          width: 80%;
          margin: 0 auto 20px;
        }
        .or-login-with {
          margin: 25px 0;
          font-size: 12px;
          text-align: center;
          color: gray;
        }
        .social-btn {
          cursor: pointer;
          border-radius: 50px;
          margin-bottom: 20px;
          border: 1px solid #8a8a8a;
          padding: 9px 24px 9px 35px;
          width: 80%;

          background-color: #fff;
          background-size: 20px;
          background-repeat: no-repeat;
          background-position: 23% 50%;
        }
        .redirecting {
          color: gray;
          font-size: 12px;
          margin-bottom: 5px;
        }
      `}</style>
    </div>
  );
}
