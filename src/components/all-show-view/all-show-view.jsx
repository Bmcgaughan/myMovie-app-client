import React from 'react';
import { useHistory } from 'react-router-dom';

import { connect } from 'react-redux';
import { Row, Col } from 'react-bootstrap';

//components to import and render
import MovieCard from '../movie-card/movie-card';

const mapStateToProps = (state) => {
  const { movies, visibilityFilter } = state;
  return {
    movies,
    visibilityFilter,
  };
};

function AllShows(props) {
  const { movies, visibilityFilter } = props;

  const history = useHistory();

  movies.sort((a, b) => {
    if (a.Title < b.Title) {
      return -1;
    }
    if (a.Title > b.Title) {
      return 1;
    }
    return 0;
  });

  const handleOnItemClick = (param) => (e) => {
    e.stopPropagation();
    history.push(`/movies/${param}`);
  };

  if (visibilityFilter !== '') {
    filteredMovies = movies.filter((m) =>
      m.Title.toLowerCase().includes(visibilityFilter.toLowerCase())
    );
  }

  return (
    <div className="shows-wrapper">
      {visibilityFilter != '' && (
        <div className="filtered">
          <div className="show-section">
            <Row className="d-flex align-items-center">
              <h3>Search Results ({filteredMovies.length})</h3>
            </Row>
            <Row>
              {filteredMovies.map((m) => (
                <Col md={3} key={m._id}>
                  <MovieCard
                    movie={m}
                    onMovieClick={() => handleOnItemClick(m._id)}
                  />
                </Col>
              ))}
            </Row>
          </div>
        </div>
      )}
      {visibilityFilter === '' && (
        <div className="filtered">
          <div className="show-section">
            <Row className="d-flex align-items-center">
              <h3>All Shows ({movies.length})</h3>
            </Row>
            <Row>
              {movies.map((m) => (
                <Col md={3} key={m._id}>
                  <MovieCard
                    movie={m}
                    onMovieClick={() => handleOnItemClick(m._id)}
                  />
                </Col>
              ))}
            </Row>
          </div>
        </div>
      )}
    </div>
  );
}

export default connect(mapStateToProps)(AllShows);
