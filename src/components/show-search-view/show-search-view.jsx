import React from 'react';
import { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { connect } from 'react-redux';

import { Row, Col, Button } from 'react-bootstrap';

import MovieCard from '../movie-card/movie-card';
import LoadingSpinner from '../spinner/spinner';

import './show-search-view.scss';
import axios from 'axios';

import { addMovies } from '../../actions/actions';

const mapStateToProps = (state) => {
  const { visibilityFilter, movies } = state;
  return {
    visibilityFilter,
    movies,
  };
};

function ShowSearch(props) {
  const [searching, setSearching] = useState(false);
  const [searchResults, setResults] = useState([]);
  const [resultCount, setResultCount] = useState();

  const { visibilityFilter, title } = props;

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
      .get(`https://whatdoiwatch.herokuapp.com/tv/search/${query}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setResultCount(response.data.length);
        if (response.data.length > 0) {
          setResults(response.data);
          props.addMovies(response.data);
        }
        setSearching(false);
      })
      .catch((error) => {
        console.log(error);
        setSearching(false);
        setResultCount(0);
      });
  };

  return (
    <div className="search-wrapper">
      <h3>{props.title}</h3>
      <p>Search TMDB Online for {props.visibilityFilter}</p>
      <Button
        className="dbsearch-button"
        variant="secondary"
        onClick={runSearch}
      >
        Search
      </Button>

      {searching && <LoadingSpinner />}
      {!searching && resultCount === 0 && (
        <div className="show-section search-results">
          <Row className="d-flex align-items-center show-header">
            <h3>Nothing additional found on TMDB...</h3>
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
              <Col md={3} key={m.odbid}>
                <MovieCard
                  movie={m}
                  onMovieClick={() => handleOnItemClick(m.odbid)}
                />
              </Col>
            ))}
          </Row>
        </div>
      )}
    </div>
  );
}

export default connect(mapStateToProps, { addMovies })(ShowSearch);
