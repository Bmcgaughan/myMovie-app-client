import React from 'react';
import { useState, useCallback, useEffect, useRef } from 'react';

import { useHistory } from 'react-router-dom';

import { Swiper, SwiperSlide } from 'swiper/react/swiper-react.js';

import '../../../node_modules/swiper/swiper.scss';
import '../../../node_modules/swiper/modules/free-mode/free-mode.scss';
import '../../../node_modules/swiper/modules/pagination/pagination.scss';

import { FreeMode, Pagination, Lazy } from 'swiper';

import { connect } from 'react-redux';

import { Row, Col } from 'react-bootstrap';

//components to import and render
import MovieCard from '../movie-card/movie-card';
import ShowSearch from '../show-search-view/show-search-view';

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
  }

  // if (!movies) {
  //   return <div className="main-view" />;
  // }

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
                <Col md={3} key={m._id}>
                  <MovieCard
                    movie={m}
                    onMovieClick={() => handleOnItemClick(m._id, false)}
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
                preloadImages={false}
                lazy={true}
                modules={[FreeMode, Pagination, Lazy]}
                className="RecoSwiper"
                breakpoints={{
                  425: {
                    slidesPerView: 5,
                    spaceBetween: 0,
                  },
                  300: {
                    slidesPerView: 4,
                    spaceBetween: 0,
                  },
                }}
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
                preloadImages={false}
                lazy={true}
                modules={[FreeMode, Pagination, Lazy]}
                className="LikeSwiper"
                breakpoints={{
                  425: {
                    slidesPerView: 5,
                    spaceBetween: 0,
                  },
                  300: {
                    slidesPerView: 4,
                    spaceBetween: 0,
                  },
                }}
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
                preloadImages={false}
                lazy={true}
                modules={[FreeMode, Pagination, Lazy]}
                className="TrendSwiper"
                breakpoints={{
                  425: {
                    slidesPerView: 5,
                    spaceBetween: 0,
                  },
                  300: {
                    slidesPerView: 4,
                    spaceBetween: 0,
                  },
                }}
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
