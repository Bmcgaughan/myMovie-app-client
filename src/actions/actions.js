export const SET_MOVIES = 'SET_MOVIES';
export const SET_FILTER = 'SET_FILTER';
export const SET_FAVORITE = 'SET_FAVORITE';
export const TOGGLE_FAVORITE = 'TOGGLE_FAVORITE';
export const SET_USER = 'SET_USER';
export const SET_SORT = 'SET_SORT';
export const TOGGLE_SORT = 'TOGGLE_SORT';

export function setMovies(value) {
  return { type: SET_MOVIES, value };
}

export function setFilter(value) {
  return { type: SET_FILTER, value };
}

export function setFavorites(value) {
  return { type: SET_FAVORITE, value };
}

export function toggleFavorite(movieId) {
  return { type: TOGGLE_FAVORITE, movieId };
}

export function setUser(user) {
  return { type: SET_USER, user };
}

export function setSort(sortArr) {
  return { type: SET_SORT, sortArr };
}

export function toggleSort(origin, update) {
  return { type: TOGGLE_SORT, origin, update};
}
