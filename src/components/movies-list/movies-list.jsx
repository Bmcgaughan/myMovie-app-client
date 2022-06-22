import React from 'react';
import { useState, useCallback, useEffect, useRef } from 'react';

import { useHistory } from 'react-router-dom';

import Slider from 'react-slick';

import { Swiper, SwiperSlide } from 'swiper/react/swiper-react.js';

import '../../../node_modules/swiper/swiper.scss';
import '../../../node_modules/swiper/modules/free-mode/free-mode.scss';
import '../../../node_modules/swiper/modules/pagination/pagination.scss';
import { FreeMode, Pagination } from 'swiper';

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
              <Swiper
                slidesPerView={5}
                spaceBetween={0}
                freeMode={true}
                pagination={{
                  clickable: true,
                  dynamicBullets: true,
                  dynamicMainBullets: 5,
                }}
                modules={[FreeMode, Pagination]}
                className="RecoSwiper"
              >
                {recommendedDisplay.map((m) => (
                  <SwiperSlide key={m._id}>
                    <div className="mcard">
                      <MovieCard
                        movie={m}
                        onMovieClick={() => handleOnItemClick(m._id, true)}
                      />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          )}
          {mostLikedDisplay && mostLikedDisplay.length > 0 && (
            <div className="show-section">
              <Row className="d-flex align-items-center">
                <h3>Other People Like:</h3>
              </Row>
              <Swiper
                slidesPerView={5}
                spaceBetween={0}
                freeMode={true}
                pagination={{
                  clickable: true,
                  dynamicBullets: true,
                  dynamicMainBullets: 5,
                }}
                modules={[FreeMode, Pagination]}
                className="LikeSwiper"
              >
                {mostLikedDisplay.map((m) => (
                  <SwiperSlide key={m._id}>
                    <div className="mcard">
                      <MovieCard
                        movie={m}
                        onMovieClick={() => handleOnItemClick(m._id, true)}
                      />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          )}
          {trendingDisplay && trendingDisplay.length > 0 && (
            <div className="show-section">
              <Row className="d-flex align-items-center">
                <h3>Trending This Week:</h3>
              </Row>
              <Swiper
                slidesPerView={5}
                spaceBetween={0}
                freeMode={true}
                pagination={{
                  clickable: true,
                  dynamicBullets: true,
                  dynamicMainBullets: 5,
                }}
                modules={[FreeMode, Pagination]}
                className="LikeSwiper"
              >
                {trendingDisplay.map((m) => (
                  <SwiperSlide key={m._id}>
                    <div className="mcard">
                      <MovieCard
                        movie={m}
                        onMovieClick={() => handleOnItemClick(m._id, true)}
                      />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default connect(mapStateToProps)(MoviesList);
