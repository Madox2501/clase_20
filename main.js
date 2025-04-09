// Base URL of your backend API
const baseUrl = 'http://127.0.0.1:3000/api/v1/';

// Fetches all movies from the API
async function getMovies() {
    try {
        // Send a GET request to fetch all movies
        const movies = await fetch(`${baseUrl}movies`);

        // Convert the response to JSON
        const result = await movies.json();

        // Log movie data to the console
        console.log(result.data);

        // Call the function to display movies in the DOM
        await showMovies(result.data);
    } catch (error) {
        // Catch any errors and log them
        console.error("Error fetching movies", error.message);
    }
}

// Call the function to load movies when script runs
getMovies();

// Renders movie cards into the DOM
function showMovies(movies) {
    console.log("Entered showMovies()");

    // Select the container where movies will be inserted
    const container = document.getElementById("movies");

    // Clear any previous content
    container.innerHTML = "";

    // Loop through each movie
    movies.forEach((movie) => {
        // Create a new div for the movie
        const movieElement = document.createElement("div");

        // Extract movie title and release date
        const movieTitle = movie.title;
        const date = movie.release_date;

        // Add a class for styling
        movieElement.classList.add("movie");

        // Add movie content using template literals
        movieElement.innerHTML = `
            <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movieTitle}">
            <h3>${movieTitle}</h3>
            <p>${date}</p>
        `;

        // Add a click listener to redirect to the detail page
        movieElement.addEventListener("click", () => {
            // Redirect to detail.html and pass the movie ID via query string
            window.location.href = `detail.html?movieId=${movie.id}`;
        });

        // Append the movie element to the container
        container.appendChild(movieElement);
    });
}
