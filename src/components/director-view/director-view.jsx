import React from 'react';

import { Button } from 'react-bootstrap';

import './director-view.scss';

export class DirectorView extends React.Component {
  render() {
    const { director, onBackClick } = this.props;
    return (
      <div className="movie-view">
        <div className="movie-genre mov-section">
          <span className="label">Director: <br></br></span>
          <span>{director.Name}</span>
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
