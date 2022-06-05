import React from 'react';
import PropTypes from 'prop-types';

import MovieCard from '../movie-card/movie-card';

import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { setMovies } from '../../actions/actions';

import './recommended-view.scss';

function clickHolder() {
  console.log('placeholder');
}

const mapStateToProps = (state) => {
  const { movies } = state;
  return { movies };
};

function RecommendedView(props) {
  const { movies, movie, onMovieClick } = props;

  return (
      <Col md={4} key={movie._id}>
        <MovieCard movie={movie} onMovieClick={() => clickHolder} />
      </Col>
  );
}

export default connect(mapStateToProps, {
  setMovies,
})(RecommendedView);
