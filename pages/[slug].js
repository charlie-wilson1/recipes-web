import styles from '../styles/Slug.module.css';
import ErrorPage from 'next/error';
import { useRouter } from 'next/router';
import { groq } from 'next-sanity';
import { usePreviewSubscription, urlFor, PortableText } from '../lib/sanity';
import { getClient } from '../lib/sanity.server';
import { Accordion, Card, Col, Container, Image, ListGroup, Row } from 'react-bootstrap'
import { useEffect, useRef, useState } from "react";
import { CgBowl  } from 'react-icons/cg';
import { IoMdStopwatch  } from 'react-icons/io';
import { GiCookingPot } from 'react-icons/gi';
import YouTube from "react-youtube";
import { useRecipeContext } from "../store/recipeState";

const currentRecipeQuery = groq`
  *[_type == "recipe" && slug.current == $slug][0] {
    _id,
    title,
    image,
    notes,
    cookTime,
    prepTime,
    youTubeUrls,
    ingredients,
    instructions,
    "slug": slug.current
  }
`;

export default function Recipe({data}) {
  const router = useRouter();
  const { handleSetRecipes } = useRecipeContext();

  useEffect(() => {
    handleSetRecipes(data.allRecipes);
  }, [handleSetRecipes]);

  // setup to get/set width of window for image and video container
  const [windowWidth, setWindowWidth] = useState(0);
  const videoContainerRef = useRef(null);
  const [videoContainerWidth, setVideoContainerWidth] = useState(0);

  // git width of window for downloading image width
  useEffect(() => {
    if (typeof window !== "undefined"){
      setWindowWidth(window.innerWidth);
    }
  }, [])

  // get width of container to set width of video
  useEffect(() => {
    if (videoContainerRef.current) {
      setVideoContainerWidth(videoContainerRef.current.offsetWidth);
    }
  }, [videoContainerRef]);

  const ingredientListItem = (ingredient) => {
    return (
      <Col md="6">
        <ListGroup.Item as="li" key={ingredient.title}>
          <div className="d-flex justify-content-between">
            {ingredient.title}
            <span>
              {ingredient.quantity} {ingredient.unit}
            </span>
          </div>
          <div className={styles.subtitle}>
            {ingredient.notes}
          </div>
        </ListGroup.Item>
      </Col>
    )
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
    }

    return (
      <ListGroup.Item key={youTubeId}>
        <YouTube 
          className={styles.video}
          videoId={youTubeId}
          id={youTubeId}
          opts={opts} />
      </ListGroup.Item>
    )
  };

  const {data: currentRecipe} = usePreviewSubscription(currentRecipeQuery, {
    params: {slug: data.currentRecipe?.slug},
    initialData: data.currentRecipe,
    enabled: data.currentRecipe?.slug,
  });

  if (!router.isFallback && !data.currentRecipe?.slug) {
    return <ErrorPage statusCode={404} />
  }

  const {title, image, notes, cookTime, prepTime, youTubeUrls, ingredients, instructions} = currentRecipe;
  const iconStyle = {fontSize: '3em', marginBottom: '0.2em'};

  return (
    <recipe>
      <Container fluid="md" className="my-4">
        <Row>
          <h1>{title}</h1>
        </Row>
        {windowWidth && (
          <Row>
            <Col>
              <Image 
                className={`img-responsive ${styles.image}`}
                alt={title}
                src={urlFor(image).width(windowWidth).height(320).crop('focalpoint').fit('crop').auto("format").url()} />
            </Col>
          </Row>
        )}
        <Accordion defaultActiveKey="0" className="mt-5">
          <Card>
            <Accordion.Toggle as={Card.Header} eventKey="0" className="d-flex justify-content-center">
              Cook Time
            </Accordion.Toggle>
            <Accordion.Collapse eventKey="0">
              <Card.Body>
                <Row>
                  <Col md={4}>
                    <Row>
                      <CgBowl style={iconStyle} />
                    </Row>
                    <Row className="d-flex justify-content-center">
                    Prep: {prepTime}
                    </Row>
                  </Col>
                  <Col md={4}>
                    <Row>
                      <GiCookingPot style={iconStyle} />
                    </Row>
                    <Row className="d-flex justify-content-center">
                    Cook: {cookTime}
                    </Row>
                  </Col>
                  <Col md={4}>
                    <Row>
                      <IoMdStopwatch style={iconStyle} />
                    </Row>
                    <Row className="d-flex justify-content-center">
                    Total: {prepTime + cookTime}
                    </Row>
                  </Col>
                </Row>
              </Card.Body>
            </Accordion.Collapse>
          </Card>
        </Accordion>
        <Accordion defaultActiveKey="0" className="mt-5">
          <Card>
            <Accordion.Toggle as={Card.Header} eventKey="0" className="d-flex justify-content-center">
                Ingredients
            </Accordion.Toggle>
            <Accordion.Collapse eventKey="0">
                <Card.Body>
                  <ListGroup as="ul" className='d-flex flex-row flex-wrap'>
                    {(ingredients ?? []).map(ingredient => ingredientListItem(ingredient))}
                  </ListGroup>
                </Card.Body>
            </Accordion.Collapse>
          </Card>
        </Accordion>
        {!!instructions && (
          <>
            <h3 className={styles.header}>Instructions</h3>
            <PortableText blocks={instructions} />
          </>)}
        {!!notes && (
          <>
            <h3 className={styles.header} >Notes</h3>
            <PortableText blocks={notes} />
          </>
        )}
        {(youTubeUrls ?? []).length > 0 && (
          <>
            <Accordion defaultActiveKey="0" className="my-5">
              <Card>
                <Accordion.Toggle as={Card.Header} eventKey="0" className="d-flex justify-content-center">
                    Tutorials
                </Accordion.Toggle>
                <Accordion.Collapse eventKey="0">
                    <Card.Body ref={videoContainerRef}>
                      <ListGroup as="ul" className={styles.ingredients__list}>
                      {youTubeUrls.map(url => getYouTubeDiv(url))}
                      </ListGroup>
                    </Card.Body>
                </Accordion.Collapse>
              </Card>
            </Accordion>
          </>
        )}
      </Container>
    </recipe>
  );
}

export async function getStaticProps({params}) {
  const currentRecipe = await getClient(true).fetch(currentRecipeQuery, {
    slug: params.slug,
  })

  const allRecipes = await getClient(true).fetch(
    groq`*[_type == "recipe" && defined(slug.current)][] {
      title,
      image,
      cookTime,
      prepTime,
      'slug': slug.current,
    }`
  );

  return {
    props: {
      data: {currentRecipe, allRecipes},
    },
  }
}

export async function getStaticPaths() {
  const paths = await getClient(true).fetch(
    groq`*[_type == "recipe" && defined(slug.current)][].slug.current`
  )

  return {
    paths: paths.map((slug) => ({params: {slug}})),
    fallback: true,
  }
}