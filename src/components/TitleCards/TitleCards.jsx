import React, { useEffect, useState, useRef } from "react";
import "./TitleCards.css";
import { Link } from "react-router-dom";

const TitleCards = ({ title, category }) => {
  const [apiData, setApiData] = useState([]);
  const cardsRef = useRef();

  const TMDB_BEARER = import.meta.env.VITE_TMDB_BEARER_TOKEN;
  const BASE_URL = "https://api.themoviedb.org/3";

  const handleWheel = (event) => {
    event.preventDefault();
    cardsRef.current.scrollLeft += event.deltaY;
  };

  // Build correct TMDB endpoint based on category
  const getEndpoint = () => {
    switch (category) {
      case "top-rated":
        return "/movie/top_rated";
      case "upcoming":
        return "/movie/upcoming";
      case "now-playing":
        return "/movie/now_playing";
      case "popular":
      default:
        return "/movie/popular";
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const endpoint = getEndpoint();
        const response = await fetch(`${BASE_URL}${endpoint}`, {
          method: "GET",
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${TMDB_BEARER}`,
          },
        });

        const data = await response.json();
        setApiData(data.results);
      } catch (error) {
        console.error("Error fetching TMDB data:", error);
      }
    };

    fetchData();

    const cardList = cardsRef.current;
    cardList.addEventListener("wheel", handleWheel);

    return () => {
      cardList.removeEventListener("wheel", handleWheel);
    };
  }, []);

  return (
    <div className="title-cards">
      <h2>{title ? title : "Popular on Netflix"}</h2>

      <div className="card-list" ref={cardsRef}>
        {apiData.map((movie) => (
          <Link to={`/player/${movie.id}`} key={movie.id} className="card">
            <img
              src={`https://image.tmdb.org/t/p/w500${movie.backdrop_path}`}
              alt={movie.title || movie.name}
            />
            <p>{movie.title || movie.name}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default TitleCards;
