import styles from "../styles/Navbar.module.css";
import {
  Nav,
  Navbar,
  Container,
  Image,
  Button,
  Form,
  FormControl,
} from "react-bootstrap";
import { useEffect, useState } from "react";
import { useRecipeContext } from "../store/recipeState";
import { urlFor } from "../lib/sanity";
import { GrClose } from "react-icons/gr";
import { useSession, signOut, signIn } from "next-auth/client";
import { magic } from "../lib/magic";
import { motion, AnimatePresence } from "framer-motion";
import DisplayTime from "./display-time";

export default function RecipeNavbar() {
  const { recipes } = useRecipeContext();
  const [session, loading] = useSession();
  const [expanded, setExpanded] = useState(false);
  const [displayedRecipes, setDisplayedRecipes] = useState({});
  const [search, setSearch] = useState("");

  useEffect(() => {
    setDisplayedRecipes(recipes);
  }, [recipes]);

  useEffect(() => {
    const filteredRecipes = (recipes ?? []).filter((r) =>
      r.title.toLowerCase().includes(search.toLowerCase())
    );
    setDisplayedRecipes(search ? filteredRecipes : recipes);
  }, [search]);

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
    <div>
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
            <Navbar
              bg="light"
              variant="light"
              fixed="top"
              className="w-100 position-relative me-2"
            >
              <Navbar.Collapse className="h-100">
                <Container className="vh-100 me-1">
                  <div className="sticky-top bg-light mb-2">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <Navbar.Brand href="/">Recipes</Navbar.Brand>
                      </div>
                      <Button
                        variant="link"
                        onClick={() => setExpanded(false)}
                        className="px-2"
                      >
                        <GrClose />
                      </Button>
                    </div>
                  </div>
                  {session?.user && (
                    <>
                      <Form className="d-flex m-2">
                        <FormControl
                          type="search"
                          placeholder="Search"
                          aria-label="Search"
                          value={search}
                          onChange={(e) => setSearch(e.target.value)}
                        />
                      </Form>
                      <Nav className="mr-auto d-block w-100">
                        {(displayedRecipes ?? []).map((recipe) => (
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
                              <div className="d-inline-block">
                                <div className="d-block">
                                  <div className={styles.title}>
                                    {recipe.title}
                                  </div>
                                  <div className={styles.subtitle}>
                                    Time to make:{" "}
                                    {DisplayTime(
                                      recipe.cookTime + recipe.prepTime
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </Nav.Link>
                        ))}
                      </Nav>
                    </>
                  )}
                </Container>
              </Navbar.Collapse>
            </Navbar>
          </motion.div>
        )}
      </AnimatePresence>
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
