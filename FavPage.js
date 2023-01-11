const resultContainer = document.querySelector('.favContainer')

// Get all the list of ids stored in local storage
let favMovies = JSON.parse(localStorage.getItem('favMoviesArray'))

//Get Movies from Server
async function getData(movieID) {
  const result = await fetch(
    `http://www.omdbapi.com/?i=${movieID}&apikey=35e9a3fc`,
  ) //Get data from API
  const movieDetails = await result.json() //Make data readable
  AddMovie(movieDetails) //Add to DOM
}

//Get all favorites movies by passing each ids
favMovies.forEach((id) => {
  getData(id) // Get Movie from API with ID
})

//Add movie to DOM
const AddMovie = (details) => {
  const child = document.createElement('div') //Create movie box
  child.setAttribute('id', details.imdbID) //Set unique id to delete exact movie
  child.setAttribute('class', 'favCard') //Add CSS
  child.innerHTML = `<div class="movie-poster">
        <img class="favImage"  src="${
          details.Poster != 'N/A' ? details.Poster : 'image_not_found.jpg'
        }" alt="movie-poster">
    </div>
    
    <div class="movie-info">
        <h3 class="FavMovie-title">${details.Title}</h3>
        <ul class="FavMovie-misc-info"">
            <li class="FavMovieReleaseYear">Year: ${details.Year}</li>
            <li class="FavRated">Ratings: ${details.Rated}</li>          
        </ul>
    
        <p class="favGenre"><b>Genre: </b>${details.Genre}</p>
        <p class="FavLanguage"><b>Language: </b> ${details.Language}</p>
    </div> 

    `
  //Create delete button for each favorites movie
  const btn = document.createElement('button')
  btn.setAttribute('class', 'deleteBtn') // Add CSS
  btn.innerHTML = `<i data-id="${details.imdbID}" class="fa-solid fa-trash">` //Set unique id to delete exact movie
  btn.addEventListener('click', deleteMovie) // Add event listener to each button
  child.appendChild(btn) //Add button to Movie
  resultContainer.appendChild(child) //Add movie to DOM
}

const deleteMovie = (e) => {
  //Get the id of the movie
  const delID = e.target.dataset.id
  //Get the specific movie
  const movie = document.getElementById(`${delID}`)
  //Delete movie from view
  movie.remove()
  //Delete the movie from list
  favMovies = favMovies.filter((id) => id != delID)
  //remove from localstorage
  localStorage.setItem('favMoviesArray', JSON.stringify(favMovies))
}
