import styles from "../styles/Navbar.module.css";
import { Nav, Navbar, Container, Image, Button } from "react-bootstrap";
import { useState } from "react";
import { useRecipeContext } from "../store/recipeState";
import { urlFor } from "../lib/sanity";
import { GrClose } from "react-icons/gr";
import { useSession, signOut, signIn } from "next-auth/client";
import { magic } from "../lib/magic";

export default function RecipeNavbar() {
  const [expanded, setExpanded] = useState(false);
  const { recipes } = useRecipeContext();
  const [session, loading] = useSession();

  const handleLogout = () => {
    signOut();
    try {
      magic.user.logout();
      // eslint-disable-next-line no-empty
    } catch {}
  };

  return (
    <div className={styles.navWrapper}>
      <div className={styles.sidebarMenuContainer}>
        <Navbar
          bg="light"
          variant="light"
          className={[styles.sidebar, expanded ? styles.expanded : null]}
        >
          <Navbar.Collapse className="h-100">
            <Container className="vh-100">
              <div className="d-flex justify-content-between my-1 align-items-center">
                <div>
                  <Navbar.Brand href="/">Recipes</Navbar.Brand>
                </div>
                <Button variant="link" onClick={() => setExpanded(false)}>
                  <GrClose />
                </Button>
              </div>
              {session?.user && (
                <Nav className="mr-auto d-block">
                  {(recipes ?? []).map((recipe) => (
                    <Nav.Link key={recipe.title} href={`/${recipe.slug}`}>
                      <div className="d-flex">
                        <div className="d-inline-block me-3">
                          <Image
                            alt={recipe.title}
                            src={urlFor(recipe.image)
                              .width(60)
                              .height(60)
                              .auto("format")
                              .url()}
                          />
                        </div>
                        <div>
                          <div className="d-block">
                            <div className={styles.title}>{recipe.title}</div>
                            <div className={styles.subtitle}>
                              Time to make: {recipe.cookTime + recipe.prepTime}
                            </div>
                          </div>
                        </div>
                      </div>
                    </Nav.Link>
                  ))}
                </Nav>
              )}
            </Container>
          </Navbar.Collapse>
        </Navbar>
      </div>
      <Navbar bg="light" variant="light">
        <Container className={expanded ? "justify-content-end" : ""}>
          <Navbar.Toggle
            className={expanded ? "d-none" : "d-flex"}
            onClick={() => setExpanded(true)}
          />
          <Navbar>
            <Nav>
              {loading ? (
                <></>
              ) : session?.user ? (
                <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
              ) : (
                <Nav.Link onClick={() => signIn()}>Login</Nav.Link>
              )}
            </Nav>
          </Navbar>
        </Container>
      </Navbar>
    </div>
  );
}
