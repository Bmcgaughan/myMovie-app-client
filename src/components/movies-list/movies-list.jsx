import React from 'react';
import { useState, useCallback, useEffect, useRef } from 'react';

import { useHistory } from 'react-router-dom';

import Slider from 'react-slick';

import { connect } from 'react-redux';

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

let sliderSettings = {
  dots: false,
  infinite: false,
  rows: 1,
  speed: 500,
  slidesToShow: 5,
  slidesToScroll: 1,
  swipeToSlide: true,
  // variableWidth: true,
};

const sliderInit = () => {
  console.log('ok');
};

function MoviesList(props) {
  const { movies, visibilityFilter } = props;
  const [dragging, setDragging] = useState(false);

  //setting up to navigate to specific movie
  const history = useHistory();

  //allowing slider to reset to start when filter is applied
  const refSlide = useRef();

  let slider = useEffect(() => {
    refSlide.current.slickGoTo(0);
  }, [visibilityFilter]);

  //callbacks to prevent a click when user is dragging slider
  const handleBeforeChange = useCallback(() => {
    setDragging(true);
  }, [setDragging]);

  const handleAfterChange = useCallback(() => {
    setDragging(false);
  }, [setDragging]);

  const handleOnItemClick = useCallback(
    (param) => (e) => {
      console.log(dragging);
      if (dragging) {
        e.stopPropagation();
      } else {
        history.push(`/movies/${param}`);
      }
    },
    [dragging]
  );

  //setting filtered to default prop
  let filteredMovies = movies;

  if (visibilityFilter !== '') {
    filteredMovies = movies.filter((m) =>
      m.Title.toLowerCase().includes(visibilityFilter.toLowerCase())
    );
  }

  if (!movies) {
    return <div className="main-view" />;
  }

  return (
    <div className='show-section'>
      <h3>Movies and Shows ({filteredMovies.length})</h3>
      <Slider
        beforeChange={handleBeforeChange}
        afterChange={handleAfterChange}
        {...sliderSettings}
        ref={refSlide}
      >
        {filteredMovies.map((m) => (
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
  );
}

export default connect(mapStateToProps)(MoviesList);
