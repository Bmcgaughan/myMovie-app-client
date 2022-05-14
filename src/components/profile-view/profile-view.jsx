import React from 'react';

import { Link } from 'react-router-dom';

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
      username: '',
      password: '',
      email: '',
      birthday: '',
      favoriteMovies: [],
      usernameErr: '',
      passwordErr: '',
      emailErr: '',
      existingBirthday: '',
      existingEmail: '',
      existingUsername: '',
    };

    this.handleSubmit = this.handleSubmit.bind(this);
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
          existingEmail: response.data.Email,
          existingBirthday: response.data.Birthday,
          existingUsername: response.data.Username,
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

  getFormattedDate(date) {
    return `${date.substr(5, 2)}/${date.substr(8, 2)}/${date.substr(0, 4)}`;
  }

  validateEmail(email) {
    return email.match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
  }

  handleFormChange(event) {
    let fieldName = event.target.name;
    let fieldVal = event.target.value;
    this.setState({ ...this.state, [fieldName]: fieldVal });
  }

  validate() {
    let isReq = true;
    if (!this.state.username) {
      this.setUsernameErr = 'Username Required';
      isReq = false;
    } else if (this.state.username.length < 2) {
      this.setErr('setUsernameErr', 'Username must be more than 2 characters');
      isReq = false;
    }
    if (this.state.password && this.state.password.length < 6) {
      this.setErr('setPasswordErr', 'Password must be at least 6 characters');
      isReq = false;
    }
    if (this.state.email && !this.validateEmail(this.state.email)) {
      this.setErr('setEmailErr', ' Must use a valid Email Address');
      isReq = false;
    }

    return isReq;
  }

  setUsername(value) {
    this.setState({
      username: value,
    });
  }

  setPassword(value) {
    this.setState({
      password: value,
    });
  }

  setEmail(value) {
    this.setState({
      email: value,
    });
  }

  setBirthday(value) {
    this.setState({
      birthday: value,
    });
  }

  setErr(typeErr, value) {
    this.setState({ [typeErr]: value });
  }

  handleSubmit = (e) => {
    console.log('submitted');
    e.preventDefault();
    const userName = localStorage.getItem('user');
    let token = localStorage.getItem('token');
    const isReq = this.validate();
    console.log(isReq);
    if (isReq) {
      axios
        .put(
          `https://whatdoiwatch.herokuapp.com/users/${userName}`,
          {
            Username: this.state.username,
            Password: this.state.password,
            Email: this.state.email,
            Birthday: this.state.birthday,
          },

          { headers: { Authorization: `Bearer ${token}` } }
        )
        .then((response) => {
          console.log(response);
          this.setState({
            username: response.data.Username,
            password: response.data.Password,
            email: response.data.Email,
            birthday: response.data.Birthday,
          });
          localStorage.setItem('user', this.state.username);
          alert('profile updated successfully!');
          window.open(`/users/${this.state.username}`, '_self');
        });
    }
  };

  render() {
    const { movies, onBackClick } = this.props;
    const {
      favoriteMovies,
      username,
      email,
      birthday,
      existingBirthday,
      existingUsername,
      existingEmail,
    } = this.state;

    return (
      <Form
        className="reg-form d-flex justify-content-md-center flex-column align-items-center"
        onSubmit={(e) =>
          this.handleSubmit(
            e,
            this.Username,
            this.Password,
            this.Email,
            this.Birthday
          )
        }
      >
        <div className="register-title">
          <h1>View and Update Your Account</h1>
        </div>
        <Form.Group controlId="regUsername">
          <Form.Label>Username: ({existingUsername})</Form.Label>
          <Form.Control
            type="text"
            name="Username"
            onChange={(e) => this.setUsername(e.target.value)}
          />
          {this.usernameErr && <p>{this.usernameErr}</p>}
        </Form.Group>
        <Form.Group controlId="regPassword">
          <Form.Label>Password:</Form.Label>
          <Form.Control
            type="password"
            name="Password"
            onChange={(e) => this.setPassword(e.target.value)}
          />
          {this.passwordErr && <p>{this.passwordErr}</p>}
        </Form.Group>
        <Form.Group controlId="regEmail">
          <Form.Label>Email: ({existingEmail})</Form.Label>
          <Form.Control
            type="email"
            name="Email"
            onChange={(e) => this.setEmail(e.target.value)}
          />
          {this.emailErr && <p>{this.emailErr}</p>}
        </Form.Group>
        <Form.Group controlId="regBirthday">
          <Form.Label>
            Birthday: ({this.getFormattedDate(existingBirthday)})
          </Form.Label>
          <Form.Control
            type="date"
            name="Birthday"
            onChange={(e) => this.setBirthday(e.target.value)}
          />
        </Form.Group>
        <Button
          className="register-button"
          variant="danger"
          type="submit"
          onClick={this.handleSubmit}
        >
          Submit Changes
        </Button>
      </Form>
    );
  }
}
