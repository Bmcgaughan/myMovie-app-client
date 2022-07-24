import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

import { connect } from 'react-redux';
import { Row, Col, Dropdown } from 'react-bootstrap';
import { Filter } from 'react-bootstrap-icons';

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
  const [networkFilter, setNetworkFilter] = useState('');
  const { movies, visibilityFilter } = props;

  const history = useHistory();

  useEffect(() => {
    console.log('useEffect');
    const appliedFilter = localStorage.getItem('networkFilter');
    if (appliedFilter) {
      setNetworkFilter(appliedFilter);
    }
  });

  //get list of Network from movies
  const networks = movies.map((movie) => movie.Network);

  //get tally of unique networks
  const networkTally = networks.reduce((acc, curr) => {
    if (curr in acc) {
      acc[curr]++;
    } else {
      acc[curr] = 1;
    }
    return acc;
  }, {});

  //get top 10 most common networks
  const topNetworks = Object.keys(networkTally)
    .sort((a, b) => {
      return networkTally[b] - networkTally[a];
    })
    .slice(0, 10);

  //get networkTally not in topNetworks and sorted by network
  const otherNetworks = Object.keys(networkTally).filter((network) => {
    return !topNetworks.includes(network);
  });
  otherNetworks.sort();

  movies.sort((a, b) => {
    if (a.Title < b.Title) {
      return -1;
    }
    if (a.Title > b.Title) {
      return 1;
    }
    return 0;
  });

  const handleNetworkFilter = (event) => {
    setNetworkFilter(event);
    localStorage.setItem('networkFilter', event);
  };

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
              <h3>
                {networkFilter ? networkFilter : 'All Shows'} (
                {networkFilter
                  ? movies.filter((m) => m.Network === networkFilter).length
                  : movies.length}
                )
              </h3>
              <a className="show-filter">
                <Dropdown>
                  <Dropdown.Toggle
                    className="filter-button"
                    variant="success"
                    id="dropdown-basic"
                  >
                    <Filter />
                  </Dropdown.Toggle>
                  <Dropdown.Menu className="container-fluid">
                    <Dropdown.Item
                      key={'All Shows'}
                      onClick={() => handleNetworkFilter('')}
                    >
                      <b>All Shows</b>
                    </Dropdown.Item>

                    {topNetworks.map((m) => (
                      <Dropdown.Item
                        key={m}
                        onClick={() => handleNetworkFilter(m)}
                      >
                        {m}
                      </Dropdown.Item>
                    ))}
                    <Dropdown.Divider />
                    {otherNetworks.map((m) => (
                      <Dropdown.Item
                        key={m}
                        onClick={() => handleNetworkFilter(m)}
                      >
                        {m}
                      </Dropdown.Item>
                    ))}
                  </Dropdown.Menu>
                </Dropdown>
              </a>
            </Row>
            <Row>
              {networkFilter
                ? movies
                    .filter((m) => m.Network === networkFilter)
                    .map((m) => (
                      <Col md={3} key={m._id}>
                        <MovieCard
                          movie={m}
                          onMovieClick={() => handleOnItemClick(m._id)}
                        />
                      </Col>
                    ))
                : movies.map((m) => (
                    <Col md={3} key={m._id}>
                      <MovieCard
                        movie={m}
                        onMovieClick={() => handleOnItemClick(m._id)}
                      />
                    </Col>
                  ))}
              {/* {movies.map((m) => (
                <Col md={3} xs={4} key={m._id}>
                  <MovieCard
                    movie={m}
                    onMovieClick={() => handleOnItemClick(m._id)}
                  />
                </Col>
              ))} */}
            </Row>
          </div>
        </div>
      )}
    </div>
  );
}

export default connect(mapStateToProps, { setMovies })(AllShows);
