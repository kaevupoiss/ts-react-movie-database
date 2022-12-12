import React, {useState} from "react";
import {Genre} from "../types";
import "./header.scss";

type HeaderProps = {
    genres: Genre[],
    selectedGenre: number,
    searchQuery: string,
    onSearchQueryChange: (searchQuery: string) => void,
    onGenreChange: (genre: number) => void,
}

export function Header({genres, selectedGenre, searchQuery, onSearchQueryChange, onGenreChange}: HeaderProps) {
    const [showAllGenres, setShowAllGenres] = useState<boolean>(false);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const target = e.target as HTMLInputElement;
        onSearchQueryChange(target.value);
    }

    const handleGenreChange = (id: number) => {
        onGenreChange(id);
    }

    return (
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
                        onClick={() => handleGenreChange(genre.id)}
                    >
                        {genre.name}
                    </li>
                )}
                <li className="genres__show-all" onClick={() => setShowAllGenres(!showAllGenres)}>
                    {showAllGenres ? 'Less' : 'More'}
                </li>
            </ul>
        </header>
    )
}
