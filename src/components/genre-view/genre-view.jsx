import React from 'react';

import { Button } from 'react-bootstrap';

export class GenreView extends React.Component {
  render() {
    const { genre, onBackClick, genreMovies } = this.props;
    return (
      <div className="movie-view">
        <div className="movie-genre mov-section">
          <div>{genre.Name}</div>
          <br></br>
          <span>{genre.Description}</span>
          <span>{genreMovies.length}</span>
          <span>{genreMovies[0].Title}</span>
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
    );
  }
}
