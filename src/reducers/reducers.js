import { combineReducers } from 'redux';
import {
  SET_FAVORITE,
  SET_FILTER,
  SET_MOVIES,
  TOGGLE_FAVORITE,
  SET_USER,
} from '../actions/actions';

//used for filtering movies
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

//handles setting array of favorites and updating favorites
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

//stores logged in user
function user(state = '', action) {
  switch (action.type) {
    case SET_USER:
      return action.user;
    default:
      return state;
  }
}

const moviesApp = combineReducers({
  visibilityFilter,
  movies,
  favorites,
  user,
});

export default moviesApp;
