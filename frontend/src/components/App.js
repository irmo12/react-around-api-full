import Header from './Header'
import Main from './Main'
import Footer from './Footer'
import React, { useState, useEffect } from 'react'
import { Redirect, Route, useHistory } from 'react-router-dom'
import { api } from '../utils/api'
import { UserContext } from '../contexts/UserContext'
import EditProfilePopup from './EditProfilePopup'
import EditAvatarPopup from './EditAvatarPopup'
import AddPlacePopup from './AddPlacePopup'
import ImagePopup from './ImagePopup'
import CardDeleter from './CardDeleter'
import ProtectedRoute from './ProtectedRoute'
import Login from './Login'
import Register from './Register'
import InfoTooltip from './InfoTooltip'
import { auth } from '../utils/auth'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isEditAvatarOpen, setEditAvatarOpen] = useState(false)
  const [isEditProfileOpen, setEditProfileOpen] = useState(false)
  const [isAddPlaceOpen, setAddPlaceOpen] = useState(false)
  const [isImagePopupOpen, setImagePopupOpen] = useState(false)
  const [isDelCardWarnOpen, setDelCardWarnOpen] = useState(false)
  const [selectedCard, setSelectedCard] = useState({})
  const [isTooltipOpen, setIsTooltipOpen] = useState(false)
  const history = useHistory()
  const [isSuccess, setIsSuccess] = useState(false)
  const [cards, setCards] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [userData, setUserData] = useState({
    _id: '',
    email: '',
    name: '',
    about: '',
    avatar: '',
  })

  function login(data) {
    auth
      .signin(data)
      .then(() => {
        setIsLoggedIn(true)
        auth.checkToken(localStorage.getItem('token')).then((resData) => {
          setUserData(resData)
        })
        history.push('/main')
      })
      .catch((err) => {
        console.log(err.code, err.message)
        setIsTooltipOpen(true)
      })
  }

  function register(email, password) {
    auth
      .signup(email, password)
      .then(() => {
        setIsSuccess(true)
        setIsTooltipOpen(true)
      })
      .catch((err) => {
        console.log(err)
        setIsTooltipOpen(true)
      })
  }

  function signOut() {
    setUserData({ _id: '', email: '' })
    setIsLoggedIn(false)
    localStorage.removeItem('token')
  }

  function handleEditAvatarClick() {
    setEditAvatarOpen(true)
  }

  function handleEditProfileClick() {
    setEditProfileOpen(true)
  }

  function handleAddPlaceClick() {
    setAddPlaceOpen(true)
  }

  function handleCardClick(card) {
    setImagePopupOpen(true)
    setSelectedCard(card)
  }

  function handleTrashClick(card) {
    setDelCardWarnOpen(true)
    setSelectedCard(card)
  }

  function closeAllPopups() {
    setEditAvatarOpen(false)
    setEditProfileOpen(false)
    setAddPlaceOpen(false)
    setImagePopupOpen(false)
    setDelCardWarnOpen(false)
    setSelectedCard({})
    setIsLoading(false)
  }

  useEffect(() => {
    if (localStorage.getItem('token')) {
      auth
        .checkToken(localStorage.getItem('token'))
        .then((resData) => {
          setUserData(resData)
          setIsLoggedIn(true)
          history.push('/main')
        })
        .catch((err) => {
          console.log(err.code, err.message)
          setIsTooltipOpen(true)
        })
    }
  }, [])

  const popupOpen =
    isAddPlaceOpen ||
    isDelCardWarnOpen ||
    isEditAvatarOpen ||
    isEditProfileOpen ||
    isImagePopupOpen ||
    isTooltipOpen
  useEffect(() => {
    const closeByEscape = (e) => {
      if (e.key === 'Escape') {
        closeAllPopups()
        setIsTooltipOpen(false)
      }
    }
    if (popupOpen) {
      document.addEventListener('keydown', closeByEscape)
    }
    return () => document.removeEventListener('keydown', closeByEscape)
  }, [popupOpen])

  function handleUpdateUser(newUser) {
    setIsLoading(true)
    api
      .patchUserInfo(newUser, localStorage.getItem('token'))
      .then((user) => {
        setUserData({ ...userData, name: user.name, about: user.about })
        closeAllPopups()
      })
      .catch((err) => console.log(err))
  }

  function handleChangeProfilePicture(avatar) {
    setIsLoading(true)
    api
      .changeAvatar(avatar, localStorage.getItem('token'))
      .then((data) => {
        setUserData({ ...userData, avatar: data.avatar })
        closeAllPopups()
      })
      .catch((err) => console.log(err))
  }

  useEffect(() => {
    api
      .getInitialCards(localStorage.getItem('token'))
      .then((data) => setCards(data))
      .catch((err) => console.log(err))
  }, [])

  function handleCardLike(card) {
    const isLiked = card.likes.some((user) => user._id === userData._id)
    api
      .changeLikeCardStatus(card._id, isLiked, localStorage.getItem('token'))
      .then((newCard) => {
        setCards((state) =>
          state.map((currentCard) =>
            currentCard._id === card._id ? newCard : currentCard,
          ),
        )
      })
      .catch((err) => console.log(err))
  }

  function handleCardDelete() {
    setIsLoading(true)
    api
      .deleteCard(selectedCard._id, localStorage.getItem('token'))
      .then(() => {
        setCards((current) =>
          current.filter((card) => card._id !== selectedCard._id),
        )
        closeAllPopups()
      })
      .catch((err) => console.log(err))
  }

  function handleAddPlaceSubmit(data) {
    setIsLoading(true)
    api
      .postNewCard(data, localStorage.getItem('token'))
      .then((res) => {
        setCards([res, ...cards])
        closeAllPopups()
      })
      .catch((err) => console.log(err))
  }

  function closeTooltip() {
    if (isSuccess) {
      history.push('/signin')
    }
    setIsTooltipOpen(false)
    setTimeout(setIsSuccess, 400, false)
  }

  return (
    <>
      <div className="page">
        <UserContext.Provider value={userData}>
          <Header
            loggedIn={isLoggedIn}
            signOut={signOut}
            email={userData.email}
          />
          <ProtectedRoute path="/main" loggedIn={isLoggedIn}>
            <Main
              onEditProfileClick={handleEditProfileClick}
              onAddPlaceClick={handleAddPlaceClick}
              onEditAvatarClick={handleEditAvatarClick}
              onCardClick={handleCardClick}
              onTrashClick={handleTrashClick}
              onCardDelete={handleCardDelete}
              onLikeClick={handleCardLike}
              cards={cards}
            />
            <EditProfilePopup
              isOpen={isEditProfileOpen}
              onClose={closeAllPopups}
              onUpdateUser={handleUpdateUser}
              isLoading={isLoading}
            ></EditProfilePopup>
            <AddPlacePopup
              isOpen={isAddPlaceOpen}
              onClose={closeAllPopups}
              onAddPlaceSubmit={handleAddPlaceSubmit}
              isLoading={isLoading}
            />
            <EditAvatarPopup
              isOpen={isEditAvatarOpen}
              onClose={closeAllPopups}
              onUpdateAvatar={handleChangeProfilePicture}
              isLoading={isLoading}
            />
            <ImagePopup
              card={selectedCard}
              onClose={closeAllPopups}
              isOpen={isImagePopupOpen}
            />
            <CardDeleter
              isOpen={isDelCardWarnOpen}
              onClose={closeAllPopups}
              onConfirmDelete={handleCardDelete}
              isLoading={isLoading}
            />
          </ProtectedRoute>
        </UserContext.Provider>
        <InfoTooltip
          isOpen={isTooltipOpen}
          onClose={closeTooltip}
          success={isSuccess}
        />
        <Route path="/signin">
          <Login onLogin={login} />
        </Route>
        <Route path="/register">
          <Register onRegister={register} />
        </Route>
        <Route exact path="/">
          {isLoggedIn ? <Redirect to="/main" /> : <Redirect to="signin" />}
        </Route>
        <Footer />
      </div>
    </>
  )
}

export default App
