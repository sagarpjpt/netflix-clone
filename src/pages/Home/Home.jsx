import React, { useEffect, useState } from "react";
import "./Home.css";
import Footer from "../../components/Footer/Footer";
import Navbar from "../../components/Navbar/Navbar";
import play_icon from "../../assets/play_icon.png";
import info_icon from "../../assets/info_icon.png";
import TitleCards from "../../components/TitleCards/TitleCards";
import { Link } from "react-router-dom";
import TopTenCards from "../../components/TopTenCards/TopTenCards";

const Home = () => {
  const TMDB_BEARER = import.meta.env.VITE_TMDB_BEARER_TOKEN;
  const BASE_URL = "https://api.themoviedb.org/3";

  const [heroMovie, setHeroMovie] = useState(null);

  // FETCH RANDOM POPULAR MOVIE FOR HERO SECTION
  useEffect(() => {
    const fetchHeroMovie = async () => {
      try {
        const res = await fetch(`${BASE_URL}/movie/popular`, {
          method: "GET",
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${TMDB_BEARER}`,
          },
        });

        const data = await res.json();
        if (data.results.length > 0) {
          const randomMovie =
            data.results[Math.floor(Math.random() * data.results.length)];
          setHeroMovie(randomMovie);
        }
      } catch (err) {
        console.error("Error fetching hero movie:", err);
      }
    };

    fetchHeroMovie();
  }, []);

  return (
    <div className="home">
      <Navbar />

      {heroMovie && (
        <div className="hero">
          <img
            src={`https://image.tmdb.org/t/p/original${heroMovie.backdrop_path}`}
            alt=""
            className="banner-img"
          />

          <div className="hero-caption">
            <h1 className="hero-title">{heroMovie.title}</h1>

            <p>{heroMovie.overview?.slice(0, 150)}...</p>

            <div className="hero-btns">
              <Link to={`/player/${heroMovie.id}`}>
                <button className="btn">
                  <img src={play_icon} alt="" /> Play
                </button>
              </Link>
              <Link to={`/player/${heroMovie.id}`}>
                <button className="btn dark-btn">
                  <img src={info_icon} alt="" /> More Info
                </button>
              </Link>
            </div>

            <TitleCards category={"popular"} />
          </div>
        </div>
      )}

      <div className="more-cards">
        <TopTenCards title={"Trending In Your Country"} />
        <TitleCards title={"Blockbuster Movies"} category={"top-rated"} />
        <TitleCards title={"Only on Netflix"} category={"popular"} />
        <TitleCards title={"Upcoming"} category={"upcoming"} />
        <TitleCards title={"Top Pics for You"} category={"now-playing"} />
      </div>

      <Footer />
    </div>
  );
};

export default Home;
