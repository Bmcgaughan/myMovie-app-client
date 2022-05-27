import { combineReducers } from 'redux';
import {
  SET_FAVORITE,
  SET_FILTER,
  SET_MOVIES,
  TOGGLE_FAVORITE,
  SET_USER,
  SET_SORT,
  TOGGLE_SORT,
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

//handles sorting of movie lists
function sort(state = [], action) {
  switch (action.type) {
    case SET_SORT:
      return [
        ...state,
        {
          origin: action.sortArr.origin,
          titleSort: action.sortArr.titleSort,
          ratingSort: action.sortArr.ratingSort,
        },
      ];
    //updating sort direction using 0 for null, 1 ascending, 2 descending
    case TOGGLE_SORT:
      let index = state.findIndex((itm) => itm.origin === action.origin);
      let updateArr = [...state];
      if (action.update === 'title') {
        updateArr[index] = {
          ...state[index],
          titleSort:
            updateArr[index].titleSort + 1 > 2
              ? 0
              : (updateArr[index].titleSort += 1),
        };
      } else if (action.update === 'rating') {
        updateArr[index] = {
          ...state[index],
          ratingSort:
            updateArr[index].ratingSort + 1 > 2
              ? 0
              : (updateArr[index].ratingSort += 1),
        };
      } else {
        return state;
      }
      return updateArr;
    default:
      return state;
  }
}

const moviesApp = combineReducers({
  visibilityFilter,
  movies,
  favorites,
  user,
  sort,
});

export default moviesApp;
