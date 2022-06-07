import React from 'react';

import MovieCard from '../movie-card/movie-card';

import Col from 'react-bootstrap/Col';

import { useHistory } from 'react-router-dom';

import './recommended-view.scss';

export function RecommendedView(props) {
  const { movies, movie, onMovieClick } = props;

  let history = useHistory();

  const recoClick = (id) => {
    history.push(`/movies/${id}`);
  };

  return (
    <Col md={4} key={movie._id}>
      <MovieCard movie={movie} onMovieClick={() => recoClick(movie._id)} />
    </Col>
  );
}
