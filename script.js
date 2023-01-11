const movieSearchBox = document.getElementById('movie-search-box')
const searchList = document.getElementById('searchList')
const resultGrid = document.getElementById('result-grid')
const FavContainer = document.getElementById('favContainer')

// define localStorage array
if (localStorage.getItem('favMoviesArray')) {
  favMovieInLocal = JSON.parse(localStorage.getItem('favMoviesArray'))
} else {
  var favMovieInLocal = []
}

// load movies from API
async function loadMovies(searchTerm) {
  const URL = `https://omdbapi.com/?s=${searchTerm}&page=1&apikey=35e9a3fc`
  const res = await fetch(`${URL}`)
  const data = await res.json()
  // console.log(data.Search);
  if (data.Response == 'True') displayMovieList(data.Search)
}

function findMovies() {
  let searchTerm = movieSearchBox.value.trim()
  if (searchTerm.length > 0) {
    searchList.classList.remove('hide-searchList')
    loadMovies(searchTerm)
  } else {
    searchList.classList.add('hide-searchList')
  }
}

function displayMovieList(movies) {
  searchList.innerHTML = ''
  for (let idx = 0; idx < movies.length; idx++) {
    let movieListItem = document.createElement('div')
    movieListItem.dataset.id = movies[idx].imdbID // setting movie id in  data-id
    movieListItem.classList.add('searchList-item')
    if (movies[idx].Poster != 'N/A') moviePoster = movies[idx].Poster
    else moviePoster = 'image_not_found.jpg'

    movieListItem.innerHTML = `
        <div class = "search-item-thumbnail">
            <img src = "${moviePoster}">
        </div>
        <div class = "search-item-info">
            <h3>${movies[idx].Title}</h3>
            <p>${movies[idx].Year}</p>
        </div>
        `
    searchList.appendChild(movieListItem)
  }
  loadSearchResults()
}

function loadSearchResults() {
  const searchListMovies = searchList.querySelectorAll('.searchList-item')
  searchListMovies.forEach((movie) => {
    movie.addEventListener('click', async () => {
      searchList.classList.add('hide-searchList')
      movieSearchBox.value = ''
      const result = await fetch(
        `http://www.omdbapi.com/?i=${movie.dataset.id}&apikey=35e9a3fc`,
      )
      const movieDetails = await result.json()
      displayMovieDetails(movieDetails)
    })
  })
}

function displayMovieDetails(details) {
  resultGrid.innerHTML = `
    <div class = "movie-poster">
        <img src = "${
          details.Poster != 'N/A' ? details.Poster : 'image_not_found.jpg'
        }" alt = "movie poster">
    </div>
    <div class = "movieInformation">
        <h3 class = "movie-title">${details.Title}</h3>
        <ul class = "movie-misc-info">
            <li class = "movieReleaseYear">Year: ${details.Year}</li>
            <li class = "rated">Ratings: ${details.Rated}</li>
            <li class = "movieReleasedDate">Released: ${details.Released}</li>
        </ul>
        <p class = "genre"><b>Genre:</b> ${details.Genre}</p>
        <p class = "movieWriter"><b>Writer:</b> ${details.Writer}</p>
        <p class = "actors"><b>Actors: </b>${details.Actors}</p>
        <p class = "plot"><b>Plot:</b> ${details.Plot}</p>
        <p class = "language"><b>Language:</b> ${details.Language}</p>
        <p class = "awards"><b><i class = "fas fa-award"></i></b> ${
          details.Awards
        }</p>
        <p class="AddToFavBtn" id="favMovieId">Add to favorite</p>
    </div>
    `
  AddToFav(details)
}

if (!localStorage.getItem('favMoviesArray')) {
  let favMovieInLocal = []
}

function AddToFav(details) {
  // console.log(details)
  const addToFavBtn = document.getElementById('favMovieId')
   if (favMovieInLocal.includes(details.imdbID)) {
      alert('movie is already added in favorite list')
    } else {
      favMovieInLocal.push(details.imdbID)
      localStorage.setItem('favMoviesArray', JSON.stringify(favMovieInLocal))
      addToFavBtn.innerText = 'Added'
    }
}

window.addEventListener('click', (event) => {
  if (event.target.className != 'form-control') {
    searchList.classList.add('hide-searchList')
  }
})
