const API_URL = 'http://localhost:3000/movies';

const movieListDiv = document.getElementById('movie-list');
const searchInput = document.getElementById('search-input');
const form = document.getElementById('add-movie-form');

let allMovies = [];

function renderMovies(moviesToDisplay) {
  movieListDiv.innerHTML = '';
  if (moviesToDisplay.length === 0) {
    movieListDiv.innerHTML = '<p>No movies found matching your criteria.</p>';
    return;
  }
  moviesToDisplay.forEach(movie => {
    const movieElement = document.createElement('div');
    movieElement.classList.add('movie-item');
    movieElement.innerHTML = `
		<p><strong>${movie.title}</strong> (${movie.year}) - ${movie.genre}</p>
		<button onclick="editMoviePrompt('${movie.id}', '${movie.title}', ${movie.year}, '${movie.genre}')">Edit</button>
		<button onclick="deleteMovie('${movie.id}')">Delete</button>

		`;
    movieListDiv.appendChild(movieElement);
  });
}
async function fetchMovies() {
  try {
    const response = await fetch(API_URL);
    const movies = await response.json();
    allMovies = movies;
    renderMovies(allMovies);
  } catch (error) {
    console.error('Error fetching movies:', error);
  }
}

fetchMovies();

searchInput.addEventListener('input', function () {
  const searchTerm = searchInput.value.toLowerCase();

  const filteredMovies = allMovies.filter(movie => {
    const titleMatch = movie.title.toLowerCase().includes(searchTerm);
    const genreMatch = movie.genre.toLowerCase().includes(searchTerm);
    return titleMatch || genreMatch;
  });

  renderMovies(filteredMovies);
});


form.addEventListener('submit', async function (event) {
  event.preventDefault();
  const newMovie = {
    title: document.getElementById('title').value,
    genre: document.getElementById('genre').value,
    year: parseInt(document.getElementById('year').value)
  };
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newMovie),
    });
    if (!response.ok) throw new Error('Failed to add movie');
    await response.json();
    this.reset();
    fetchMovies();
  } catch (error) {
    console.error('Error adding movie:', error);
  }
});

function editMoviePrompt(id, currentTitle, currentYear, currentGenre) {
  const newTitle = prompt('Enter new Title:', currentTitle);
  const newYearStr = prompt('Enter new Year:', currentYear);
  const newGenre = prompt('Enter new Genre:', currentGenre);
  if (newTitle && newYearStr && newGenre) {
    const updatedMovie = {
      id: id,
      title: newTitle,
      year: parseInt(newYearStr),
      genre: newGenre
    };
    updateMovie(id, updatedMovie);
  }
}

async function updateMovie(movieId, updatedMovieData) {
  try {
    const response = await fetch(`${API_URL}/${movieId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedMovieData),
    });
    if (!response.ok) throw new Error('Failed to update movie');
    await response.json();
    fetchMovies();
  } catch (error) {
    console.error('Error updating movie:', error);
  }
}

async function deleteMovie(movieId) {
  try {
    const response = await fetch(`${API_URL}/${movieId}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete movie');
    fetchMovies();
  } catch (error) {
    console.error('Error deleting movie:', error);
  }
}
