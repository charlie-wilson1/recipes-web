import React from "react";

export default function Login() {
  return (
    <>
      <script
        src="https://auth.magic.link/pnp/login"
        data-magic-publishable-api-key={
          process.env.NEXT_PUBLIC_MAGIC_PUBLISHABLE_KEY
        }
        data-redirect-uri="/callback"
      ></script>
    </>
  );
}
