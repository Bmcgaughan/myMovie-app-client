import React from 'react';
import { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { connect } from 'react-redux';

import { Row, Col, Button } from 'react-bootstrap';

import MovieCard from '../movie-card/movie-card';
import LoadingSpinner from '../spinner/spinner';

import './show-search-view.scss';
import axios from 'axios';

const mapStateToProps = (state) => {
  const { visibilityFilter } = state;
  return {
    visibilityFilter,
  };
};

function ShowSearch(props) {
  const [searching, setSearching] = useState(false);
  const [searchResults, setResults] = useState([]);

  const { visibilityFilter } = props;

  const history = useHistory();

  const handleOnItemClick = (param) => (e) => {
    e.stopPropagation();
    history.push(`/movies/${param}`);
  };

  const runSearch = () => {
    setSearching(true);
    token = localStorage.getItem('token');
    const query = encodeURI(visibilityFilter);
    axios
      .get(`https://whatdoiwatch.herokuapp.com/search/${query}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setResults(response.data.processedTV);
        setSearching(false);
      })
      .catch((error) => {
        console.log(error);
        setSearching(false);
      });
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
      {!searching && searchResults.length === 0 && (
        <div className="show-section search-results">
          <Row className="d-flex align-items-center show-header">
            <h3>Nothing found on TMDB...</h3>
          </Row>
        </div>
      )}
      {!searching && searchResults.length > 0 && (
        <div className="show-section search-results">
          <Row className="d-flex align-items-center show-header">
            <h3>Results: ({searchResults.length})</h3>
          </Row>
          <Row>
            {searchResults.map((m) => (
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
