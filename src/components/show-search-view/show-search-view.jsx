import React from 'react';
import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { connect } from 'react-redux';

import { Row, Col, Form, Button } from 'react-bootstrap';

import MovieCard from '../movie-card/movie-card';
import LoadingSpinner from '../spinner/spinner';

import './show-search-view.scss';

const mapStateToProps = (state) => {
  const { visibilityFilter, movies } = state;
  return {
    visibilityFilter,
    movies,
  };
};

function ShowSearch(props) {
  const [searching, setSearching] = useState(false);
  const [searchResults, setResults] = useState();

  const { movies } = props;

  const history = useHistory();

  const handleOnItemClick = (param) => (e) => {
    e.stopPropagation();
    history.push(`/movies/${param}`);
  };

  const runSearch = () => {
    setSearching(true);
    console.log('ran');
  };

  return (
    <div className="search-wrapper">
      <h3>No Results in local Database</h3>
      <p>Search TMDB Online for {props.visibilityFilter}</p>
      <Button
        className="dbsearch-button"
        variant="secondary"
        onClick={runSearch}
      >
        Search
      </Button>

      {searching && <LoadingSpinner />}
      {!searching && searchResults && (
        <div className="show-section search-results">
          <Row className="d-flex align-items-center show-header">
            <h3>Results: ({movies.length})</h3>
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
      )}
    </div>
  );
}

export default connect(mapStateToProps)(ShowSearch);
