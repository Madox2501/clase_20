// main-detail.js

// API constants
const API_KEY = "1bd30876d2f827b0c4a0787bb7bca3b3"; // TMDB API Key
const BASE_URL = "https://api.themoviedb.org/3"; // Base endpoint for TMDB API
const IMAGE_URL = "https://image.tmdb.org/t/p/w500"; // Base path for movie images
const YOUTUBE_URL = "https://www.youtube.com/embed/"; // Base URL to embed YouTube trailers

// Get the movieId from the query string (?movieId=xxx)
const urlParams = new URLSearchParams(window.location.search);
const movieId = urlParams.get("movieId");

// Load movie data when the page loads
(async function () {
  if (movieId) {
    await getMovieDetails(movieId);   // Load basic movie info
    await getMovieCredits(movieId);   // Load cast
    await getMovieTrailer(movieId);   // Load trailer
  } else {
    console.error("Missing movieId in URL.");
  }
})();

// Fetch and render movie details (title, overview, release date, genres, poster)
async function getMovieDetails(movieId) {
  try {
    const response = await fetch(`${BASE_URL}/movie/${movieId}?api_key=${API_KEY}&language=es-ES`);
    const data = await response.json();

    // Check if the data is valid
    if (!data || data.success === false) {
      console.error("API response error:", data?.status_message);
      return;
    }

    // Populate HTML elements with movie data
    document.getElementById("movie-title").textContent = data.title;
    document.getElementById("movie-overview").textContent = data.overview;
    document.getElementById("movie-release-date").textContent = data.release_date;

    const genres = data.genres.map((g) => g.name).join(", ");
    document.getElementById("movie-genres").textContent = genres;

    // Show poster or fallback image
    const poster = data.poster_path ? IMAGE_URL + data.poster_path : "https://placehold.co/200x300?text=No+Image";
    const posterImg = document.getElementById("movie-poster");
    posterImg.src = poster;
    posterImg.alt = `Poster of ${data.title}`;
  } catch (error) {
    console.error("Failed to fetch movie details:", error);
  }
}

// Fetch and render top 10 cast members
async function getMovieCredits(movieId) {
  try {
    const response = await fetch(`${BASE_URL}/movie/${movieId}/credits?api_key=${API_KEY}&language=es-ES`);
    const data = await response.json();

    const actorsContainer = document.getElementById("actors");
    actorsContainer.innerHTML = ""; // Clear any previous content

    if (!data.cast || data.cast.length === 0) {
      actorsContainer.innerHTML = "<p>No cast information available.</p>";
      return;
    }

    // Display up to 10 cast members
    data.cast.slice(0, 10).forEach((actor) => {
      const actorElement = document.createElement("div");
      actorElement.classList.add("actor");
      actorElement.innerHTML = `
        <img src="${actor.profile_path ? IMAGE_URL + actor.profile_path : 'https://placehold.co/150x225?text=No+Image'}" alt="${actor.name}">
        <p>${actor.name}</p>
      `;
      actorsContainer.appendChild(actorElement);
    });
  } catch (error) {
    console.error("Failed to fetch movie credits:", error);
  }
}

// Fetch and render YouTube trailer for the movie
async function getMovieTrailer(movieId) {
  try {
    const response = await fetch(`${BASE_URL}/movie/${movieId}/videos?api_key=${API_KEY}&language=es-ES`);
    const data = await response.json();

    const trailerContainer = document.getElementById("trailer-container");
    trailerContainer.innerHTML = ""; // Clear previous content

    if (!data.results || data.results.length === 0) {
      trailerContainer.innerHTML = "<p>No trailer available.</p>";
      return;
    }

    // Find the first YouTube trailer video
    const trailer = data.results.find(video => video.type === "Trailer" && video.site === "YouTube");

    if (trailer) {
      trailerContainer.innerHTML = `
        <iframe width="560" height="315" 
                src="${YOUTUBE_URL + trailer.key}" 
                frameborder="0" allowfullscreen>
        </iframe>`;
    } else {
      trailerContainer.innerHTML = "<p>No trailer available.</p>";
    }
  } catch (error) {
    console.error("Failed to fetch trailer:", error);
  }
}
