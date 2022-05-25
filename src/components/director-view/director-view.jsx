import React from 'react';
import PropTypes from 'prop-types';

import MovieCard from '../movie-card/movie-card';

import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

import { Link } from 'react-router-dom';

import './director-view.scss';

export class DirectorView extends React.Component {
  //resetting window to top for component
  componentDidMount() {
    window.scrollTo(0, 0);
  }

  render() {
    const { director, onBackClick, directorMovies, accessFavorites } =
      this.props;

    //generator for movies by the same director.
    let directorCards = directorMovies.map((m) => (
      <Col md={3} key={m._id}>
        <Link to={`/movies/${m._id}`} className="movie-opt">
          <MovieCard movie={m} />
        </Link>
      </Col>
    ));

    return (
      <div className="director-wrapper">
        <div className="movie-view tp-movie">
          <div className="movie-genre mov-section">
            <div>
              <h3>{director.Name}</h3>
              <Button
                variant="secondary"
                onClick={() => {
                  onBackClick();
                }}
              >
                Back
              </Button>
            </div>
            <br></br>
          </div>
        </div>
        <div className="movie-view bt-movie">
          {/* returning list of movies directed by current director */}
          <div className="cards-header">
            Also directed by {director.Name} ({directorMovies.length}):
          </div>
          <Row>{directorCards}</Row>
        </div>
      </div>
    );
  }
}

DirectorView.propTypes = {
  director: PropTypes.shape({
    name: PropTypes.string.isRequired,
    bio: PropTypes.string.isRequired,
  }).isRequired,
  onBackClick: PropTypes.func.isRequired,
};
