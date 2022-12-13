import React, {useEffect, useState} from "react";
import {Genre, Movie} from "../types";
import {useIsVisible} from "../hooks/isVisible";
import "./movielist.scss";
import {SingleMovie} from "./singlemovie";

type MovieListProps = {
    selectedGenre: number,
    searchQuery: string,
    genres: Genre[],
    onGenreChange: (id: number) => void,
}

export function MovieList({selectedGenre, searchQuery, genres, onGenreChange}: MovieListProps) {
    const [movies, setMovies] = useState<Movie[]>([]);
    const [filteredMovies, setFilteredMovies] = useState<Movie[]>([]);
    const [moviesPage, setMoviesPage] = useState<number>(1);
    const [selectedMovieId, setSelectedMovieId] = useState<number>(-1);
    const [selectedMovie, setSelectedMovie] = useState<HTMLLIElement | undefined>(undefined);

    const loadTriggerRef = React.createRef<HTMLLIElement>();
    const isLoadTriggerVisible = useIsVisible(loadTriggerRef);

    /**
     * Get more movies from the API and append them to movies list.
     */
    const getMovies = async () => {

        const qs = new URLSearchParams({
            api_key: process.env.REACT_APP_TMDB_API_KEY ?? "",
            page: moviesPage.toString(),
        });

        setMoviesPage(moviesPage + 1);

        await fetch(`${process.env.REACT_APP_API_URL}/discover/movie?${qs.toString()}`)
            .then(response => response.json())
            .then((result) => {
                setMovies([...movies, ...result.results]);
            })
            .catch((error) => {
                console.error("Error:", error);
            });
    }

    /**
     * Open new movie info and close the old one.
     * @param id
     * @param movieRef
     * @param infoRef
     */
    const setMovie = (id: number, movieRef?: HTMLLIElement, infoRef?: HTMLDivElement) => {

        if (!movieRef) {
            setTimeout(() => {
                selectedMovie?.style.removeProperty("height");
                setSelectedMovie(undefined);
                setSelectedMovieId(-1);
            });
            return;
        }

        setSelectedMovieId(id);

        if (!infoRef) return;

        setTimeout(() => {
            selectedMovie?.style.removeProperty("height");
            movieRef.style.height = movieRef.offsetHeight + infoRef.offsetHeight + 16 + 'px';
        }, 0);

        setSelectedMovie(movieRef);
    }

    /**
     * Check if movie is in the selected genre
     * @param movie
     * @param genre
     */
    const checkGenre = (movie: Movie, genre: number) => {
        if (genre === -1) return true;
        return movie.genre_ids.includes(genre);
    }

    /**
     * Check if the movie title contains the search query
     * @param movie
     * @param searchQuery
     */
    const checkSearch = (movie: Movie, searchQuery: string) => {
        if (searchQuery === "") return true;
        return movie.title.toLowerCase().includes(searchQuery.toLowerCase());
    }

    /**
     * Filter movies based on selected genre and search query
     * Triggers when movies, selectedGenre or searchQuery changes
     */
    useEffect(() => {
        if (selectedMovieId !== -1) setMovie(-1);

        setFilteredMovies(
            movies.filter(movie => checkGenre(movie, selectedGenre) && checkSearch(movie, searchQuery))
        );
    }, [selectedGenre, searchQuery, movies]); // eslint-disable-line react-hooks/exhaustive-deps

    /**
     *  Load more movies when the load trigger is visible.
     *  Triggers again if movie list changes until trigger is out of view.
     */
    useEffect(() => {
        if (isLoadTriggerVisible) {
            getMovies();
        }
    }, [isLoadTriggerVisible, movies]); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <ul className="movie-list">
            {filteredMovies.map(movie =>
                <SingleMovie movie={movie}
                             selectedMovieId={selectedMovieId}
                             onMovieClick={setMovie}
                             onGenreClick={onGenreChange}
                             genres={genres}
                             key={movie.id}
                />
            )}
            <li className="movie__load-trigger" ref={loadTriggerRef} aria-hidden="true"></li>
        </ul>
    )
}
