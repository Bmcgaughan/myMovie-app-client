import React from 'react';

import { Navbar, Container, Nav, Button, NavbarBrand } from 'react-bootstrap';

import './nav-bar.scss';

export function Menubar({ user }) {
  const onLogOut = () => {
    localStorage.clear();
    window.open('/', '_self');
  };

  const isAuth = () => {
    if (typeof window == 'undefined') {
      return false;
    }
    if (localStorage.getItem('token')) {
      return localStorage.getItem('token');
    } else {
      return false;
    }
  };

  return (
    <Navbar
      className="main-nav nav-fill w-100"
      sticky="top"
      bg="dark"
      expand="lg"
      variant="dart"
    >
      <Navbar.Brand className="navbar-logo">What Do I Watch?</Navbar.Brand>
      <Navbar.Toggle aria-controls="responsive-navba-nav" />
      <Navbar.Collapse id="responsive-navbar-nav">
        <Nav className="ml-auto">
          {isAuth() && <Nav.Link href={`/users/$${user}`}></Nav.Link>}
          {isAuth() && (
            <Button
              variant="link"
              onClick={() => {
                this.onLogOut();
              }}
            >
              Log Out
            </Button>
          )}
          {!isAuth() && <Nav.Link href="/">Sign In</Nav.Link>}
          {!isAuth() && <Nav.Link href="/register">Register</Nav.Link>}
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}
