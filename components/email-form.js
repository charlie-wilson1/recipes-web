import { useState } from "react";
import { Button, Form } from "react-bootstrap";
import { PropTypes } from "prop-types";

const EmailForm = ({ onEmailSubmit, disabled }) => {
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    onEmailSubmit(email);
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <h3 className="form-header">Login</h3>
        <div className="input-wrapper">
          <Form.Group>
            <Form.Label>Email address</Form.Label>
            <Form.Control
              placeholder="Enter your email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Group>
        </div>
        <div>
          <Button
            variant="success"
            size="sm"
            disabled={disabled}
            onClick={handleSubmit}
          >
            Send Magic Link
          </Button>
        </div>
      </form>
      <style jsx>{`
        form,
        label {
          display: flex;
          flex-flow: column;
          text-align: center;
        }
        .form-header {
          font-size: 22px;
          margin: 25px 0;
        }
        .input-wrapper {
          width: 80%;
          margin: 0 auto 20px;
        }
      `}</style>
    </>
  );
};

EmailForm.propTypes = {
  onEmailSubmit: PropTypes.function.isRequired,
  disabled: PropTypes.boolean.isRequired,
};

export default EmailForm;
