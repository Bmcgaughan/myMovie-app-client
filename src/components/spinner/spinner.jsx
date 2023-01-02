import React from 'react';
import './spinner.scss';

export default function LoadingSpinner(props) {
  const { message } = props;

  return (
    <div className="spinner-container">
      {message && <div className="spinner-message">{message}</div>}
      <div className="loading-spinner"></div>
    </div>
  );
}
