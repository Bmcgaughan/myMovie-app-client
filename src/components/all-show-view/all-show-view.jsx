import React from 'react';
import { useHistory } from 'react-router-dom';

import { connect } from 'react-redux';
import { Row, Col } from 'react-bootstrap';

import { setMovies } from '../../actions/actions';

import './all-show-view.scss';

//components to import and render
import MovieCard from '../movie-card/movie-card';
import ShowSearch from '../show-search-view/show-search-view';

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
      {visibilityFilter != '' && filteredMovies.length === 0 && (
        <ShowSearch title={'No Results in Local DB'} />
      )}
      {visibilityFilter != '' && filteredMovies.length > 0 && (
        <div className="filtered">
          <div className="show-section">
            <Row className="d-flex align-items-center show-header">
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
            <div className="add-search">
              <h3>Not What You're Looking For?</h3>
              <ShowSearch title={''} />
            </div>
          </div>
        </div>
      )}
      {visibilityFilter === '' && (
        <div className="filtered">
          <div className="show-section">
            <Row className="d-flex align-items-center show-header">
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

export default connect(mapStateToProps, { setMovies })(AllShows);
