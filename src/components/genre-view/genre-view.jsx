import React from 'react';

import MovieCard from '../movie-card/movie-card';

import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

import './genre-view.scss';

export class GenreView extends React.Component {
  //resetting window to top for component
  componentDidMount() {
    window.scrollTo(0, 0);
  }

  render() {
    const { genre, onBackClick, genreMovies, favorites } = this.props;

    //generator for movies of the same genre - finds them in the full list of movies
    let genreCards = genreMovies.map((m) => (
      <Col md={3} key={m._id}>
        <MovieCard movie={m} />
      </Col>
    ));

    return (
      <div className="genre-wrapper">
        <div className="movie-view tp-movie">
          <div className="movie-genre mov-section">
            <div>{genre.Name}</div>
            <br></br>
            <span>{genre.Description}</span>
          </div>
          <Button
            variant="secondary"
            onClick={() => {
              onBackClick();
            }}
          >
            Back
          </Button>
        </div>
        <div className="movie-view bt-movie">
          <div>{genre.Name} Movies:</div>
          <Row>{genreCards}</Row>
        </div>
      </div>
    );
  }
}
