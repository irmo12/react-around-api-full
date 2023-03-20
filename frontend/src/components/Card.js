import React, { useContext } from "react";
import  {UserContext}  from "../contexts/UserContext";

function Card({ card, onCardClick, onLikeClick, onTrashClick }) {
  function handleImgClick() {
    onCardClick(card);
  }

  function handleLikeClick() {
    onLikeClick(card);
  }

  function handleTrashClick() {
    onTrashClick(card);
  }

  const currentUser = useContext(UserContext);

  const isOwn = card.owner === currentUser._id;
  const cardDeleteOptionClass = `card__trash ${
    isOwn ? "" : "trash_display-none"
  }`;

  let isLiked = card.likes.some((id) => id === currentUser._id);
  let cardLikeButtonClass = `card__like-btn ${
    isLiked ? "card__like-btn_active" : ""
  }`;

  return (
    <article className="card" id={card._id}>
      <img
        className="card__img"
        src={card.link}
        alt={card.name}
        onClick={handleImgClick}
      />
      <button
        className={cardDeleteOptionClass}
        type="button"
        aria-label="trash"
        onClick={handleTrashClick}
      />
      <h2 className="card__caption">{card.name}</h2>
      <div className="card__like-area">
        <button
          className={cardLikeButtonClass}
          type="button"
          aria-label="like"
          onClick={handleLikeClick}
        />
        <p className="card__like-counter">{card.likes.length}</p>
      </div>
    </article>
  );
}

export default Card;
