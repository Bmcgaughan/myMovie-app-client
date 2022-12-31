import React from 'react';
import { Link, useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';

import axios from 'axios';

//connecting redux
import { connect } from 'react-redux';

//boostrap components
import Card from 'react-bootstrap/Card';

//redux actions
import { toggleFavorite } from '../../actions/actions';

//favorite asset images
import heartEmpty from '../../img/heart-empty.png';
import heartFull from '../../img/heart-full.png';
import missingImg from '../../img/missing_image.png';

//importing stylesheet
import './movie-card.scss';

//Basic display of movies that are rendered on MainView
export class MovieCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      movieId: '',
      ImageErr: null,
    };
  }

  //calling the API to add a favorite Movie to the user
  addFavMovie(mid) {
    const userName = localStorage.getItem('user');
    const token = localStorage.getItem('token');

    axios
      .post(
        `https://whatdoiwatch-api-go.onrender.com/users/${userName}/favorites/${mid}`,
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
        `https://whatdoiwatch-api-go.onrender.com/users/${userName}/favorites/${mid}`,

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
    //toggle state to force refresh
    this.props.toggleFavorite(movId);
  }

  favMovieHandle(mid) {
    if (this.props.favorites.includes(mid)) {
      return heartFull;
    } else {
      return heartEmpty;
    }
  }

  handleImageError = (url, retries = 5) => {
    const image = new Image();
    console.log(image);
    image.onerror = () => {
      if (retries > 0) {
        console.log('called');
        this.handleImageError(url, retries - 1);
      } else {
        console.log('error');
      }
      img.src = url;
    };
  };

  //http://image.tmdb.org/t/p/original/70yK1hRyyQiwqstpMTHZCpcnP7.jpg
  render() {
    const { movie, onMovieClick, lazy } = this.props;
    return (
      <Card className="h-100 mcard">
        <div className="poster-wrapper">
          <Card.Img
            onClick={onMovieClick(movie._id)}
            crossOrigin="anonymous"
            variant="top"
            src={movie.imagePath}
            onError={(e) => {
              let image = new Image();
              image.src = e.target.src;
              setTimeout(() => {
                image = new Image();
                image.src = e.target.src;
              }, 4000);
              image.onerror = () => {
                console.log('error');
                e.target.src = missingImg;
                e.target.style.height = '330px';
              };
            }}
            // onError={(e) => {
            //   e.onerror = null;
            //   e.target.src = missingImg;
            //   e.target.style.height = '330px';
            // }}
            loading={lazy}
            className="poster-img"
          />
        </div>
        <a
          href="#"
          onClick={(e) => this.favMovieClick(e)}
          data-toggle="tooltip"
          data-placement="top"
          title="Add to Favorites"
        >
          <img
            src={this.favMovieHandle(movie._id)}
            className="fav-icon"
            alt="cam"
          />
        </a>

        <Card.Body
          className="d-flex flex-column"
          onClick={onMovieClick(movie._id)}
        >
          <Card.Title>{movie.title}</Card.Title>
          {movie.network && <Card.Text>{movie.network}</Card.Text>}
        </Card.Body>
      </Card>
    );
  }
}

//setting up default values for the MovieCard properties
//ensuring values are strings and required
MovieCard.propTypes = {
  movie: PropTypes.shape({
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    genre: PropTypes.shape({
      name: PropTypes.string,
    }),
    director: PropTypes.shape({
      name: PropTypes.string,
    }),
  }),
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
