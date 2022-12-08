import React, {useEffect, useState} from 'react';
import './App.scss';
import {useIsVisible} from "./hooks/isVisible";

type Genre = {
    id: number,
    name: string
}

type Error = {
    status_message: string,
    status_code: number
}

type Movie = {
    poster_path: string,
    adult: boolean,
    overview: string,
    release_date: string,
    genre_ids: number[],
    id: number,
    original_title: string,
    original_language: string,
    title: string,
    backdrop_path: string,
    popularity: number,
    vote_count: number,
    video: boolean,
    vote_average: number
}

function App() {
    const [error, setError] = useState<Error | null>(null);
    const [isLoaded, setIsLoaded] = useState<boolean>(false);
    const [genres, setGenres] = useState<Genre[]>([])
    const [showAllGenres, setShowAllGenres] = useState<boolean>(false);
    const [selectedGenre, setSelectedGenre] = useState<number>(-1)
    const [movies, setMovies] = useState<Movie[]>([])
    const [filteredMovies, setFilteredMovies] = useState<Movie[]>([])
    const [moviesPage, setMoviesPage] = useState<number>(1);
    const [selectedMovie, setSelectedMovie] = useState<number | null>(null);
    const [lastMovie, setLastMovie] = useState<HTMLLIElement | null>(null);
    const [searchQuery, setSearchQuery] = useState<string>('');

    const loadTriggerRef = React.createRef<HTMLLIElement>();
    const isLoadTriggerVisible = useIsVisible(loadTriggerRef);

    const getGenres = () => {
        fetch('https://api.themoviedb.org/3/genre/movie/list?api_key=' + process.env.REACT_APP_TMDB_API_KEY)
            .then(response => response.json())
            .then(
                (result) => {
                    result.genres.unshift({id: -1, name: 'All Movies'});
                    setIsLoaded(true);
                    setGenres(result.genres);
                },
                (error) => {
                    setIsLoaded(true);
                    setError(error);
                }
            )
    }

    const getMovies = () => {

        fetch('https://api.themoviedb.org/3/discover/movie?api_key=' + process.env.REACT_APP_TMDB_API_KEY + '&page=' + moviesPage)
            .then(response => response.json())
            .then(
                (result) => {
                    setIsLoaded(true);
                    setMovies([...movies, ...result.results]);
                    setGenre(selectedGenre);
                },
                (error) => {
                    setIsLoaded(true);
                    setError(error);
                }
            );

        setMoviesPage(moviesPage + 1);
    }

    const setGenre = (id: number) => {
        if (id === -1) {
            setSelectedGenre(-1);
            setFilteredMovies(movies);
            return;
        }

        setSelectedGenre(id);
        setFilteredMovies(movies.filter(movie => movie.genre_ids.includes(id)));
    }

    const setMovie = (e: React.MouseEvent<HTMLLIElement>, id: number) => {
        if (!e.currentTarget) return;

        setSelectedMovie(id);
        const target = e.currentTarget as HTMLLIElement;
        const targetInfo = target.getElementsByClassName("movie__info-container")[0] as HTMLDivElement;

        setTimeout(() => {
            lastMovie?.style.removeProperty("height");
            target.style.height = target.offsetHeight + targetInfo.offsetHeight + 16 + 'px';
        }, 0);

        setLastMovie(target);
    }

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.value === '') {
            setFilteredMovies(movies);
            setSearchQuery('');
            return;
        }

        setSearchQuery(e.target.value);
        setGenre(-1);
        setFilteredMovies(filteredMovies.filter(movie => movie.title.toLowerCase().includes(e.target.value.toLowerCase())));
    }

    useEffect(() => {
        getGenres();
        getMovies();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        if (isLoadTriggerVisible) {
            getMovies();
        }
    }, [isLoadTriggerVisible]) // eslint-disable-line react-hooks/exhaustive-deps

    if (error) {
        return <div>Error {error.status_code}: {error.status_message}</div>;
    }

    if (!isLoaded) {
        return <div>Loading...</div>;
    }

    return (
        <div className="app">
            <header className="header">
                <h1>
                    Popular movies
                </h1>
                <div className="input-wrapper">
                    <input type="text" placeholder="Search for movies..." value={searchQuery}
                           onChange={handleSearchChange}/>
                    <span className="material-icons">search</span>
                </div>
                <ul className={`genres ${showAllGenres ? 'genres__showing-all' : ''}`} role="tablist"
                    aria-label="Genres">
                    {genres.slice(0, showAllGenres ? genres.length : 6).map(genre =>
                        <li className={`genres__genre ${selectedGenre === genre.id ? 'genres__genre--selected' : ''}`}
                            aria-selected={selectedGenre === genre.id}
                            key={genre.id}
                            role="tab"
                            onClick={() => setGenre(genre.id)}
                        >
                            {genre.name}
                        </li>
                    )}
                    <li className="genres__show-all" onClick={() => setShowAllGenres(!showAllGenres)}>
                        {showAllGenres ? 'Less' : 'More'}
                    </li>
                </ul>
            </header>
            <main className="main">
                <ul className="movie-list">
                    {filteredMovies.map(movie =>
                        <li className={`movie ${movie.id === selectedMovie ? "movie--selected" : ""}`}
                            onClick={(e) => setMovie(e, movie.id)}
                            key={movie.id}
                        >
                            <div className="movie__poster">
                                <img src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`} draggable="false"
                                     alt={movie.title}/>
                            </div>
                            <div className="movie__info-container">
                                <div className="movie__gradient"></div>
                                <div className="movie__info">
                                    <h2 className="movie__title">{movie.title}</h2>
                                    <div className="movie__rating"
                                         aria-label={"Rating: " + movie.vote_average + "out of 10"}>
                                        {[...Array(5)].map((_, i) =>
                                                <span className="material-icons movie__rating" aria-hidden="true" key={i}>
                                        {i < movie.vote_average / 2 ? 'star' :
                                            i - 0.5 < movie.vote_average / 2 ? 'star_half' : 'star_border'}
                                    </span>
                                        )}
                                    </div>
                                    <p>
                                        {movie.overview}
                                    </p>
                                    <div className="movie__tags">
                                        {movie.genre_ids.map(genreId =>
                                                <span className="movie__tag" onClick={() => setGenre(genreId)}
                                                      key={genreId}>
                                            #{genres.find(genre => genre.id === genreId)?.name}
                                        </span>
                                        )}
                                    </div>
                                </div>
                                <img className="movie__backdrop" draggable="false"
                                     src={`https://image.tmdb.org/t/p/w780/${movie.backdrop_path}`} alt={movie.title}/>
                            </div>
                        </li>
                    )}
                    <li className="movie__load-trigger" ref={loadTriggerRef} aria-hidden="true"></li>
                </ul>
            </main>
            <footer></footer>
        </div>
    );
}

export default App;
