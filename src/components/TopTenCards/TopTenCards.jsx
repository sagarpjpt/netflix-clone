import React, { useEffect, useRef, useState } from "react";
import "./TopTenCards.css";
import { useNavigate } from "react-router-dom";
import { TMDB_BEARER } from "../../tmdb";

const TopTenCards = ({ title }) => {

  const cardRef = useRef();
  const [movies, setMovies] = useState([]);
  const navigate = useNavigate();

  cardRef.current?.addEventListener("wheel", handlewheel);

  function handlewheel(e) {
    e.preventDefault();
    cardRef.current.scrollLeft += e.deltaY;
  }

  useEffect(() => {
    const fetchTopTen = async () => {
      try {
        const res = await fetch(
          "https://api.themoviedb.org/3/discover/movie?region=IN&sort_by=popularity.desc",
          {
            headers: {
              accept: "application/json",
              Authorization: `Bearer ${TMDB_BEARER}`,
            },
          }
        );

        const data = await res.json();
        setMovies(data.results.slice(0, 10)); // Top 10
      } catch (err) {
        console.error("Error loading Top 10:", err);
      }
    };

    fetchTopTen();
  }, []);

  return (
    <div className="topten-section">
      <h2>{title}</h2>

      <div className="topten-row" ref={cardRef}>
        {movies.map((movie, index) => (
          <div className="topten-card" key={movie.id}>
            {/* Big Rank Number */}
            <div className="rank-number">{index + 1}</div>

            {/* Poster */}
            <div>
              <img
                src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
                alt={movie.title}
                onClick={() => navigate(`/player/${movie.id}`)}
              />
              <p className="movie-title">{movie.original_title}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopTenCards;
