import React, {useEffect, useState} from "react";
import {Error, Genre, Movie} from "../types";
import {useIsVisible} from "../hooks/isVisible";
import "./movielist.scss";

type MovieListProps = {
    selectedGenre: number,
    searchQuery: string,
    genres: Genre[],
    onGenreChange: (id: number) => void,
}

export function MovieList({selectedGenre, searchQuery, genres, onGenreChange}: MovieListProps) {
    const [error, setError] = useState<Error | null>(null);
    const [isLoaded, setIsLoaded] = useState<boolean>(false);

    const [movies, setMovies] = useState<Movie[]>([])
    const [filteredMovies, setFilteredMovies] = useState<Movie[]>([])
    const [moviesPage, setMoviesPage] = useState<number>(1);
    const [selectedMovie, setSelectedMovie] = useState<number | null>(null);
    const [lastMovie, setLastMovie] = useState<HTMLLIElement | null>(null);

    const loadTriggerRef = React.createRef<HTMLLIElement>();
    const isLoadTriggerVisible = useIsVisible(loadTriggerRef);

    const getMovies = () => {

        fetch('https://api.themoviedb.org/3/discover/movie?api_key=' + process.env.REACT_APP_TMDB_API_KEY + '&page=' + moviesPage)
            .then(response => response.json())
            .then(
                (result) => {
                    setIsLoaded(true);
                    setMovies([...movies, ...result.results]);
                },
                (error) => {
                    setIsLoaded(true);
                    setError(error);
                }
            );

        setMoviesPage(moviesPage + 1);
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

    const getStarType = (index: number, vote_average: number) => {
        if (index < vote_average / 2) return 'star'
        if (index - 0.5 < vote_average / 2) return 'star_half'
        return 'star_border'
    }

    const checkGenre = (movie: Movie, genre: number) => {
        if (genre === -1) return true;
        return movie.genre_ids.includes(genre);
    }

    const checkSearch = (movie: Movie, searchQuery: string) => {
        if (searchQuery === '') return true;
        return movie.title.toLowerCase().includes(searchQuery.toLowerCase());
    }

    useEffect(() => {
        setFilteredMovies(
            movies.filter(movie => checkGenre(movie, selectedGenre) && checkSearch(movie, searchQuery))
        );
    }, [selectedGenre, searchQuery, movies]);

    useEffect(() => {
        getMovies();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        console.log(isLoadTriggerVisible) // TODO: remove

        if (isLoadTriggerVisible) {
            getMovies()
        }
    }, [isLoadTriggerVisible]) // eslint-disable-line react-hooks/exhaustive-deps

    if (error) {
        return <div>Error {error.status_code}: {error.status_message}</div>;
    }

    if (!isLoaded) {
        return <div>Loading...</div>;
    }

    return (
        <ul className="movie-list">
            {filteredMovies.map(movie =>
                <li className={`movie ${movie.id === selectedMovie ? "movie--selected" : ""}`}
                    onClick={(e) => setMovie(e, movie.id)}
                    key={movie.id}
                >
                    <div className="movie__poster">
                        {movie.poster_path &&
                            <img src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
                                 draggable="false"
                                 alt={movie.title}
                            />
                        }
                    </div>
                    <div className="movie__info-container">
                        <div className="movie__gradient"></div>
                        <div className="movie__info">
                            <h2 className="movie__title">{movie.title}</h2>
                            <div className="movie__rating"
                                 aria-label={"Rating: " + movie.vote_average + "out of 10"}
                            >
                                {[...Array(5)].map((_, i) =>
                                    <span className="material-icons movie__rating" aria-hidden="true" key={i}>
                                        {getStarType(i, movie.vote_average)}
                                    </span>
                                )}
                            </div>
                            <p>
                                {movie.overview}
                            </p>
                            <div className="movie__tags">
                                {movie.genre_ids.map(genreId =>
                                    <span className="movie__tag"
                                          onClick={() => onGenreChange(genreId)}
                                          key={genreId}
                                    >
                                        #{genres.find(genre => genre.id === genreId)?.name}
                                    </span>
                                )}
                            </div>
                        </div>
                        {movie.backdrop_path &&
                            <img className="movie__backdrop" draggable="false"
                                 src={`https://image.tmdb.org/t/p/w780/${movie.backdrop_path}`}
                                 alt={movie.title}
                            />
                        }
                    </div>
                </li>
            )}
            <li className="movie__load-trigger" ref={loadTriggerRef} aria-hidden="true"></li>
        </ul>
    )
}
