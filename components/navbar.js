import styles from "../styles/Navbar.module.css";
import { Nav, Navbar, Container, Image, Button } from "react-bootstrap";
import { useState } from "react";
import { useRecipeContext } from "../store/recipeState";
import { urlFor } from "../lib/sanity";
import { GrClose } from "react-icons/gr";
import { useSession, signOut, signIn } from "next-auth/client";
import { magic } from "../lib/magic";
import { motion, AnimatePresence } from "framer-motion";

export default function RecipeNavbar() {
  const [expanded, setExpanded] = useState(false);
  const { recipes } = useRecipeContext();
  const [session, loading] = useSession();

  const handleLogout = async () => {
    await magic.user.logout();
    await signOut();
  };

  const slideOut = {
    hidden: {
      x: "-100vw",
      opacity: 0,
    },
    visible: {
      x: "0",
      opacity: 1,
      animate: "push",
      transition: {
        duration: 0.6,
      },
    },
    exit: {
      x: "-100vw",
      opacity: 0,
      animate: "push",
      transition: {
        duration: 0.6,
      },
    },
  };

  return (
    <div className={styles.navWrapper}>
      <div className={styles.sidebarMenuContainer}>
        <AnimatePresence
          initial={false}
          exitBeforeEnter={true}
          onExitComplete={() => null}
          className="w-100"
        >
          {expanded && (
            <motion.div
              variants={slideOut}
              onClick={(e) => e.stopPropagation()}
              initial="hidden"
              animate="visible"
              exit="exit"
              className={styles.sidebar}
            >
              <Navbar bg="light" variant="light" fixed="top">
                <Navbar.Collapse className="h-100">
                  <Container className="vh-100 position-sticky">
                    <div className="sticky-top bg-light">
                      <div className="d-flex justify-content-between my-1 align-items-center">
                        <div>
                          <Navbar.Brand href="/">Recipes</Navbar.Brand>
                        </div>
                        <Button
                          variant="link"
                          onClick={() => setExpanded(false)}
                        >
                          <GrClose />
                        </Button>
                      </div>
                    </div>
                    {session?.user && (
                      <Nav className="mr-auto d-block">
                        {(recipes ?? []).map((recipe) => (
                          <Nav.Link key={recipe.title} href={`/${recipe.slug}`}>
                            <div className="d-flex">
                              <div className="d-inline-block me-3">
                                {recipe.image && (
                                  <Image
                                    alt={recipe.title}
                                    src={urlFor(recipe.image)
                                      .width(60)
                                      .height(60)
                                      .auto("format")
                                      .url()}
                                  />
                                )}
                              </div>
                              <div>
                                <div className="d-block">
                                  <div className={styles.title}>
                                    {recipe.title}
                                  </div>
                                  <div className={styles.subtitle}>
                                    Time to make:{" "}
                                    {recipe.cookTime + recipe.prepTime}
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
            </motion.div>
          )}
        </AnimatePresence>
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
