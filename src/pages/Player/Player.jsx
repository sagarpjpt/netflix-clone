import React, { use, useEffect, useRef, useState } from "react";
import "./Player.css";
import back_arrow_icon from "../../assets/back_arrow_icon.png";
import { useNavigate, useParams } from "react-router-dom";

const Player = () => {
  const TMDB_BEARER =
    import.meta.env.VITE_TMDB_BEARER_TOKEN;
  const BASE_URL = "https://api.themoviedb.org/3";
  const { id } = useParams();
  const navigate = useNavigate();

  const [video, setVideo] = useState(null);
  const [movieDetails, setMovieDetails] = useState({});
  const [cast, setCast] = useState([]);
  const [recommendations, setRecommendations] = useState([]);

  const castRef = useRef()
  const recommendRef = useRef()

  castRef.current?.addEventListener("wheel", handlewheel);
  recommendRef.current?.addEventListener("wheel", handlewheel);

  function handlewheel(e) {
    e.preventDefault();
    e.currentTarget.scrollLeft += e.deltaY;
  }

  // movie trailer fetch
  useEffect(() => {
    const fetchTrailer = async () => {
      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/movie/${id}/videos`,
          {
            headers: {
              accept: "application/json",
              Authorization: `Bearer ${TMDB_BEARER}`,
            },
          }
        );

        const data = await res.json();

        const trailer = data.results.find(
          (vid) => vid.type === "Trailer" && vid.site === "YouTube"
        );

        setVideo(trailer || data.results[0]);
      } catch (err) {
        console.error(err);
      }
    };

    fetchTrailer();
  }, [id]);

  // moview detail fetch
  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const res = await fetch(`${BASE_URL}/movie/${id}`, {
          method: "GET",
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${TMDB_BEARER}`,
          },
        });

        const data = await res.json();
        setMovieDetails(data);
        console.log("Movie Details:", data);
      } catch (err) {
        console.error("Error fetching movie details:", err);
      }
    };

    fetchMovieDetails();
  }, [id]);

  // fetch cast
  useEffect(() => {
    const fetchCast = async () => {
      try {
        const res = await fetch(`${BASE_URL}/movie/${id}/credits`, {
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${TMDB_BEARER}`,
          },
        });

        const data = await res.json();
        setCast(data.cast.slice(0, 10)); // Top 10 cast
      } catch (err) {
        console.error(err);
      }
    };

    fetchCast();
  }, [id]);

  // fetch recommendations
  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const res = await fetch(`${BASE_URL}/movie/${id}/recommendations`, {
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${TMDB_BEARER}`,
          },
        });

        const data = await res.json();
        setRecommendations(data.results);
      } catch (err) {
        console.error(err);
      }
    };

    fetchRecommendations();
  }, [id]);

  return (
    <div className="player">
      <img
        src={back_arrow_icon}
        alt=""
        className="back-arrow"
        onClick={() => navigate("/")}
      />

      {/* MOVIE SECTION */}
      <div className="movie-section">
        {/* Left = Trailer */}
        <div className="movie-left">
          {video && (
            <iframe
              className="movie-trailer"
              src={`https://www.youtube.com/embed/${video.key}?autoplay=1&mute=1`}
              frameBorder="0"
              allowFullScreen
              title="Movie Trailer"
            ></iframe>
          )}
          <div className="fade-overlay"></div>
        </div>

        {/* Right = Info */}
        <div className="movie-right">
          <h1>{movieDetails.title}</h1>
          <p className="overview">{movieDetails.overview}</p>

          <div className="details-row">
            <span>⭐ {movieDetails.vote_average?.toFixed(1)}</span>
            <span>⏳ {movieDetails.runtime} min</span>
            <span>📅 {movieDetails.release_date}</span>
          </div>

          <div className="genres">
            {movieDetails.genres?.map((g) => (
              <span key={g.id}>{g.name}</span>
            ))}
          </div>
        </div>
      </div>

      {/* CAST */}
      <h2>Cast</h2>
      <div className="cast-row" ref={castRef}>
        {cast.map((actor) => (
          <div className="cast-card" key={actor.id}>
            <img
              src={`https://image.tmdb.org/t/p/w185${actor.profile_path}`}
              alt={actor.name}
            />
            <p>{actor.name}</p>
          </div>
        ))}
      </div>

      {/* RECOMMENDATIONS */}
      <h2>More Like This</h2>
      <div className="recommend-row" ref={recommendRef}>
        {recommendations.map((rec) => (
          <img
            key={rec.id}
            src={`https://image.tmdb.org/t/p/w300${rec.poster_path}`}
            onClick={() => navigate(`/player/${rec.id}`)}
            className="recommend-card"
            alt=""
          />
        ))}
      </div>
    </div>
  );
};

export default Player;
