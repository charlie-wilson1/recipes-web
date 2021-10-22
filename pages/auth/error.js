import { signIn } from "next-auth/react";
import { useEffect } from "react";
import { Card } from "react-bootstrap";

export default function Error() {
  useEffect(() => {
    signIn();
  }, []);

  return (
    <Card
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        marginTop: "-50px",
        marginLeft: "-50px",
        width: "18rem",
      }}
    >
      <Card.Body>
        <Card.Title>Error</Card.Title>
        <Card.Text>
          Something went wrong. Redirecting you to the appropriate page now.
        </Card.Text>
      </Card.Body>
    </Card>
  );
}
