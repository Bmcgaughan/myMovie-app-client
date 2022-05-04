import React, { useState } from 'react';
import axios from 'axios';

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import './login-view.scss';

//login for user - taking username and password
export function LoginView(props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
  
    //sending post request to API with Username and Password
    axios
      .post('https://whatdoiwatch.herokuapp.com/login', {
        Username: username,
        Password: password,
      })
      .then((response) => {
        const data = response.data;
        props.onLoggedIn(data);
      })
      .catch((e) => {
        console.log('User does not exist');
      });

  };

  const handleRegister = (e) => {
    e.preventDefault();
    props.onRegister(true);
  };

  return (
    <Form className="login-form d-flex justify-content-md-center flex-column align-items-center">
      <div>
        <h1>What Do I Watch!</h1>
      </div>
      <Form.Group controlId="formUsername">
        <Form.Label>Username:</Form.Label>
        <Form.Control
          type="text"
          onChange={(e) => setUsername(e.target.value)}
        />
      </Form.Group>
      <Form.Group controlId="formPassword">
        <Form.Label>Password:</Form.Label>
        <Form.Control
          type="password"
          onChange={(e) => setPassword(e.target.value)}
        />
      </Form.Group>
      <Row className="buttons flex-column">
        <Button variant="danger" type="submit" onClick={handleSubmit}>
          Submit
        </Button>
        <Button variant="danger" type="submit" onClick={handleRegister}>
          Register
        </Button>
      </Row>
    </Form>
  );
}
