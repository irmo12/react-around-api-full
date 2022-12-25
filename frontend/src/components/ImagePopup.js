function ImagePopup({ card, onClose, isOpen }) {
  return (
    <div
      className={`popup img-popout ${isOpen ? "popup_active" : ""} `}
      id="imgPopup"
    >
      <div className="popup__container-img">
        <button
          type="button"
          className="popup__container-close popup__container-close-img"
          aria-label="close"
          onClick={onClose}
        />
        <div className="popup__img-popout">
          {card && (
            <img className="img-popout__img" src={card.link} alt={card.name} />
          )}
        </div>
        <span className="img-popout__caption">{card.name}</span>
      </div>
    </div>
  );
}

export default ImagePopup;
