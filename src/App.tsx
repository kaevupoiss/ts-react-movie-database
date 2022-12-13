import React, {useEffect, useState} from "react";
import "./App.scss";

import {Header} from "./components/header";
import {MovieList} from "./components/movielist";

import type {Genre} from "./types";

function App() {
    const [genres, setGenres] = useState<Genre[]>([]);
    const [selectedGenre, setSelectedGenre] = useState<number>(-1);

    const [searchQuery, setSearchQuery] = useState<string>("");

    /**
     * Get all genres from the API.
     */
    const getGenres = () => {
        const qs = new URLSearchParams({
            api_key: process.env.REACT_APP_TMDB_API_KEY ?? "",
        });

        fetch(`${process.env.REACT_APP_API_URL}/genre/movie/list?${qs.toString()}`)
            .then(response => response.json())
            .then(
                (result) => {
                    result.genres.unshift({id: -1, name: "All Movies"});
                    setGenres(result.genres);
                }
            ).catch((error) => {
            console.error("Error:", error);
        })
    }

    /**
     * Set the desired genre.
     * @param id
     */
    const setGenre = (id: number) => {
        setSelectedGenre(id);
    }

    /**
     * Set the search query.
     * @param searchQuery
     */
    const handleSearchChange = (searchQuery: string) => {
        setSearchQuery(searchQuery);
    }

    /**
     * Get all genres on component mount.
     */
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
