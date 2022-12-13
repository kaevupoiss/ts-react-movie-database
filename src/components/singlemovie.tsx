import "./singlemovie.scss";
import React, {useRef} from "react";
import {Genre, Movie} from "../types";

type SingleMovieProps = {
    movie: Movie,
    genres: Genre[],
    selectedMovieId: number,
    onMovieClick: (id: number, movieRef: HTMLLIElement, infoRef: HTMLDivElement) => void,
    onGenreClick: (id: number) => void,
}

export function SingleMovie({movie, genres, selectedMovieId, onMovieClick, onGenreClick}: SingleMovieProps) {

    const movieRef = useRef<HTMLLIElement>(null);
    const infoRef = useRef<HTMLDivElement>(null);

    const getStarType = (index: number, vote_average: number) => {
        if (index < vote_average / 2) return "star";
        if (index - 0.5 < vote_average / 2) return "star_half";
        return "star_border";
    }

    const handleMovieClick = () => {
        if (movieRef.current && infoRef.current) {
            onMovieClick(movie.id, movieRef.current, infoRef.current);
        }
    }

    return (
        <li className={`movie ${movie.id === selectedMovieId ? "movie--selected" : ""}`}
            onClick={() => handleMovieClick()}
            onFocus={() => handleMovieClick()}
            ref={movieRef}
            tabIndex={0}
        >
            <div className="movie__poster">
                {movie.poster_path &&
                    <img src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
                         draggable="false"
                         alt={movie.title}
                    />
                }
                <div className="movie__play-button"></div>
            </div>
            <div className="movie__info-container" ref={infoRef}>
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
                                  onClick={() => onGenreClick(genreId)}
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
    );
}
