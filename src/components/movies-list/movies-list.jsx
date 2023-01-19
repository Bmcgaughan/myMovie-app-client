import React from 'react';
import { useState, useEffect, useRef } from 'react';

import { useHistory } from 'react-router-dom';

import { connect } from 'react-redux';

import { Row, Col } from 'react-bootstrap';

//components to import and render
import MovieCard from '../movie-card/movie-card';
import ShowSearch from '../show-search-view/show-search-view';
import SliderView from '../slider-view/slider-view';

//styles for filters
import './movies-list.scss';

//mapping filter and favorites to props ma
const mapStateToProps = (state) => {
  const {
    movies,
    trending,
    visibilityFilter,
    trendSort,
    movieSort,
    mostLiked,
    recommended,
  } = state;
  return {
    movies,
    trending,
    visibilityFilter,
    trendSort,
    movieSort,
    mostLiked,
    recommended,
  };
};

function MoviesList(props) {
  const { movies, visibilityFilter, recommended } = props;
  const [dragging, setDragging] = useState(false);

  //setting up to navigate to specific movie
  const history = useHistory();

  //pushing movie details on click
  const handleOnItemClick = (param, dragToggle) => (e) => {
    if (!dragToggle) {
      history.push(`/movies/${param}`);
    } else {
      if (dragging) {
        e.stopPropagation();
      } else {
        history.push(`/movies/${param}`);
      }
    }
  };

  //setting filtered to default prop
  let filteredMovies = [];

  if (visibilityFilter !== '') {
    filteredMovies = movies.filter((m) =>
      m.title.toLowerCase().includes(visibilityFilter.toLowerCase())
    );
  }

  return (
    <div className="shows-wrapper">
      {visibilityFilter != '' && filteredMovies.length === 0 && (
        <ShowSearch title={'No Results in Local DB'} />
      )}
      {visibilityFilter != '' && filteredMovies.length != 0 && (
        <div className="filtered">
          <div className="show-section">
            <Row className="d-flex align-items-center">
              <h3>Search Results ({filteredMovies.length})</h3>
            </Row>
            <Row>
              {filteredMovies.map((m) => (
                <Col md={3} key={m.odbid}>
                  <MovieCard
                    movie={m}
                    onMovieClick={() => handleOnItemClick(m.odbid, false)}
                    lazy={''}
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
        <div className="unfilter">
          {props.recommended && props.recommended.length > 0 && (
            <div className="show-section">
              <Row className="d-flex align-items-center">
                <h3>Recommended for You:</h3>
              </Row>
              <SliderView shows={props.recommended} element={'reco'} />
            </div>
          )}
          {props.trending && props.trending.length > 0 && (
            <div className="show-section">
              <Row className="d-flex align-items-center">
                <h3>Trending This Week:</h3>
              </Row>
              <SliderView shows={props.trending} element={'trend'} />
            </div>
          )}
          {props.mostLiked && props.mostLiked.length > 0 && (
            <div className="show-section">
              <Row className="d-flex align-items-center">
                <h3>Popular Right Now:</h3>
              </Row>
              <SliderView shows={props.mostLiked} element={'pop'} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default connect(mapStateToProps)(MoviesList);
