import React from 'react';
import axios from 'axios';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

//adding components to the main-view

import { RegistrationView } from '../registration-view/registration-view';
import { LoginView } from '../login-view/login-view';
import { MovieCard } from '../movie-card/movie-card';
import { MovieView } from '../movie-view/movie-view';

//getting array of movies from remote and displaying as a list
export class MainView extends React.Component {
  constructor() {
    super();
    //initial state for main-view
    this.state = {
      movies: [],
      selectedMovie: null,
      registered: null,
      user: null,
    };
  }
  componentDidMount() {
    axios
      .get('https://whatdoiwatch.herokuapp.com/movies')
      .then((response) => {
        this.setState({ movies: response.data });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  getMovies(token){
    axios.get('https://whatdoiwatch.herokuapp.com/movies', {
      headers: {Authorization: `Bearer ${token}`}
    }).then((response) =>{
      this.setState({
        movies: response.data
      })
    }).catch((error) =>{
      console.log(error)
    })
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
      user : userAuth.user.Username
    });
    localStorage.setItem('token', userAuth.token),
    localStorage.setItem('user', userAuth.user.Username)
    this.getMovies(userAuth.token)
  }

  //placeholder to force the registration page
  onRegister(registered) {
    this.setState({
      registered,
    });
  }

  render() {
    const { movies, selectedMovie, user, registered } = this.state;

    //forcing a registration form for testing
    if (registered) {
      return <RegistrationView onRegister={(bool) => this.onRegister(bool)} />;
    }

    //if user is no logged in - force a login form
    if (!user) {
      return (
        <LoginView
          onLoggedIn={(user) => this.onLoggedIn(user)}
          onRegister={(bool) => this.onRegister(bool)}
        />
      );
    }

    if (movies.length === 0)
      return <div className="main-view">The list is empty</div>;

    //if no movie is selected show the list -
    //if a movie is selected show the Movie View details
    return (
      <Row className="main-view justify-content-md-center">
        {selectedMovie ? (
          <Col md={8}>
            <MovieView
              movie={selectedMovie}
              onBackClick={(newSelectedMovie) => {
                this.setSelectedMovie(newSelectedMovie);
              }}
            />
          </Col>
        ) : (
          movies.map((movie) => (
            <Col md={3}>
              <MovieCard
                key={movie._id}
                movie={movie}
                onMovieClick={(movie) => {
                  this.setSelectedMovie(movie);
                }}
              />
            </Col>
          ))
        )}
      </Row>
    );
  }
}
