import React from 'react';
import { useState, useCallback, useEffect, useRef } from 'react';

import { useHistory } from 'react-router-dom';

import Slider from 'react-slick';

import { connect } from 'react-redux';

import { Row, Dropdown } from 'react-bootstrap';

//components to import and render
import MovieCard from '../movie-card/movie-card';

//styles for filters
import './movies-list.scss';

import '../../../node_modules/slick-carousel/slick/slick.css';
import '../../../node_modules/slick-carousel/slick/slick-theme.css';

//mapping filter and favorites to props ma
const mapStateToProps = (state) => {
  const { visibilityFilter } = state;
  return { visibilityFilter };
};

//settings for the slider
let sliderSettings = {
  dots: false,
  infinite: false,
  rows: 1,
  speed: 500,
  slidesToShow: 5,
  slidesToScroll: 1,
  swipeToSlide: true,
};

function MoviesList(props) {
  const { movies, visibilityFilter } = props;
  const [trendingList, setTrending] = useState([]);
  const [dragging, setDragging] = useState(false);
  const [sort, setSort] = useState('');
  const [activeFilter, setActiveFilter] = useState('');

  //setting up to navigate to specific movie
  const history = useHistory();

  //allowing slider to reset to start when filter is applied
  const totalSlide = useRef();
  const trendSlide = useRef();

  let slider = useEffect(() => {
    if (totalSlide.current) {
      totalSlide.current.slickGoTo(0);
      setDragging(false);
    }
  }, [visibilityFilter]);

  //to prevent a click when user is dragging slider using before and after change functions
  function handleBeforeChange(curr, next) {
    if (curr === next) {
      setDragging(false);
    } else {
      setDragging(true);
    }
  }

  const filterGenerator = (srcForFilter) => {
    return (
      <Dropdown>
        <Dropdown.Toggle variant="success" id="dropdown-basic">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="25"
            height="25"
            fill="#fff"
            className="filter bi bi-filter-circle"
            viewBox="0 0 16 16"
          >
            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
            <path d="M7 11.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1-.5-.5zm-2-3a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5zm-2-3a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5z" />
          </svg>
        </Dropdown.Toggle>
        <Dropdown.Menu style={{ margin: 0 }}>
          <Dropdown.Item
            filterclick={srcForFilter}
            onClick={(e) => sortHandler(e)}
          >
            <Row className="sortitem d-flex alpha">
              Sort By Title
              {activeFilter.target &&
                activeFilter.target === 'Sort By Title' &&
                setSortArrow()}
            </Row>
          </Dropdown.Item>
          <Dropdown.Item
            filterclick={srcForFilter}
            onClick={(e) => sortHandler(e)}
          >
            <Row className="sortitem d-flex alpha">
              Sort By Rating
              {activeFilter.target &&
                activeFilter.target === 'Sort By Rating' &&
                setSortArrow()}
            </Row>
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    );
  };

  //handling the sorting click and updating the method and target of sorting
  const sortHandler = (e) => {
    let targetSort = e.target.innerText;
    let filterOrigin = e.target.parentNode.getAttribute('filterclick');
    //to prevent racing against the state update
    let sortVal = sort;
    if (activeFilter.target && activeFilter.target !== targetSort) {
      sortVal = '';
      setSort('');
    }
    switch (sortVal) {
      case '':
        setSort('asc');
        setActiveFilter({
          target: targetSort,
          direction: 'asc',
          origin: filterOrigin,
        });
        break;
      case 'asc':
        setSort('desc');
        setActiveFilter({
          target: targetSort,
          direction: 'desc',
          origin: filterOrigin,
        });
        break;
      case 'desc':
        setSort('');
        setActiveFilter('');
        break;
    }
  };

  //storing and returning the sort direction arrows
  const setSortArrow = () => {
    switch (sort) {
      case 'asc':
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="#00000"
            className="bi bi-arrow-up"
            viewBox="0 0 16 16"
          >
            <path
              fillRule="evenodd"
              d="M8 15a.5.5 0 0 0 .5-.5V2.707l3.146 3.147a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 1 0 .708.708L7.5 2.707V14.5a.5.5 0 0 0 .5.5z"
            />
          </svg>
        );
      case 'desc':
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fillRule="#00000"
            className="bi bi-arrow-down"
            viewBox="0 0 16 16"
          >
            <path
              fillRule="evenodd"
              d="M8 1a.5.5 0 0 1 .5.5v11.793l3.146-3.147a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 .708-.708L7.5 13.293V1.5A.5.5 0 0 1 8 1z"
            />
          </svg>
        );
      default:
        return <div></div>;
    }
  };

  const handleAfterChange = useCallback(() => {
    setDragging(false);
  }, [setDragging]);

  //pushing movie details on click
  const handleOnItemClick = (param) => (e) => {
    if (dragging) {
      e.stopPropagation();
    } else {
      history.push(`/movies/${param}`);
    }
  };

  //setting filtered to default prop
  let filteredMovies = [];

  if (visibilityFilter !== '') {
    filteredMovies = movies.filter((m) =>
      m.Title.toLowerCase().includes(visibilityFilter.toLowerCase())
    );
    filteredTrending = props.trending.filter((m) =>
      m.Title.toLowerCase().includes(visibilityFilter.toLowerCase())
    );
  }

  const runFilters = (toFilter) => {
    if (activeFilter.target === 'Sort By Title') {
      if (activeFilter.direction === 'asc') {
        toFilter.sort((a, b) =>
          a.Title > b.Title ? 1 : b.Title > a.Title ? -1 : 0
        );
      } else if (activeFilter.direction === 'desc') {
        toFilter.sort((a, b) =>
          b.Title > a.Title ? 1 : a.Title > b.Title ? -1 : 0
        );
      }
    } else if (activeFilter.target === 'Sort By Rating') {
      if (activeFilter.direction === 'asc') {
        toFilter.sort((a, b) =>
          b.Rating > a.Rating ? 1 : a.Rating > b.Rating ? -1 : 0
        );
      } else if (activeFilter.direction === 'desc') {
        toFilter.sort((a, b) =>
          a.Rating > b.Rating ? 1 : b.Rating > a.Rating ? -1 : 0
        );
      }
    }
  };

  //handling active filers and applying the sort order -- sending with correct array
  if (activeFilter !== '') {
    switch (activeFilter.origin) {
      case 'filteredMovies':
        runFilters(filteredMovies);
        break;
      case 'trendingmovies':
        runFilters(props.trending);
        break;
      case 'movies':
        runFilters(movies);
        break;
    }
  }

  if (!movies) {
    return <div className="main-view" />;
  }

  return (
    <div className="shows-wrapper">
      {filteredMovies.length > 0 && (
        <div className="filtered">
          <div className="show-section">
            <Row className="d-flex align-items-center">
              <h3>Search Results ({filteredMovies.length})</h3>
              {filterGenerator('filteredMovies')}
            </Row>

            <Slider
              beforeChange={(current, next) =>
                handleBeforeChange(current, next)
              }
              afterChange={handleAfterChange}
              {...sliderSettings}
              ref={trendSlide}
            >
              {filteredMovies.map((m) => (
                <div
                  key={m._id}
                  className="mcard"
                  // onClickCapture={handleOnItemClick(m._id)}
                >
                  <MovieCard movie={m} onMovieClick={() => handleOnItemClick()} />
                </div>
              ))}
            </Slider>
          </div>
        </div>
      )}
      {filteredMovies.length < 1 && (
        <div className="unfilter">
          <div className="show-section">
            <Row className="d-flex align-items-center">
              <h3>Trending ({props.trending.length})</h3>
              {filterGenerator('trendingmovies')}
            </Row>
            <Slider
              beforeChange={(current, next) =>
                handleBeforeChange(current, next)
              }
              afterChange={handleAfterChange}
              {...sliderSettings}
              ref={trendSlide}
            >
              {props.trending.map((m) => (
                <div
                  key={m._id}
                  className="mcard"
                  onClickCapture={handleOnItemClick(m._id)}
                >
                  <MovieCard movie={m} />
                </div>
              ))}
            </Slider>
          </div>
          <div className="show-section">
            <Row className="d-flex align-items-center">
              <h3>Movies and Shows Total ({movies.length})</h3>
              {filterGenerator('movies')}
            </Row>
            <Slider
              beforeChange={(current, next) =>
                handleBeforeChange(current, next)
              }
              afterChange={handleAfterChange}
              {...sliderSettings}
              ref={totalSlide}
            >
              {movies.map((m) => (
                <div
                  key={m._id}
                  className="mcard"
                  onClickCapture={handleOnItemClick(m._id)}
                >
                  <MovieCard movie={m} />
                </div>
              ))}
            </Slider>
          </div>
        </div>
      )}
    </div>
  );
}

export default connect(mapStateToProps)(MoviesList);
