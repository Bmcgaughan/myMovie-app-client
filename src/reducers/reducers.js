import { combineReducers } from 'redux';
import {
  SET_FAVORITE,
  SET_FILTER,
  SET_MOVIES,
  TOGGLE_FAVORITE,
} from '../actions/actions';

function visibilityFilter(state = '', action) {
  switch (action.type) {
    case SET_FILTER:
      return action.value;
    default:
      return state;
  }
}

function movies(state = [], action) {
  switch (action.type) {
    case SET_MOVIES:
      return action.value;
    default:
      return state;
  }
}

function favorites(state = [], action) {
  switch (action.type) {
    case SET_FAVORITE:
      return action.value;
    case TOGGLE_FAVORITE:
      if (state.includes(action.movieId)) {
        return state.filter((val) => val !== action.movieId);
      } else {
        return [...state, action.movieId];
      }
    default:
      return state;
  }
}

// function isFavorite(state = '', action){
//     switch (action.type) {
//         case:
//     }
// }

const moviesApp = combineReducers({
  visibilityFilter,
  movies,
  favorites,
});

export default moviesApp;
