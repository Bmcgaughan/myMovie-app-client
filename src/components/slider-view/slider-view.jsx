import React from 'react';
import { useEffect, useRef } from 'react';

import { useHistory } from 'react-router-dom';

import { Swiper, SwiperSlide } from 'swiper/react/swiper-react.js';

import '../../../node_modules/swiper/swiper.scss';
import '../../../node_modules/swiper/modules/free-mode/free-mode.scss';
import '../../../node_modules/swiper/modules/pagination/pagination.scss';

import { FreeMode, Pagination, Lazy } from 'swiper';

import MovieCard from '../movie-card/movie-card';

function SliderView(props) {
  const { shows, element } = props;

  const sliderRef = useRef(null);
  const history = useHistory();

  useEffect(() => {
    let startSlide = localStorage.getItem(`slide_${element}`);
    if (!startSlide) {
      startSlide = 0;
    }
    if (shows && shows.length > startSlide) {
      sliderRef.current.swiper.slideTo(startSlide);
    } else {
      sliderRef.current.swiper.slideTo(0);
    }
  }, []);

  const handleOnItemClick = (param) => (e) => {
    history.push(`/movies/${param}`);
  };

  const storeSwiperIndex = (swiper) => {
    localStorage.setItem(`slide_${element}`, swiper.realIndex);
  };

  return (
    <div className="slider-group">
      <Swiper
        ref={sliderRef}
        onSlideChange={(swiper) => {
          storeSwiperIndex(swiper);
        }}
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
        className={`${element}_Swiper`}
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
        {props.shows.map((m) => (
          <SwiperSlide key={m.odbid}>
            <div className="mcard">
              <MovieCard
                movie={m}
                onMovieClick={() => handleOnItemClick(m.odbid)}
                lazy={''}
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

export default SliderView;
