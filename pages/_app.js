import 'bootstrap/dist/css/bootstrap.css';
import '../styles/globals.css';
import Navbar from "../components/navbar";
import { RecipeProvider } from "../store/recipeState";
import { UserContext } from "../store/userState";
import { useEffect, useState } from "react";
import { magic } from '../lib/magic';
import Router from 'next/router';


function MyApp({ Component, pageProps }) {
  const [user, setUser] = useState();

  // If isLoggedIn is true, set the UserContext with user data
  // Otherwise, redirect to /login and set UserContext to { user: null }
  useEffect(() => {
    setUser({ loading: true });
    magic.user.isLoggedIn().then((isLoggedIn) => {
      if (isLoggedIn) {
        magic.user.getMetadata()
          .then((userData) => setUser(userData));
      } else {
        Router.push('/login');
        setUser({ user: null });
      }
    });
  }, []);

  return (
      <UserContext.Provider value={[user, setUser]}>
        <RecipeProvider>
          <Navbar />
          <Component {...pageProps} />
        </RecipeProvider>
      </UserContext.Provider>
  );
}

export default MyApp;
