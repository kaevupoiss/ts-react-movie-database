import React, {useEffect, useState} from "react";
import "./App.scss";

import {Header} from "./components/header";
import {MovieList} from "./components/movielist";

import type {Genre} from "./types";

function App() {
    const [genres, setGenres] = useState<Genre[]>([])
    const [selectedGenre, setSelectedGenre] = useState<number>(-1)

    const [searchQuery, setSearchQuery] = useState<string>('');

    const getGenres = () => {
        fetch('https://api.themoviedb.org/3/genre/movie/list?api_key=' + process.env.REACT_APP_TMDB_API_KEY)
            .then(response => response.json())
            .then(
                (result) => {
                    result.genres.unshift({id: -1, name: 'All Movies'});
                    setGenres(result.genres);
                }
            ).catch((error) => {
            console.error('Error:', error);
        })
    }

    const setGenre = (id: number) => {
        setSelectedGenre(id)
    }

    const handleSearchChange = (searchQuery: string) => {
        setSearchQuery('');
        setSearchQuery(searchQuery);
        setGenre(-1);
    }

    useEffect(() => {
        getGenres();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <div className="app">
            <Header genres={genres}
                    selectedGenre={selectedGenre}
                    searchQuery={searchQuery}
                    onGenreChange={setGenre}
                    onSearchQueryChange={handleSearchChange}
            />
            <main className="main">
                <MovieList genres={genres}
                           selectedGenre={selectedGenre}
                           searchQuery={searchQuery}
                           onGenreChange={setGenre}
                />
            </main>
            <footer></footer>
        </div>
    );
}

export default App;
