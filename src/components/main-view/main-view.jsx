import React from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';

//setting up redux and bringing in actions
import { connect } from 'react-redux';
import { setMovies, setFavorites, toggleFavorite } from '../../actions/actions';

//bootstrap imports
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

//adding components to the main-view
import { RegistrationView } from '../registration-view/registration-view';
import { LoginView } from '../login-view/login-view';
import MoviesList from '../movies-list/movies-list';
import { MovieView } from '../movie-view/movie-view';
import { DirectorView } from '../director-view/director-view';
import { GenreView } from '../genre-view/genre-view';
import { ProfileView } from '../profile-view/profile-view';
import { Menubar } from '../navbar-view/navbar';

import { Container } from 'react-bootstrap';

//getting array of movies from remote and displaying as a list
class MainView extends React.Component {
  constructor() {
    super();
    //initial state for main-view
    this.state = {
      registered: null,
      user: null,
    };
    this.accessFavorites = this.accessFavorites.bind(this);
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
        this.props.setMovies(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
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

  //sets the selected movie state with value that is provided
  setSelectedMovie(newSelectedMovie) {
    this.setState({
      selectedMovie: newSelectedMovie,
    });
  }

  //allowing other component to reference favorite movies
  accessFavorites() {
    return this.state.favorites;
  }

  //allowing other components to update favorite movies list
  updateFavorites(mid) {
    let favArray = this.state.favorites;
    if (!favArray) {
      return;
    }
    if (favArray.includes(mid)) {
      let index = favArray.indexOf(mid);
      console.log(index);
      favArray.splice(index, 1);
      this.setState({
        favorites: favArray,
      });
    } else {
      this.setState({
        favorites: [...this.state.favorites, mid],
      });
    }
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

  render() {
    const { user } = this.state;
    let { movies, favorites } = this.props;

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
                return <MoviesList movies={movies} favorites={favorites} />;
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
                      updateFavorites={(mid) => this.updateFavorites(mid)}
                      favorites={favorites}
                      directorMovies={movies.filter((m) => {
                        return m.Director.Name === match.params.name;
                      })}
                      accessFavorites={this.accessFavorites}
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
                      accessFavorites={this.accessFavorites}
                      updateFavorites={(mid) => this.updateFavorites(mid)}
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
                      accessFavorites={this.accessFavorites}
                      updateFavorites={(mid) => this.updateFavorites(mid)}
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
  };
};

export default connect(mapStateToProps, {
  setMovies,
  setFavorites,
  toggleFavorite,
})(MainView);
