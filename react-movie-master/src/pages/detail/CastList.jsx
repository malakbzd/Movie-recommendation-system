import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import tmdbApi from "../../api/tmdbApi";
import apiConfig from "../../api/apiConfig";

const CastList = (props) => {
  const { category } = useParams();
  const [casts, setCasts] = useState([]);

  useEffect(() => {
    const getCredits = async () => {
      if (!props.id) return;
      try {
        const response = await tmdbApi.credits(category, props.id);
        setCasts(response.cast ? response.cast.slice(0, 5) : []);
      } catch (err) {
        // Silently catch error so the page never crashes with a 404 overlay
        setCasts([]);
      }
    };
    getCredits();
  }, [category, props.id]);

  return (
    <div className="casts">
      {casts.map((cast, index) => (
        <div key={index} className="casts__item">
          <div
            className="casts__item__img"
            style={{
              backgroundImage: `url(${apiConfig.w500Image(cast.profile_path)})`,
            }}
          ></div>
          <p className="casts__item__name">{cast.name}</p>
        </div>
      ))}
    </div>
  );
};

export default CastList;