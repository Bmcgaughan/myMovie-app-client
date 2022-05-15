import React from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

//adding components to the main-view

import { RegistrationView } from '../registration-view/registration-view';
import { LoginView } from '../login-view/login-view';
import { MovieCard } from '../movie-card/movie-card';
import { MovieView } from '../movie-view/movie-view';
import { DirectorView } from '../director-view/director-view';
import { GenreView } from '../genre-view/genre-view';
import { ProfileView } from '../profile-view/profile-view';
import { Menubar } from '../navbar-view/navbar';

import { Container } from 'react-bootstrap';

//getting array of movies from remote and displaying as a list
export class MainView extends React.Component {
  constructor() {
    super();
    //initial state for main-view
    this.state = {
      movies: [],
      registered: null,
      user: null,
      favorites: null,
    };
  }

  componentDidMount() {
    let accessToken = localStorage.getItem('token');
    if (accessToken !== null) {
      this.setState({
        user: localStorage.getItem('user'),
      });
      this.getMovies(accessToken);
      this.getFavorites(accessToken);
    }
  }

  //once authenticated - request movies from API with token - recieve array of JSONS
  getMovies(token) {
    axios
      .get('https://whatdoiwatch.herokuapp.com/movies', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        this.setState({
          movies: response.data,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  //getting users favorite movies to populate icons
  getFavorites(token) {
    let user = localStorage.getItem('user');
    axios
      .get(`https://whatdoiwatch.herokuapp.com/users/${user}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        console.log(response.data.FavoriteMovies);
        this.setState({
          favorites: response.data.FavoriteMovies,
        });
      })
      .catch((e) => console.log(e));
  }

  //sets the selected movie state with value that is provided
  setSelectedMovie(newSelectedMovie) {
    this.setState({
      selectedMovie: newSelectedMovie,
    });
  }

  //when user is verified set state to current user
  onLoggedIn(userAuth) {
    this.setState({
      user: userAuth.user.Username,
    });
    localStorage.setItem('token', userAuth.token),
      localStorage.setItem('user', userAuth.user.Username);
    this.getMovies(userAuth.token);
    this.getFavorites(userAuth.token);
  }

  //placeholder to force the registration page
  onRegister(registered) {
    this.setState({
      registered,
    });
  }

  accessFavorites(mid) {
    if (this.state.favorites.length > 0 && this.state.favorites.includes(mid)) {
      return true;
    } else {
      return false;
    }
  }

  render() {
    const { movies, user, favorites } = this.state;

    //if a movie is selected show the Movie View details
    return (
      <Router>
        <Menubar user={user} />
        <Container>
          <Row className="main-view justify-content-md-center">
            <Route
              exact
              path="/"
              render={() => {
                if (!user)
                  return (
                    <Col>
                      <LoginView onLoggedIn={(user) => this.onLoggedIn(user)} />
                    </Col>
                  );
                if (movies.length === 0) return <div className="main-view" />;
                if (!favorites) return <div className="main-view" />;

                return movies.map((m) => (
                  <Col md={3} key={m._id} className="mcard">
                    <MovieCard
                      movie={m}
                      isFavorite={favorites.includes(m._id)}
                      favorites={favorites}
                      accessFavorites={(mid) => this.accessFavorites(mid)}
                    />
                  </Col>
                ));
              }}
            />

            <Route
              path="/register"
              render={() => {
                if (user) return <Redirect to="/" />;
                return <RegistrationView />;
              }}
            />

            <Route
              path="/movies/:movieId"
              render={({ match, history }) => {
                if (!user)
                  return (
                    <Col>
                      <LoginView onLoggedIn={(user) => this.onLoggedIn(user)} />
                    </Col>
                  );
                return (
                  <Col md={8}>
                    <MovieView
                      movie={movies.find((m) => m._id === match.params.movieId)}
                      onBackClick={() => history.goBack()}
                    />
                  </Col>
                );
              }}
            />

            <Route
              path="/directors/:name"
              render={({ match, history }) => {
                if (!user)
                  return (
                    <Col>
                      <LoginView onLoggedIn={(user) => this.onLoggedIn(user)} />
                    </Col>
                  );

                if (movies.length === 0) return <div className="main-view" />;
                return (
                  <Col md={12}>
                    <DirectorView
                      director={
                        movies.find(
                          (m) => m.Director.Name === match.params.name
                        ).Director
                      }
                      directorMovies={movies.filter((m) => {
                        return m.Director.Name === match.params.name;
                      })}
                      onBackClick={() => history.goBack()}
                    />
                  </Col>
                );
              }}
            />

            <Route
              path="/genres/:name"
              render={({ match, history }) => {
                if (!user)
                  return (
                    <Col>
                      <LoginView onLoggedIn={(user) => this.onLoggedIn(user)} />
                    </Col>
                  );
                if (movies.length === 0) return <div className="main-view" />;
                return (
                  <Col md={12}>
                    <GenreView
                      genre={
                        movies.find((m) => m.Genre.Name === match.params.name)
                          .Genre
                      }
                      genreMovies={movies.filter((m) => {
                        return m.Genre.Name === match.params.name;
                      })}
                      onBackClick={() => history.goBack()}
                    />
                  </Col>
                );
              }}
            />
            <Route
              path={`/users/${user}`}
              render={({ match, history }) => {
                if (!user)
                  return (
                    <Col>
                      <LoginView onLoggedIn={(user) => this.onLoggedIn(user)} />
                    </Col>
                  );
                if (movies.length === 0) return <div className="main-view" />;
                return (
                  <Col md={8}>
                    <ProfileView
                      history={history}
                      movies={movies}
                      user={user}
                      onBackClick={() => history.goBack()}
                    />
                  </Col>
                );
              }}
            />
          </Row>
        </Container>
      </Router>
    );
  }
}
