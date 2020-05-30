import React, { useState } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import "./App.css";

const Home = () => {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();

  const signInbtn = () => {
    let data = {
      email: email,
      password: password,
    };
    fetch(
      "http://ec2-35-175-237-84.compute-1.amazonaws.com:8060/api/v0/users/signin",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    )
      .then((response) => {
        if (response.status !== 201) {
          switch (response.status) {
            case 401:
              alert("Incorrect password!!!");
              break;
            case 409:
              alert("Incorrect email!!!");
              break;
            default:
              break;
          }
          throw new Error();
        } else {
          return response.json();
        }
      })
      .then((datas) => {
        const token = datas.token;
        window.location = "/store?token=" + token;
      })
      .catch((error) => {
        console.error("Error:", error);
      });
    // window.location = "/store/";
  };

  const signUpbtn = () => {
    let data = {
      email: email,
      password: password,
    };
    fetch(
      "http://ec2-35-175-237-84.compute-1.amazonaws.com:8060/api/v0/signup/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    )
      .then((response) => {
        if (response.status !== 201) {
          switch (response.status) {
            case 500:
              alert("Server error");
              break;
            case 409:
              alert("Email already exist");
              break;
            default:
              break;
          }
          throw new Error();
        } else {
          return response.json();
        }
      })
      .then((datas) => {
        signInbtn();
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  return (
    <Container fluid style={{ height: "100vh" }}>
      <Row>
        <Col style={{ backgroundColor: "black", height: "100vh" }}>
          <div
            style={{
              position: "absolute",
              left: "10%",
              top: "15%",
              fontSize: 200,
              color: "white",
            }}
          >
            GAME
            <br />
            STORE
          </div>
          ,
        </Col>
        <Col
          style={{
            margin: "auto",
            width: "50%",
            padding: "20px",
          }}
        >
          <div>
            <Form
              style={{
                border: "3px solid black",
                padding: 30,
              }}
            >
              <Form.Group controlId="formBasicEmail">
                <Form.Label column="lg">Email address</Form.Label>
                <Form.Control
                  onChange={(event) => setEmail(event.target.value)}
                  size="lg"
                  type="email"
                  placeholder="Enter email"
                />
                <Form.Text column="lg" lg={2} className="text-muted">
                  We'll never share your email with anyone else.
                </Form.Text>
              </Form.Group>

              <Form.Group controlId="formBasicPassword">
                <Form.Label column="lg">Password</Form.Label>
                <Form.Control
                  size="lg"
                  type="password"
                  placeholder="Password"
                  onChange={(event) => setPassword(event.target.value)}
                />
              </Form.Group>
              <Form.Group size="lg" controlId="formBasicCheckbox">
                <Form.Check size="lg" type="checkbox" label="Check me out" />
              </Form.Group>
              <Form.Row>
                <Col>
                  <Button size="lg" variant="primary" onClick={signInbtn} block>
                    SIGN IN
                  </Button>
                </Col>
                <Col>
                  <Button size="lg" variant="primary" onClick={signUpbtn} block>
                    SIGN UP
                  </Button>
                </Col>
              </Form.Row>
            </Form>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Home;
