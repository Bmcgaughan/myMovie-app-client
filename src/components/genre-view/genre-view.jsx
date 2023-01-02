import React from 'react';
import PropTypes from 'prop-types';

import MovieCard from '../movie-card/movie-card';

import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

import { withRouter } from 'react-router-dom';

import './genre-view.scss';

class GenreView extends React.Component {
  //resetting window to top for component
  componentDidMount() {
    window.scrollTo(0, 0);
  }

  handleOnItemClick = (param) => (e) => {
    const { history } = withRouter;
    this.props.history.push(`/movies/${param}`);
  };

  render() {
    const { genre, onBackClick, genreMovies } = this.props;
    //generator for movies of the same genre - finds them in the full list of movies
    let genreCards = genreMovies.map((m) => (
      <Col md={3} key={m.obdid}>
        <MovieCard
          movie={m}
          onMovieClick={() => this.handleOnItemClick(m.odbid)}
        />
      </Col>
    ));

    return (
      <div className="genre-wrapper">
        <div className="movie-view tp-movie">
          <div className="movie-genre mov-section">
            <div>
              <h3>{genre.name}</h3>
            </div>
            <br></br>
            <span>{genre.description}</span>
          </div>
          <Button
            variant="secondary"
            onClick={() => {
              onBackClick();
            }}
          >
            Back
          </Button>
        </div>
        <div className="movie-view bt-movie">
          <div className="cards-header">
            {genre.name} ({genreMovies.length}):
          </div>

          <Row>{genreCards}</Row>
        </div>
      </div>
    );
  }
}

export default withRouter(GenreView);

GenreView.propTypes = {
  genre: PropTypes.shape({
    Name: PropTypes.string.isRequired,
  }).isRequired,
  onBackClick: PropTypes.func.isRequired,
};
