import React, { useEffect, useState } from "react";
import "./TitleCards.css";
import cards_data from "../../assets/cards/Cards_data";
import { useRef } from "react";
import { Link } from "react-router-dom";

const TitleCards = ({title, category}) => {

  const [apiData, setApiData] = useState([])

  const cardsRef = useRef();

  const handleWheel = (event) => {
    event.preventDefault(); // when ever we scroll the mouse wheel on this TitleCard component then it will not scroll vertically
    cardsRef.current.scrollLeft += event.deltaY;
  };

  useEffect(() => {

    const fetchData = async () => {
      try {
        const res = await fetch(`https://tmdbproxyserver.onrender.com/api/${category}`);
        const data = await res.json();
        setApiData(data.results);
        console.log(data)
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();

    cardsRef.current.addEventListener("wheel", handleWheel);
  }, []);
  return (
    <div className="title-cards">
      <h2>{title ? title:"Popular on Netflix"}</h2>
      <div className="card-list" ref={cardsRef}>
        {apiData.map((card, index) => {
          return (
            <Link to={`/player/${card.id}`} key={index} className="card">
              <img src={`https://tmdbproxyserver.onrender.com/api/poster${card.backdrop_path}`} alt="" />
              <p>{card.original_title}</p>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default TitleCards;
