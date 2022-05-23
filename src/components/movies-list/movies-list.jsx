import React from 'react';
import Col from 'react-bootstrap/Col';
import { connect } from 'react-redux';

import MovieCard from '../movie-card/movie-card';

import { setMovies, setFavorites, toggleFavorite } from '../../actions/actions';

const mapStateToProps = (state) => {
  const { visibilityFilter, favorites } = state;
  return { visibilityFilter, favorites };
};

function MoviesList(props) {
  const { movies, visibilityFilter, favorites } = props;
  let filteredMovies = movies;

  if (visibilityFilter !== '') {
    filteredMovies = movies.filter((m) =>
      m.Title.toLowerCase().includes(visibilityFilter.toLowerCase())
    );
  }

  if (!movies) {
    return <div className="main-view" />;
  }

  return filteredMovies.map((m) => (
    <Col md={3} key={m._id} className="mcard">
      <MovieCard movie={m} />
    </Col>
  ));
}

export default connect(mapStateToProps, {
  setMovies,
  setFavorites,
  toggleFavorite,
})(MoviesList);
