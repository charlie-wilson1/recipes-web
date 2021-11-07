import { getSession } from "next-auth/client";
import { useRouter } from "next/dist/client/router";
import { useEffect } from "react";

export default function Login() {
  const { query } = useRouter();

  useEffect(() => {
    if (query) {
      fetch("/api/auth/callback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ callbackUrl: query.callbackUrl }),
      });
    }
  }, [query]);

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

export async function getServerSideProps(ctx) {
  const session = await getSession(ctx);

  if (session?.user) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
}
