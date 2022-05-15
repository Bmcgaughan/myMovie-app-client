import React from 'react';

import axios from 'axios';

import PropTypes from 'prop-types';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

import { Link } from 'react-router-dom';
import heartEmpty from '../../img/heart-empty.png';
import heartFull from '../../img/heart-full.png';

//importing stylesheet
import './movie-card.scss';

//Basic display of movies that are rendered on MainView
export class MovieCard extends React.Component {
  constructor() {
    super();
    this.state = {
      favoriteMovies: [],
    };
  }

  changeFavorites(mid, action) {}

  //getting users favorite movies to populate icons
  getFavorites(token) {
    let user = localStorage.getItem('user');
    axios
      .get(`https://whatdoiwatch.herokuapp.com/users/${user}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        this.setState({
          favoriteMovies: response.data.FavoriteMovies,
        });
      })
      .catch((e) => console.log(e));
  }

  //adding movie to users favorite list
  addFavMovie(mid) {
    console.log(mid);
    const userName = localStorage.getItem('user');
    const token = localStorage.getItem('token');

    axios
      .post(
        `https://whatdoiwatch.herokuapp.com/users/${userName}/favorites/${mid}`,
        '',
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((response) => {
        console.log(response);
      })
      .catch((e) => {
        console.log(e);
      });

    this.state.favoriteMovies.push(mid);
  }

  removeFavMovie(mid) {
    console.log(mid);
    const userName = localStorage.getItem('user');
    const token = localStorage.getItem('token');

    axios
      .delete(
        `https://whatdoiwatch.herokuapp.com/users/${userName}/favorites/${mid}`,

        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((response) => {
        console.log(response);
      })
      .catch((e) => {
        console.log(e);
      });

    const index = this.state.favoriteMovies.indexOf(mid);
    if (index !== -1) {
      this.state.favoriteMovies.splice(index, 1);
    }
  }

  favMovieHandle(mid) {
    if (this.state.favoriteMovies.includes(mid)) {
      return (
        <a href="#" onClick={() => this.removeFavMovie(mid)}>
          <img src={heartFull} className="fav-icon" alt="cam" />
        </a>
      );
    } else {
      return (
        <a href="#" onClick={() => this.addFavMovie(mid)}>
          <img src={heartEmpty} className="fav-icon" alt="cam" />
        </a>
      );
    }
  }

  componentDidMount() {
    const accessToken = localStorage.getItem('token');
    this.getFavorites(accessToken);
  }

  render() {
    const { movie } = this.props;
    return (
      <Card className="h-100 mcard">
        <div className="poster-wrapper">
          <Card.Img
            crossorigin="anonymous"
            variant="top"
            src={movie.ImagePath}
            className="poster-img"
          />
        </div>

        {this.favMovieHandle(movie._id)}

        <Card.Body className="d-flex flex-column">
          <Card.Title>{movie.Title}</Card.Title>
          <Card.Text>{movie.Genre.Name}</Card.Text>
          <Link className="mt-auto mov-link" to={`/movies/${movie._id}`}>
            <Button className="mov-button" variant="secondary">
              Open
            </Button>
          </Link>
        </Card.Body>
      </Card>
    );
  }
}

//setting up default values for the MovieCard properties
//ensuring values are strings and required
MovieCard.propTypes = {
  movie: PropTypes.shape({
    Title: PropTypes.string.isRequired,
    Description: PropTypes.string.isRequired,
    Genre: PropTypes.shape({
      Name: PropTypes.string,
    }),
    Director: PropTypes.shape({
      Name: PropTypes.string,
    }),
  }).isRequired,
};
