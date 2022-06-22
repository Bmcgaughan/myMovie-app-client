import React from 'react';
import { useState, useCallback, useEffect, useRef } from 'react';

import { useHistory } from 'react-router-dom';

import Slider from 'react-slick';

import { connect } from 'react-redux';

import { Row, Col } from 'react-bootstrap';

//components to import and render
import MovieCard from '../movie-card/movie-card';

//styles for filters
import './movies-list.scss';

import '../../../node_modules/slick-carousel/slick/slick.css';
import '../../../node_modules/slick-carousel/slick/slick-theme.css';

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

//settings for the slider
let sliderSettings = {
  dots: false,
  infinite: false,
  rows: 1,
  speed: 500,
  slidesToShow: 5,
  slidesToScroll: 1,
  swipeToSlide: true,
  responsive: [
    {
      breakpoint: 768,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 1,
        infinite: false,
        dots: false,
      },
    },
  ],
};

function MoviesList(props) {
  const { movies, visibilityFilter } = props;
  const [dragging, setDragging] = useState(false);

  //setting up to navigate to specific movie
  const history = useHistory();

  //allowing slider to reset to start when filter is applied
  const likeSlide = useRef();
  const trendSlide = useRef();
  const recoSlide = useRef();

  //functions to eliminate duplicating shows
  const trendingDisplay = props.trending.filter((movie) => {
    if (
      !props.recommended.some((recommend) => recommend._id === movie._id) &&
      !props.mostLiked.some((like) => like._id === movie._id)
    ) {
      return movie;
    }
  });

  const recommendedDisplay = props.recommended.filter((movie) => {
    if (
      !props.trending.some((trend) => trend._id === movie._id) &&
      !props.mostLiked.some((like) => like._id === movie._id)
    ) {
      return movie;
    }
  });

  const mostLikedDisplay = props.mostLiked.filter((movie) => {
    if (
      !props.trending.some((trend) => trend._id === movie._id) &&
      !props.recommended.some((recommend) => recommend._id === movie._id)
    ) {
      return movie;
    }
  });

  useEffect(() => {
    let trendLocation = localStorage.getItem('trendSlide');
    let recoLocation = localStorage.getItem('recoSlide');
    let likeLocation = localStorage.getItem('likeSlide');

    if (visibilityFilter === '') {
      if (trendLocation) {
        setDragging(false);
        trendSlide.current.slickGoTo(trendLocation);
      }
      if (recoLocation) {
        setDragging(false);
        recoSlide.current.slickGoTo(recoLocation);
      }
      if (likeLocation) {
        setDragging(false);
        likeSlide.current.slickGoTo(likeLocation);
      }
    }
  }, []);

  //to prevent a click when user is dragging slider using before and after change functions
  function handleBeforeChangeTrend(curr, next) {
    let trendLocation = localStorage.getItem('trendSlide');
    if (trendLocation) {
      curr = Number(trendLocation);
    }
    localStorage.setItem('trendSlide', next);
    if (curr === next) {
      setDragging(false);
    } else {
      setDragging(true);
    }
  }

  function handleBeforeChangeReco(curr, next) {
    let recoLocation = localStorage.getItem('recoSlide');
    if (recoLocation) {
      curr = Number(recoLocation);
    }
    localStorage.setItem('recoSlide', next);
    if (curr === next) {
      setDragging(false);
    } else {
      setDragging(true);
    }
  }

  function handleBeforeChangeLike(curr, next) {
    let likeLocation = localStorage.getItem('likeSlide');
    if (likeLocation) {
      curr = Number(likeLocation);
    }
    localStorage.setItem('likeSlide', next);
    if (curr === next) {
      setDragging(false);
    } else {
      setDragging(true);
    }
  }

  const handleAfterChange = useCallback(() => {
    setDragging(false);
  }, [setDragging]);

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
      m.Title.toLowerCase().includes(visibilityFilter.toLowerCase())
    );
    filteredTrending = props.trending.filter((m) =>
      m.Title.toLowerCase().includes(visibilityFilter.toLowerCase())
    );
    filteredMovies = filteredMovies.concat(filteredTrending);
  }

  // if (!movies) {
  //   return <div className="main-view" />;
  // }

  return (
    <div className="shows-wrapper">
      {visibilityFilter != '' && (
        <div className="filtered">
          <div className="show-section">
            <Row className="d-flex align-items-center">
              <h3>Search Results ({filteredMovies.length})</h3>
            </Row>
            <Row>
              {filteredMovies.map((m) => (
                <Col md={3} key={m._id}>
                  <MovieCard
                    movie={m}
                    onMovieClick={() => handleOnItemClick(m._id, false)}
                  />
                </Col>
              ))}
            </Row>
          </div>
        </div>
      )}
      {visibilityFilter === '' && (
        <div className="unfilter">
          {recommendedDisplay && recommendedDisplay.length > 0 && (
            <div className="show-section">
              <Row className="d-flex align-items-center">
                <h3>Recommended for You:</h3>
              </Row>
              <Slider
                beforeChange={(current, next) =>
                  handleBeforeChangeReco(current, next)
                }
                afterChange={handleAfterChange}
                {...sliderSettings}
                ref={recoSlide}
              >
                {recommendedDisplay.map((m) => (
                  <div key={m._id} className="mcard">
                    <MovieCard
                      movie={m}
                      onMovieClick={() => handleOnItemClick(m._id, true)}
                    />
                  </div>
                ))}
              </Slider>
            </div>
          )}
          {mostLikedDisplay && mostLikedDisplay.length > 0 && (
            <div className="show-section">
              <Row className="d-flex align-items-center">
                <h3>Other People Like:</h3>
              </Row>
              <Slider
                beforeChange={(current, next) =>
                  handleBeforeChangeLike(current, next)
                }
                afterChange={handleAfterChange}
                {...sliderSettings}
                ref={likeSlide}
              >
                {mostLikedDisplay.map((m) => (
                  <div key={m._id} className="mcard">
                    <MovieCard
                      movie={m}
                      onMovieClick={() => handleOnItemClick(m._id, true)}
                    />
                  </div>
                ))}
              </Slider>
            </div>
          )}
          {trendingDisplay && trendingDisplay.length > 0 && (
            <div className="show-section">
              <Row className="d-flex align-items-center">
                <h3>Trending This Week:</h3>
              </Row>
              <Slider
                beforeChange={(current, next) =>
                  handleBeforeChangeTrend(current, next)
                }
                afterChange={handleAfterChange}
                {...sliderSettings}
                ref={trendSlide}
              >
                {trendingDisplay.map((m) => (
                  <div key={m._id} className="mcard">
                    <MovieCard
                      movie={m}
                      onMovieClick={() => handleOnItemClick(m._id, true)}
                    />
                  </div>
                ))}
              </Slider>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default connect(mapStateToProps)(MoviesList);
