import React from 'react';
import axios from 'axios';

import LoadingSpinner from '../spinner/spinner';

import { Link } from 'react-router-dom';
import { withRouter } from 'react-router-dom';

import PropTypes from 'prop-types';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import { connect } from 'react-redux';
import { setMovies, addMovies } from '../../actions/actions';

import './movie-view.scss';
import MovieCard from '../movie-card/movie-card';
import { WindowPlus } from 'react-bootstrap-icons';

//showing details once MovieCard is clicked
class MovieView extends React.Component {
  constructor() {
    super();
    //initial state for main-view
    this.state = {
      movieDisplay: '',
      gettingReco: undefined,
      recommended: null,
    };
    this.showRecos = this.showRecos.bind(this);
  }

  getRecos(movie) {
    if (movie.recommended && movie.recommended.length > 0) {
      this.showRecos(movie.recommended, true);
      return;
    }
    let accessToken = localStorage.getItem('token');
    this.setState({ gettingReco: 'get' });
    axios
      .get(
        `https://whatdoiwatch-api-go.onrender.com/tv/recommended/${this.props.movie.odbid}`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      )
      .then((response) => {
        this.showRecos(response.data, false);
        this.props.addMovies(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  showRecos(recommended, exist) {
    if (!recommended) return;

    let displayList = [];

    if (recommended && exist && recommended.length > 0) {
      existDetails = this.props.movies.filter((m) => {
        if (recommended.includes(m.odbid)) {
          return m;
        }
      });
    }

    displayList = exist ? existDetails : recommended;

    this.setState(
      {
        recommended: [...displayList],
      },
      () => {
        this.setState({ gettingReco: 'complete' });
      }
    );
  }

  //resetting window to top for component
  componentDidMount() {
    window.scrollTo(0, 0);
  }

  handleOnItemClick = (param) => (e) => {
    const { history } = withRouter;
    this.setState({
      recommended: null,
      gettingReco: undefined,
    });
    this.props.history.push(`/movies/${param}`);
  };

  render() {
    const { movie, onBackClick, movies } = this.props;
    const { recommended, gettingReco } = this.state;

    const showDisplay = movies.find(
      (m) => m.odbid == this.props.match.params.movieId
    );

    return (
      <div className="movie-view">
        <Row className="details-wrapper">
          <Col lg={6}>
            <div className="movie-poster d-flex">
              <img src={showDisplay.imagepath} crossOrigin="anonymous" />
            </div>
          </Col>
          <Col lg={6} className="d-flex flex-column">
            <div className="movie-details align-self-center">
              <div className="movie-title mov-section">
                <span className="value">
                  <h3>{showDisplay.title}</h3>
                </span>
                <span className="value">{showDisplay.genre.Name}</span>
              </div>
              <div className="movie-actors mov-section">
                <span className="value">
                  {showDisplay.actors ? showDisplay.actors.join(' / ') : ''}
                </span>
              </div>
              <div className="movie-description mov-section">
                <span className="value">{showDisplay.description}</span>
              </div>
              <div className="movie-director mov-section">
                <span className="label">Director: </span>
                <span className="value">
                  {showDisplay.director.Name
                    ? showDisplay.director.Name
                    : 'N/A'}
                </span>
              </div>
              <div className="movie-rating mov-section">
                <span className="label">Rating: </span>
                <span className="value">
                  {showDisplay.rating ? showDisplay.rating : 'N/A'}
                </span>
              </div>
            </div>
            <div className="button-wrapper">
              <Link
                to={`/genres/${showDisplay.genre.Name}`}
                className="movie-opt"
              >
                {showDisplay.genre.Name ? (
                  <Button variant="secondary">
                    More {showDisplay.genre.Name}
                  </Button>
                ) : (
                  <Button disabled variant="secondary">
                    More from this Genre
                  </Button>
                )}
              </Link>
              <Button
                className="reco-button"
                variant="secondary"
                onClick={() => this.getRecos(showDisplay)}
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

        {recommended && recommended.length > 0 && (
          <div className="recommended-wrap">
            <h3>Shows Similar to {movie.title}</h3>
          </div>
        )}
        {recommended && recommended.length === 0 && (
          <div className="recommended-wrap">
            <h3>Sorry! Nothing to Recommened...</h3>
          </div>
        )}

        {gettingReco === 'get' && (
          <Row className="justify-content-center">
            <LoadingSpinner />
          </Row>
        )}

        {gettingReco === 'complete' &&
          recommended &&
          recommended.length > 0 && (
            <Row>
              {recommended.map((m) => (
                <Col sm={3} xs={4} key={m.odbid}>
                  <MovieCard
                    movie={m}
                    onMovieClick={() => this.handleOnItemClick(m.odbid)}
                    lazy={''}
                  />
                </Col>
              ))}
            </Row>
          )}
      </div>
    );
  }
}

MovieView.propTypes = {
  movie: PropTypes.shape({
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    genre: PropTypes.shape({
      Name: PropTypes.string,
    }),
    director: PropTypes.shape({
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

export default withRouter(
  connect(mapStateToProps, {
    setMovies,
    addMovies,
  })(MovieView)
);
