import React from 'react';
import { useState, useCallback } from 'react';

import { useHistory } from 'react-router-dom';

import Col from 'react-bootstrap/Col';

import Slider from 'react-slick';

import { connect } from 'react-redux';

//components to import and render
import MovieCard from '../movie-card/movie-card';

//styles for filters
import './movies-list.scss';

import '../../../node_modules/slick-carousel/slick/slick.css';
import '../../../node_modules/slick-carousel/slick/slick-theme.css';

//mapping filter and favorites to props
const mapStateToProps = (state) => {
  const { visibilityFilter } = state;
  return { visibilityFilter };
};

const sliderSettings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 5,
  slidesToScroll: 1,
  swipeToSlide: true,
  variableWidth: true,
};

function MoviesList(props) {
  const { movies, visibilityFilter } = props;
  const [dragging, setDragging] = useState(false);

  const history = useHistory();

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
    <Slider
      beforeChange={handleBeforeChange}
      afterChange={handleAfterChange}
      {...sliderSettings}
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
    // {/* {filteredMovies.map((m) => (
    //   <Col md={3} key={m._id} className="mcard">
    //     <MovieCard movie={m} />
    //   </Col>
    // ))} */}
  );
}

export default connect(mapStateToProps)(MoviesList);
