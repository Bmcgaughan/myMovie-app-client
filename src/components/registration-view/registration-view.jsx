import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

import './registration-view.scss';

//user registration form taking necessary user details
export function RegistrationView(props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [birthday, setBirthday] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(username, password, email, birthday);
    props.onRegister(false);
  };

  return (
    <Form className="reg-form d-flex justify-content-md-center flex-column align-items-center">
      <div className="register-title">
    <h1>
      Register new acount
    </h1>
      </div>
      <Form.Group controlId="regUsername">
        <Form.Label>Username:</Form.Label>
        <Form.Control
          type="text"
          onChange={(e) => setUsername(e.target.value)}
        />
      </Form.Group>
      <Form.Group controlId="regPassword">
        <Form.Label>Password:</Form.Label>
        <Form.Control
          type="password"
          onChange={(e) => setPassword(e.target.value)}
        />
      </Form.Group>
      <Form.Group controlId="regEmail">
        <Form.Label>Email:</Form.Label>
        <Form.Control type="email" onChange={(e) => setEmail(e.target.value)} />
      </Form.Group>
      <Form.Group controlId="regBirthday">
        <Form.Label>Birthday:</Form.Label>
        <Form.Control
          type="date"
          onChange={(e) => setBirthday(e.target.value)}
        />
      </Form.Group>
      <Button className="register-button" variant="danger" type="submit" onClick={handleSubmit}>
        Submit
      </Button>
    </Form>

    // <form>
    //   <label>
    //     Username:
    //     <input
    //       type="text"
    //       value={username}
    //       onChange={(e) => setUsername(e.target.value)}
    //     />
    //   </label>
    //   <label>
    //     Password:
    //     <input
    //       type="password"
    //       value={password}
    //       onChange={(e) => setPassword(e.target.value)}
    //     />
    //   </label>
    //   <label>
    //     Email:
    //     <input
    //       type="email"
    //       value={email}
    //       onChange={(e) => setEmail(e.target.value)}
    //     />
    //   </label>
    //   <label>
    //     Birthday:
    //     <input
    //       type="date"
    //       value={birthday}
    //       onChange={(e) => setBirthday(e.target.value)}
    //     />
    //   </label>
    //   <button type="submit" onClick={handleSubmit}>
    //     Submit
    //   </button>
    // </form>
  );
}
