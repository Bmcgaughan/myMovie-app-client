import React from 'react';
import axios from 'axios';

import LoadingSpinner from '../spinner/spinner';

import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import { connect } from 'react-redux';
import { setMovies } from '../../actions/actions';

import './movie-view.scss';
import RecommendedView from '../recommended-view/recommended-view';

//showing details once MovieCard is clicked
class MovieView extends React.Component {
  constructor() {
    super();
    //initial state for main-view
    this.state = {
      gettingReco: null,
      recommended: null,
    };
    this.showRecos = this.showRecos.bind(this);
  }

  getRecos() {
    let accessToken = localStorage.getItem('token');
    axios
      .get(
        `https://whatdoiwatch.herokuapp.com/movies/recommended/${this.props.movie.odbID}`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      )
      .then((response) => {
        this.setState({
          recommended: response.data,
        });
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  showRecos() {
    console.log('called', this.state.recommended.exist)
    if (!this.state.recommended) return;
    let resultsArr = [];

    if (this.state.recommended.exist) {
      this.state.recommended.exist.forEach((id) => {
        resultsArr.push(this.props.movies.find(id));
      });
    }
    console.log(resultsArr);
  }

  //resetting window to top for component
  componentDidMount() {
    window.scrollTo(0, 0);
    // this.getRecos(accessToken);
  }

  render() {
    const { movie, onBackClick, movies } = this.props;
    const { recommended, gettingReco } = this.state;

    return (
      <div className="movie-view">
        <Row className="details-wrapper">
          <Col lg={6}>
            <div className="movie-poster d-flex">
              <img src={movie.ImagePath} crossOrigin="anonymous" />
            </div>
          </Col>
          <Col lg={6} className="d-flex flex-column">
            <div className="movie-details align-self-center">
              <div className="movie-title mov-section">
                <span className="value">
                  <h3>{movie.Title}</h3>
                </span>
                <span className="value">{movie.Genre.Name}</span>
              </div>
              <div className="movie-actors mov-section">
                <span className="value">
                  {movie.Actors ? movie.Actors.join(' / ') : ''}
                </span>
              </div>
              <div className="movie-description mov-section">
                <span className="value">{movie.Description}</span>
              </div>
              <div className="movie-director mov-section">
                <span className="label">Director: </span>
                <span className="value">
                  {movie.Director.Name ? movie.Director.Name : 'N/A'}
                </span>
              </div>
              <div className="movie-rating mov-section">
                <span className="label">Rating: </span>
                <span className="value">
                  {movie.Rating ? movie.Rating : 'N/A'}
                </span>
              </div>
            </div>
            <div className="button-wrapper">
              {/* <Link
                to={`/directors/${movie.Director.Name}`}
                className="movie-opt"
              >
                {movie.Director.Name ? (
                  <Button variant="secondary">More from this Director</Button>
                ) : (
                  <Button disabled variant="secondary">
                    More from this Director
                  </Button>
                )}
              </Link> */}
              <Link to={`/genres/${movie.Genre.Name}`} className="movie-opt">
                {movie.Genre.Name ? (
                  <Button variant="secondary">More {movie.Genre.Name}</Button>
                ) : (
                  <Button disabled variant="secondary">
                    More from this Genre
                  </Button>
                )}
              </Link>
              <Button
                className="reco-button"
                variant="secondary"
                onClick={() => this.getRecos()}
              >
                More Shows Like This
              </Button>
              <Button
                variant="secondary"
                className="back-btn"
                onClick={() => {
                  onBackClick();
                }}
              >
                Back
              </Button>
            </div>
          </Col>
        </Row>
        <Row>
          {recommended && this.showRecos()}
          {/* {recommended && movies.map((m) => <RecommendedView movie={m} />)} */}
          {/* {movies.map((m) => (
            <RecommendedView movie={m} />
          ))} */}
        </Row>
        {/* {gettingReco && (
          <div className="reco-view">
            <h3>Recommended based on this Show:</h3>
            {!recommended && <LoadingSpinner />}
          </div>
        )} */}
      </div>
    );
  }
}

MovieView.propTypes = {
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

  onBackClick: PropTypes.func.isRequired,
};

let mapStateToProps = (state) => {
  return {
    movies: state.movies,
  };
};

export default connect(mapStateToProps, {
  setMovies,
})(MovieView);
