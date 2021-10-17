import styles from "../styles/Navbar.module.css";
import { Nav, Navbar, Container, Image, Col, Row } from "react-bootstrap";
import { useState, useContext } from "react";
import { useRecipeContext } from "../store/recipeState";
import { UserContext } from "../store/userState";
import { urlFor } from '../lib/sanity';
import { magic } from '../lib/magic';
import { useRouter } from "next/router";

export default function RecipeNavbar() {
  const router = useRouter();
  const [expanded, setExpanded] = useState(false);
  const { recipes } = useRecipeContext();
  const [user, setUser] = useContext(UserContext);

  const logout = () => {
    magic.user.logout().then(() => {
      setUser({ user: null });
      router.push('/login');
    });
  };

  return (
    <customnav className={styles.navWrapper}>
      <div className={styles.sidebarMenuContainer} >
        <Navbar bg="light" variant="light" className={[styles.sidebar, (expanded ? styles.expanded : null)]} >
          <Navbar.Collapse className="h-100">
            <Container className="vh-100">
              <div className="my-4">
                <Navbar.Brand href="/">Recipes</Navbar.Brand>
              </div>
              <Nav className="mr-auto d-block">
                {(recipes ?? []).map(recipe => 
                  <Nav.Link key={recipe.title} href={`/${recipe.slug}`}>
                    <div className='d-flex'>
                      <div className='d-inline-block me-3'>
                        <Image
                          alt={recipe.title}
                          src={urlFor(recipe.image).width(60).height(60).auto("format").url()} />
                      </div>
                      <div>
                        <div className="d-block">
                          <div className={styles.title}>{recipe.title}</div>
                          <div className={styles.subtitle}>Time to make: {recipe.cookTime + recipe.prepTime}</div>
                        </div>
                      </div>
                    </div>
                  </Nav.Link>
                )}
              </Nav>
            </Container>
          </Navbar.Collapse>
        </Navbar>
      </div>
      <Navbar bg="light" variant="light">
        <Container>
        <Navbar.Toggle className="d-flex" onClick={() => setExpanded(!expanded)} />
          <Navbar>
            <Nav className="mr-auto">
              {user?.loading ? (<></>) : user?.issuer ? (
                <Nav.Link onClick={logout}>Logout</Nav.Link>
              ) : (
                <Nav.Link href="/login">Login</Nav.Link>
              )}
            </Nav>
          </Navbar>
        </Container>
      </Navbar>
    </customnav>
  );
}