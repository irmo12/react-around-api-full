import React, { useContext, useEffect } from 'react'
import PopupWithForm from './PopupWithForm'
import { useFormAndValidation } from '../hooks/useFormAndValidation'
import { CurrentUserContext } from '../contexts/CurrentUserContext'

function EditProfilePopup({ isOpen, onClose, onUpdateUser, isLoading }) {
  const currentUser = useContext(CurrentUserContext)
  const {
    values,
    handleChange,
    errors,
    isValid,
    setValues,
  } = useFormAndValidation()

  useEffect(() => {
    setValues({
      profileName: currentUser.name,
      profileAbout: currentUser.about,
    })
  }, [currentUser, setValues])

  function handleSubmit(e) {
    e.preventDefault()
    onUpdateUser({
      name: values.profileName,
      about: values.profileAbout,
    })
  }

  return (
    <PopupWithForm
      name="editProfile"
      heading="Edit&nbsp;profile"
      submitText="Save"
      loadingText="Saving..."
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      isLoading={isLoading}
      isValid={isValid}
    >
      <fieldset className="popup__form-inputs">
        <div className="popup__form-info-couple">
          <input
            type="text"
            className={
              !errors.profileName
                ? 'popup__form-field'
                : 'popup__form-field popup__form-field_error'
            }
            placeholder="Name"
            name="profileName"
            required
            maxLength="40"
            minLength="2"
            id="name"
            value={values.profileName || ''}
            onChange={handleChange}
          />
          <span
            className={
              !errors.profileName
                ? 'popup__form-error-msg popup__form-error-msg_inactive'
                : 'popup__form-error-msg'
            }
            id="profileName"
          >
            {errors.profileName}
          </span>
        </div>
        <div className="popup__form-info-couple">
          <input
            type="text"
            className={
              !errors.profileAbout
                ? 'popup__form-field'
                : 'popup__form-field popup__form-field_error'
            }
            placeholder="About me"
            name="profileAbout"
            required
            maxLength="200"
            minLength="2"
            id="about"
            value={values.profileAbout || ''}
            onChange={handleChange}
          />
          <span
            className={
              !errors.profileAbout
                ? 'popup__form-error-msg popup__form-error-msg_inactive'
                : 'popup__form-error-msg'
            }
            id="profileAbout"
          >
            {errors.profileAbout}
          </span>
        </div>
      </fieldset>
    </PopupWithForm>
  )
}

export default EditProfilePopup
