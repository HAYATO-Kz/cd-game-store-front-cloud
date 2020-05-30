import React, { useState, useEffect } from "react";
import {
  Nav,
  Navbar,
  Button,
  Badge,
  ButtonGroup,
  Dropdown,
  Container,
  Row,
  Card,
  Col,
  Modal,
  Form,
  Table,
} from "react-bootstrap";
import "./App.css";

const Store = () => {
  const [uid, setUid] = useState();
  const [gameData, setGameData] = useState([{}]);
  const [cartData, setCartData] = useState([]);
  const [cartQuantity, setCardQuantity] = useState([]);
  const [cartTableData, setCartTableData] = useState();
  const [gameType, setGameType] = useState("All");
  const [loading, setLoading] = useState(true);
  const [selectedGame, setSelectedGame] = useState();
  const [selectedGameQuantity, setSelectedGameNumber] = useState(1);
  const [cartModalVisible, setCartModalVisible] = useState(false);
  const [selectedGameModalVisible, setSelectedGameModalVisible] = useState(
    false
  );

  const baseUrl = "localhost:8080";
  let total = 0;

  const selectGameModalHandle = (show) => {
    setSelectedGameModalVisible(show);
    setSelectedGameNumber(1);
  };

  const selectGameHandle = (pid) => {
    setSelectedGame(gameData.find((e) => e.pid === pid));
    selectGameModalHandle(true);
  };

  const addToCartHandle = async () => {
    let index = cartData.findIndex((e) => e == selectedGame.pid);
    if (index != -1) {
      alert("You already pick this product");
      return;
    }
    let newQuantity = selectedGame.quantity - selectedGameQuantity;
    if (newQuantity < 0) {
      alert("Not enough stock");
      return;
    }
    // console.l
    let cartD = cartData;
    cartD.push(selectedGame.pid);
    let cartQ = cartQuantity;
    cartQ.push(selectedGameQuantity);
    await setCartData(cartD);
    await setCardQuantity(cartQ);
    await upDateCartHandle();
    selectGameModalHandle(false);
    setCartModalVisible(false);
  };

  const buyNowHandle = () => {
    let data = {
      pids: cartData,
      quantities: cartQuantity,
      status: "purchase",
    };

    fetch(`http://${baseUrl}/api/v0/carts/${uid}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((res) => {
        if (res.status == 200) {
          setCartData([]);
          setCardQuantity([]);
          loadData();
          setCartModalVisible(false);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const openCartHandle = () => {
    fetch(`http://${baseUrl}/api/v0/carts/${uid}`)
      .then((response) => response.json())
      .then((data) => {
        const s = data.products;
        s.push({});
        setCartTableData(s);
      })
      .catch((err) => console.log(err));
    setCartModalVisible(true);
  };

  const updateCartData = (pid, newQuantity) => {
    let index = cartData.findIndex((e) => e == pid);
    let cartQ = cartQuantity;
    cartQ[index] = Number(newQuantity);
    setCardQuantity(cartQ);
  };

  const loadData = () => {
    if (gameType == "All") {
      fetch(`http://${baseUrl}/api/v0/products`)
        .then((response) => response.json())
        .then((data) => {
          setGameData(data.products);
          setLoading(false);
        })
        .catch((err) => console.log(err));
    } else {
      fetch(`http://${baseUrl}/api/v0/products/type/${gameType}`)
        .then((response) => response.json())
        .then((data) => {
          setGameData(data.products);
          setLoading(false);
        })
        .catch((err) => console.log(err));
    }
  };
  useEffect(() => {
    setLoading(true);
    loadData();
  }, [gameType]);

  useEffect(() => {
    let pid = [];
    let quantity = [];
    let u = "";
    async function set(id) {
      await setUid(id);
    }
    var queryString = decodeURIComponent(window.location.search);
    let token = queryString.split("token=")[1];
    if (!token) {
      window.location = "/";
    } else {
      var base64Url = token.split(".")[1];
      var base64 = decodeURIComponent(
        atob(base64Url)
          .split("")
          .map(function (c) {
            return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
          })
          .join("")
      );
      let user = JSON.parse(base64);
      let userID = user.uid;
      if (!userID) {
        window.location = "/";
      }
      u = userID;
      set(userID);
    }

    fetch(`http://${baseUrl}/api/v0/carts/${u}`)
      .then((response) => {
        if (response.status != 200) {
          throw new Error();
        }
        return response.json();
      })
      .then((data) => {
        data.products.map((d) => {
          pid.push(d.pid);
          quantity.push(d.quantity);
        });
        setCartData(pid);
        setCardQuantity(quantity);
      })
      .catch((err) => console.log(err));
  }, []);

  const upDateCartHandle = () => {
    let data = {
      uid: uid,
      pids: cartData,
      quantities: cartQuantity,
      status: "looking",
    };

    fetch(`http://${baseUrl}/api/v0/carts/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }).catch((error) => {
      console.error("Error:", error);
    });
    setCartModalVisible(false);
  };

  return (
    <div className="App" style={{ backgroundColor: "#485156" }}>
      <Navbar bg="dark" variant="dark">
        <Navbar.Brand href="#home">GAME STORE</Navbar.Brand>
        <Nav className="mr-auto" />
        <ButtonGroup>
          <Button variant="primary" onClick={openCartHandle}>
            CART <Badge variant="light">{cartData.length}</Badge>
          </Button>
          <Button
            variant="danger"
            onClick={() => {
              window.location = "/";
            }}
          >
            LOG OUT
          </Button>
        </ButtonGroup>
      </Navbar>
      <div>
        <Container>
          <Row>
            <Dropdown>
              <Dropdown.Toggle
                variant="success"
                id="dropdown-basic"
                style={{ marginTop: 20 }}
              >
                Game Type: {gameType}
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item onClick={() => setGameType("All")}>
                  All
                </Dropdown.Item>
                <Dropdown.Item onClick={() => setGameType("Action")}>
                  Action
                </Dropdown.Item>
                <Dropdown.Item onClick={() => setGameType("Adventure")}>
                  Adventure
                </Dropdown.Item>
                <Dropdown.Item onClick={() => setGameType("Horror")}>
                  Horror
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Row>
          <Row>
            {loading ? (
              <Col>Loading</Col>
            ) : (
              gameData.map((data) => (
                <Col
                  md={3}
                  style={{
                    alignItems: "center",
                    margin: "40px",
                  }}
                >
                  <Card
                    style={{ width: "18rem", textAlign: "center" }}
                    onClick={() => selectGameHandle(data.pid)}
                  >
                    <Card.Img variant="top" src={data.image} />
                    <Card.Body>
                      <Card.Title>{data.title}</Card.Title>
                      <Card.Text>{data.desc}</Card.Text>
                    </Card.Body>
                    <Card.Body>
                      <Card.Text>Quantity: {data.quantity}</Card.Text>
                      <Card.Text>Price: {data.price} Baht</Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
              ))
            )}
          </Row>
        </Container>
        <Modal
          show={selectedGameModalVisible}
          onHide={() => selectGameModalHandle(false)}
        >
          {selectedGame ? (
            <div>
              <Modal.Header closeButton>
                <Modal.Title>{selectedGame.title}</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Form.Group as={Row}>
                  <Col>
                    <Form.Control
                      as="select"
                      onChange={(ch) => setSelectedGameNumber(ch.target.value)}
                      on
                    >
                      <Form.Label>Selected</Form.Label>
                      <option value={1}>1</option>
                      <option value={2}>2</option>
                      <option value={3}>3</option>
                      <option value={4}>4</option>
                      <option value={5}>5</option>
                    </Form.Control>
                  </Col>
                  <Form.Label column>
                    {selectedGame.price * selectedGameQuantity} Baht
                  </Form.Label>
                </Form.Group>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="primary" onClick={addToCartHandle}>
                  Add to Cart
                </Button>
              </Modal.Footer>
            </div>
          ) : (
            <div>LOADING</div>
          )}
        </Modal>
        <Modal
          show={cartModalVisible}
          onHide={() => setCartModalVisible(false)}
        >
          <Modal.Header closeButton>
            <Modal.Title>Cart</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Table>
              <thead style={{ textAlign: "center" }}>
                <tr>
                  <th>Title</th>
                  <th>Quantity</th>
                  <th>Price</th>
                </tr>
              </thead>
              {cartTableData ? (
                <tbody style={{ textAlign: "center" }}>
                  {cartTableData.map((data, index) => {
                    if (index == 0) {
                      total = 0;
                    }

                    if (index == cartTableData.length - 1) {
                      return (
                        <tr>
                          <td>total</td>
                          <td>
                            <div />
                          </td>
                          <td>{total}</td>
                        </tr>
                      );
                    }
                    total += Number(data.quantity * data.price);
                    return (
                      <tr>
                        <td>{data.title}</td>
                        <td>
                          <Form.Control
                            as="select"
                            defaultValue={data.quantity}
                            onChange={(event) =>
                              updateCartData(data.pid, event.target.value)
                            }
                          >
                            <option value={1}>1</option>
                            <option value={2}>2</option>
                            <option value={3}>3</option>
                            <option value={4}>4</option>
                            <option value={5}>5</option>
                          </Form.Control>
                        </td>
                        <td>{data.quantity * data.price}</td>
                      </tr>
                    );
                  })}
                </tbody>
              ) : (
                <tr>
                  <td></td>
                  <td>0 order in cart</td>
                  <td></td>
                </tr>
              )}
            </Table>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={upDateCartHandle}
              disabled={cartTableData ? false : true}
            >
              UPDATE CART
            </Button>
            <Button
              variant="primary"
              onClick={buyNowHandle}
              disabled={cartTableData ? false : true}
            >
              Buy now
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
};

export default Store;
