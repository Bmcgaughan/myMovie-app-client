import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import axios from 'axios';

//connecting redux
import { connect } from 'react-redux';

//boostrap components
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

//redux actions
import { toggleFavorite } from '../../actions/actions';

//favorite asset images
import heartEmpty from '../../img/heart-empty.png';
import heartFull from '../../img/heart-full.png';

//importing stylesheet
import './movie-card.scss';

//Basic display of movies that are rendered on MainView
export class MovieCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      movieId: '',
    };
  }

  //calling the API to add a favorite Movie to the user
  addFavMovie(mid) {
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
  }

  //calling API to remove movie from the users list
  removeFavMovie(mid) {
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
  }

  //when clicked the movie is either added/removed from the user via the API
  //the state is then updated to either add/remove the movie
  favMovieClick(e) {
    e.preventDefault();
    let movId = this.props.movie._id;
    if (this.props.favorites.includes(movId)) {
      this.removeFavMovie(movId);
    } else {
      this.addFavMovie(movId);
    }
    this.props.toggleFavorite(movId);
  }

  // favMovieClick(e) {
  //   e.preventDefault();
  //   if (this.state.favorited) {
  //     this.setState({
  //       favorited: false,
  //     });
  //     this.removeFavMovie(this.state.movieId);
  //     this.props.updateFavorites(this.state.movieId);
  //   } else {
  //     this.setState({
  //       favorited: true,
  //     });
  //     this.addFavMovie(this.state.movieId);
  //     this.props.updateFavorites(this.state.movieId);
  //   }
  // }

  favMovieHandle(mid) {
    if (this.props.favorites.includes(mid)) {
      return heartFull;
    } else {
      return heartEmpty;
    }
  }

  // favMovieHandle(fav) {
  //   if (fav) {
  //     return heartFull;
  //   } else {
  //     return heartEmpty;
  //   }
  // }

  // componentDidMount() {
  //   const accessToken = localStorage.getItem('token');
  //   this.setState({
  //     favorited: this.props.isFavorite,
  //     movieId: this.props.movie._id,
  //     favoriteMovies: this.props.favorites,
  //   });
  // }

  render() {
    const { movie, isFavorite, favorites } = this.props;
    return (
      <Card className="h-100 mcard">
        <div className="poster-wrapper">
          <Card.Img
            crossOrigin="anonymous"
            variant="top"
            src={movie.ImagePath}
            className="poster-img"
          />
        </div>

        <a href="#" onClick={(e) => this.favMovieClick(e)}>
          <img
            src={this.favMovieHandle(movie._id)}
            className="fav-icon"
            alt="cam"
          />
        </a>

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

const mapStateToProps = (state) => {
  return {
    movies: state.movies,
    favorites: state.favorites,
  };
};

export default connect(mapStateToProps, {
  toggleFavorite,
})(MovieCard);
