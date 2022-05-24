const axios = require('axios');

console.log('hi');

axios
  .get(
    'https://api.themoviedb.org/3/discover/tv?api_key=0a6719a7786e96813c1b96e2a0931d2e&language=en-US&sort_by=popularity.desc&with_original_language=en'
  )
  .then((response) => {
    console.log(response);
  })
  .catch((error) => {
    console.log(error);
  });
