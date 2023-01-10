import React, { useContext } from 'react'
import { CurrentUserContext } from '../contexts/CurrentUserContext'
import Card from './Card'

function Main(props) {
  const {
    onEditProfileClick,
    onAddPlaceClick,
    onEditAvatarClick,
    onCardClick,
    cards,
    onLikeClick,
    onTrashClick,
  } = props

  const currentUser = useContext(CurrentUserContext)

  return (
    <main className="main">
      <section className="profile">
        <div className="profile__user">
          <div className="profile__picture-wrapper">
            <img
              className="profile__picture"
              src={`${currentUser.avatar}`}
              alt="user profile"
            />
            <div className="profile__picture-overlay">
              <div className="profile__picture-button-wrapper">
                <button
                  className="profile__picture-button"
                  type="button"
                  onClick={onEditAvatarClick}
                />
              </div>
            </div>
          </div>
          <div className="profile__details">
            <h1 className="profile__user-name">{currentUser.name}</h1>
            <button
              className="profile__edit-button"
              type="button"
              aria-label="edit profile"
              onClick={onEditProfileClick}
            />
            <p className="profile__user-about">{currentUser.about}</p>
          </div>
        </div>
        <button
          className="profile__add-btn"
          type="button"
          aria-label="add card"
          onClick={onAddPlaceClick}
        />
      </section>

      <section className="gallery">
        {cards.map((card) => (
          <Card
            card={card}
            key={card._id}
            onCardClick={onCardClick}
            onLikeClick={onLikeClick}
            onTrashClick={onTrashClick}
          />
        ))}
      </section>
    </main>
  )
}

export default Main
