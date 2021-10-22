import "bootstrap/dist/css/bootstrap.css";
import "../styles/globals.css";
import Navbar from "../components/navbar";
import { RecipeProvider } from "../store/recipeState";
import { PropTypes } from "prop-types";
import { Provider, signIn, useSession } from "next-auth/client";
import { useEffect } from "react";
import { Spinner } from "react-bootstrap";

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <RecipeProvider>
      <Provider session={session}>
        <Navbar />
        {Component.auth ? (
          <Auth>
            <Component {...pageProps} />
          </Auth>
        ) : (
          <Component {...pageProps} />
        )}
      </Provider>
    </RecipeProvider>
  );
}

MyApp.propTypes = {
  Component: PropTypes.object,
  pageProps: PropTypes.object,
};

// eslint-disable-next-line react/prop-types
function Auth({ children }) {
  const [session, loading] = useSession();
  const isUser = !!session?.user;

  useEffect(() => {
    if (loading) {
      return;
    }
    if (!isUser) {
      signIn();
    }
  }, [isUser, loading]);

  if (isUser) {
    return children;
  }

  return (
    <Spinner animation="border" role="status">
      <span className="visually-hidden">Loading...</span>
    </Spinner>
  );
}

export default MyApp;
