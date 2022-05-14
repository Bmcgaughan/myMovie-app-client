import React from 'react';

import { Link } from 'react-router-dom';

import PropTypes from 'prop-types';
import axios from 'axios';

import {
  Card,
  Form,
  FormGroup,
  Col,
  Row,
  Container,
  FormControl,
  Button,
} from 'react-bootstrap';

export class ProfileView extends React.Component {
  constructor() {
    super();
    this.state = {
      username: null,
      password: null,
      email: null,
      birthday: null,
      favoriteMovies: [],
      usernameErr: null,
      passwordErr: null,
      emailErr: null,
    };
  }

  getUser(token) {
    let user = localStorage.getItem('user');
    axios
      .get(`https://whatdoiwatch.herokuapp.com/users/${user}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        this.setState({
          username: response.data.Username,
          email: response.data.Email,
          birthday: response.data.Birthday,
          favoriteMovies: response.data.FavoriteMovies,
        });
      })
      .catch((e) => console.log(e));
  }

  componentDidMount() {
    const accessToken = localStorage.getItem('token');
    this.getUser(accessToken);
  }

  onLoggedOut() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.setState({
      user: null,
    });
    window.open('/', '_self');
  }

  handleSubmit(e) {
    e.preventDefault();

    const isReq = validate();
    if (isReq) {
      axios
        .post('https://whatdoiwatch.herokuapp.com/users', {
          Username: username,
          Password: password,
          Email: email,
          Birthday: birthday,
        })
        .then((response) => {
          const date = response.data;
          alert('Success! - please log in');
          window.open('/', '_self');
        })
        .catch((error) => {
          console.log(error);
          alert('unable to register');
        });
    }
  }

  render() {
    const { movies, onBackClick } = this.props;
    const { favoriteMovies, username, password, email, birthday } = this.state;

    return (
      <Form className="reg-form d-flex justify-content-md-center flex-column align-items-center">
        <div className="register-title">
          <h1>View and Update Your Account</h1>
        </div>
        <Form.Group controlId="regUsername">
          <Form.Label>Username:</Form.Label>
          <Form.Control type="text" value={username} />
        </Form.Group>
        <Form.Group controlId="regPassword">
          <Form.Label>Password:</Form.Label>
          <Form.Control type="password" />
        </Form.Group>
        <Form.Group controlId="regEmail">
          <Form.Label>Email:</Form.Label>
          <Form.Control type="email" value={email} />
        </Form.Group>
        <Form.Group controlId="regBirthday">
          <Form.Label>Birthday:</Form.Label>
          <Form.Control type="date" value={birthday} />
        </Form.Group>
        <Button className="register-button" variant="danger" type="submit">
          Submit
        </Button>
      </Form>
    );
  }
}
