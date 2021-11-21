import styles from "../styles/Slug.module.css";
import ErrorPage from "next/error";
import { urlFor, PortableText } from "../lib/sanity";
import { getClient, sanityClient } from "../lib/sanity.server";
import {
  Accordion,
  Button,
  Card,
  Col,
  Container,
  Image,
  ListGroup,
  Row,
} from "react-bootstrap";
import { createRef, useEffect, useMemo, useRef, useState } from "react";
import { CgBowl } from "react-icons/cg";
import { IoMdStopwatch } from "react-icons/io";
import { GiCookingPot, GiBubblingBowl } from "react-icons/gi";
import YouTube from "react-youtube";
import { useRecipeContext } from "../store/recipeState";
import { PropTypes } from "prop-types";
import { jsPDF } from "jspdf";
import { toPng } from "html-to-image";
import { recipeQuery, recipeSlugsQuery } from "../lib/queries";
import DisplayTime from "../components/display-time";

export default function Recipe({ data }) {
  const { handleSetRecipes } = useRecipeContext();
  const printableContainerRef = createRef();

  if (!data?.currentRecipe?.slug) {
    return <ErrorPage statusCode={404} />;
  }

  const { currentRecipe, allRecipes } = data;

  useEffect(() => {
    handleSetRecipes(allRecipes);
  }, [allRecipes]);

  // setup to get/set width of window for image and video container
  const [windowWidth, setWindowWidth] = useState(0);
  const videoContainerRef = useRef(null);
  const [videoContainerWidth, setVideoContainerWidth] = useState(0);

  // git width of window for downloading image width
  useEffect(() => {
    if (typeof window !== "undefined") {
      setWindowWidth(window.innerWidth);
    }
  }, []);

  // get width of container to set width of video
  useEffect(() => {
    if (videoContainerRef.current) {
      setVideoContainerWidth(videoContainerRef.current.offsetWidth);
    }
  }, [videoContainerRef]);

  const ingredientListItem = (ingredient) => {
    return (
      <Col md="6" key={ingredient.title}>
        <ListGroup.Item as="li" key={ingredient.title}>
          <div className="d-flex justify-content-between">
            {ingredient.title}
            <span>{ingredient.quantity}</span>
          </div>
          <div className={styles.subtitle}>{ingredient.notes}</div>
        </ListGroup.Item>
      </Col>
    );
  };

  const getYouTubeDiv = (youTubeUrl) => {
    const uri = new URL(youTubeUrl);
    const youTubeId = uri.searchParams.get("v")?.toString();

    if (!youTubeId) {
      return;
    }

    const opts = {
      height: (videoContainerWidth / 16) * 9,
      width: videoContainerWidth - 80,
      playerVars: {
        autoplay: 0,
      },
    };

    return (
      <ListGroup.Item key={youTubeId}>
        <YouTube
          className={styles.video}
          videoId={youTubeId}
          id={youTubeId}
          opts={opts}
        />
      </ListGroup.Item>
    );
  };

  const {
    title,
    image,
    notes,
    cookTime,
    prepTime,
    restTime,
    youTubeUrls,
    ingredients,
    instructions,
    slug,
  } = currentRecipe;

  const timeCols = useMemo(() => (restTime ? 3 : 4), [restTime]);

  const iconStyle = { fontSize: "3em", marginBottom: "0.2em" };

  const printPage = async () => {
    if (printableContainerRef && slug) {
      expandAccordions();
      const content = printableContainerRef.current;
      const canvas = await toPng(content);
      const pdf = new jsPDF();
      pdf.addImage(canvas, "JPEG", 20, 20, 170, 160);
      pdf.save(`${slug}.pdf`);
    }
  };

  const expandAccordions = () => {
    const accordions =
      printableContainerRef.current.getElementsByClassName("accordion");

    Array.from(accordions).forEach((accordion) => {
      const collapsed = accordion.getElementsByClassName("collapse");
      Array.from(collapsed).forEach((c) => {
        c.classList.remove("collapse");
      });
    });
  };

  return (
    <Container fluid="md" className="my-4">
      <div ref={printableContainerRef}>
        <Row>
          <h1>{title}</h1>
        </Row>
        {windowWidth && image && (
          <Row>
            <Col>
              <Image
                className={`img-responsive ${styles.image}`}
                alt={title}
                src={urlFor(image)
                  .width(windowWidth)
                  .height(320)
                  .crop("focalpoint")
                  .fit("crop")
                  .auto("format")
                  .url()}
              />
            </Col>
          </Row>
        )}
        <Accordion defaultActiveKey="0" className="mt-5">
          <Card>
            <Accordion.Toggle
              as={Card.Header}
              eventKey="0"
              className="d-flex justify-content-center"
            >
              Cook Time
            </Accordion.Toggle>
            <Accordion.Collapse eventKey="0">
              <Card.Body>
                <Row>
                  <Col md={timeCols}>
                    <Row>
                      <CgBowl style={iconStyle} />
                    </Row>
                    <Row className="d-flex justify-content-center">
                      Prep:{" "}
                      <div className="d-flex justify-content-center">
                        {DisplayTime(prepTime)}
                      </div>
                    </Row>
                  </Col>
                  <Col md={timeCols}>
                    <Row>
                      <GiCookingPot style={iconStyle} />
                    </Row>
                    <Row className="d-flex justify-content-center">
                      Cook:{" "}
                      <div className="d-flex justify-content-center">
                        {DisplayTime(cookTime)}
                      </div>
                    </Row>
                  </Col>
                  <Col md={timeCols}>
                    <Row>
                      <IoMdStopwatch style={iconStyle} />
                    </Row>
                    <Row className="d-flex justify-content-center">
                      Total:{" "}
                      <div className="d-flex justify-content-center">
                        {DisplayTime(prepTime + cookTime)}
                      </div>
                    </Row>
                  </Col>
                  {restTime && (
                    <Col md={timeCols}>
                      <Row>
                        <GiBubblingBowl style={iconStyle} />
                      </Row>
                      <Row className="d-flex justify-content-center">
                        Rest/Marinade:{" "}
                        <div className="d-flex justify-content-center">
                          {restTime}
                        </div>
                      </Row>
                    </Col>
                  )}
                </Row>
              </Card.Body>
            </Accordion.Collapse>
          </Card>
        </Accordion>
        <Accordion defaultActiveKey="0" className="mt-5">
          <Card>
            <Accordion.Toggle
              as={Card.Header}
              eventKey="0"
              className="d-flex justify-content-center"
            >
              Ingredients
            </Accordion.Toggle>
            <Accordion.Collapse eventKey="0">
              <Card.Body>
                <ListGroup
                  as="ul"
                  className={`${styles.ingredientList} 'd-flex'`}
                >
                  {(ingredients ?? []).map((ingredient) =>
                    ingredientListItem(ingredient)
                  )}
                </ListGroup>
              </Card.Body>
            </Accordion.Collapse>
          </Card>
        </Accordion>
        {!!instructions && (
          <>
            <h3 className={styles.header}>Instructions</h3>
            <PortableText blocks={instructions} />
          </>
        )}
        {!!notes && (
          <>
            <h3 className={styles.header}>Notes</h3>
            <PortableText blocks={notes} />
          </>
        )}
      </div>
      {(youTubeUrls ?? []).length > 0 && (
        <>
          <Accordion defaultActiveKey="0" className="my-5">
            <Card>
              <Accordion.Toggle
                as={Card.Header}
                eventKey="0"
                className="d-flex justify-content-center"
              >
                Tutorials
              </Accordion.Toggle>
              <Accordion.Collapse eventKey="0">
                <Card.Body ref={videoContainerRef}>
                  <ListGroup as="ul" className={styles.ingredients__list}>
                    {youTubeUrls.map((url) => getYouTubeDiv(url))}
                  </ListGroup>
                </Card.Body>
              </Accordion.Collapse>
            </Card>
          </Accordion>
        </>
      )}
      <div className="d-flex">
        <Button
          type="button"
          variant="outline-success"
          onClick={printPage}
          className={`${styles.printButton} mx-auto`}
        >
          Print
        </Button>
      </div>
    </Container>
  );
}

Recipe.propTypes = {
  data: PropTypes.object.isRequired,
};

Recipe.auth = true;

export async function getStaticProps({ params, preview = false }) {
  const { currentRecipe, allRecipes } = await getClient(preview).fetch(
    recipeQuery,
    {
      slug: params.slug,
    }
  );

  return {
    props: {
      data: { currentRecipe, allRecipes },
    },
    revalidate: 1,
  };
}

export async function getStaticPaths() {
  const recipeSlugs = await sanityClient.fetch(recipeSlugsQuery);
  return {
    paths: recipeSlugs.map((slug) => ({ params: { slug } })),
    fallback: true,
  };
}
