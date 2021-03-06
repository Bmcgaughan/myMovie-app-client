import React from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';

//setting up redux and bringing in actions
import { connect } from 'react-redux';

import {
  setMovies,
  setFavorites,
  setUser,
  setMostLiked,
  setRecommended,
  setTrending,
} from '../../actions/actions';

//bootstrap imports
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

//adding components to the main-view
import { RegistrationView } from '../registration-view/registration-view';
import { LoginView } from '../login-view/login-view';
import MoviesList from '../movies-list/movies-list';
import MovieView from '../movie-view/movie-view';
import DirectorView from '../director-view/director-view';
import GenreView from '../genre-view/genre-view';
import ProfileView from '../profile-view/profile-view';
import AllShows from '../all-show-view/all-show-view';
import Menubar from '../navbar-view/navbar';
import LoadingSpinner from '../spinner/spinner';

import { Container } from 'react-bootstrap';

//getting array of movies from remote and displaying as a list
class MainView extends React.Component {
  constructor() {
    super();
    //initial state for main-view
    this.state = {
      registered: null,
    };
  }

  componentDidMount() {
    //seeing if user is logged in
    let accessToken = localStorage.getItem('token');
    if (accessToken !== null) {
      this.props.setUser(localStorage.getItem('user'));
      this.getMovies(accessToken);
      this.getForYou(accessToken);
      this.getTrending(accessToken);
      this.getMostLiked(accessToken);
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
        this.props.setMovies(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  getForYou(token) {
    axios
      .get('https://whatdoiwatch.herokuapp.com/foryou', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        this.props.setRecommended(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  getMostLiked(token) {
    axios
      .get('https://whatdoiwatch.herokuapp.com/mostliked', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        this.props.setMostLiked(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  getTrending(token) {
    axios
      .get(`https://whatdoiwatch.herokuapp.com/trending`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        if (response.status === 201) {
          this.props.setTrending(response.data);
        } else {
          this.props.setTrending([]);
        }
      })
      .catch((e) => console.log(e));
  }

  //getting users favorite movies to populate icons
  getFavorites(token) {
    //hold rendering movie-list until favorites are returned
    this.props.setFavorites('');
    let user = localStorage.getItem('user');
    axios
      .get(`https://whatdoiwatch.herokuapp.com/users/${user}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        this.props.setFavorites(response.data.FavoriteMovies);
      })
      .catch((e) => console.log(e));
  }

  //when user is verified set state to current user
  onLoggedIn(userAuth) {
    this.props.setUser(userAuth.user.Username);
    localStorage.setItem('token', userAuth.token),
      localStorage.setItem('user', userAuth.user.Username);
    this.getMovies(userAuth.token);
    this.getForYou(userAuth.token);
    this.getTrending(userAuth.token);
    this.getMostLiked(userAuth.token);
    this.getFavorites(userAuth.token);
  }

  //placeholder to force the registration page
  onRegister(registered) {
    this.setState({
      registered,
    });
  }

  checkDetails(id) {
    let movie = this.props.movies.find((m) => m._id === id);
    return movie;
  }

  render() {
    let { user, movies, favorites } = this.props;
    let { trending } = this.state;

    //if a movie is selected show the Movie View details
    return (
      <Router>
        <Menubar user={user} />
        <Container>
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
              if (!favorites) return <div className="main-view" />;
              return <MoviesList favorites={favorites} />;
            }}
          />
          <Route
            path="/allshows"
            render={() => {
              if (!user)
                return (
                  <Col>
                    <LoginView onLoggedIn={(user) => this.onLoggedIn(user)} />
                  </Col>
                );
              if (!movies) return <div className="main-view" />;
              return <AllShows />;
            }}
          />

          <Row className="main-view justify-content-sm-center">
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
                if (movies.length === 0)
                  return (
                    <div className="main-view">
                      <LoadingSpinner />
                    </div>
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

let mapStateToProps = (state) => {
  return {
    movies: state.movies,
    favorites: state.favorites,
    recommended: state.recommended,
    trending: state.trending,
    mostLiked: state.mostLiked,
    user: state.user,
  };
};

export default connect(mapStateToProps, {
  setMovies,
  setFavorites,
  setUser,
  setMostLiked,
  setRecommended,
  setTrending,
})(MainView);
