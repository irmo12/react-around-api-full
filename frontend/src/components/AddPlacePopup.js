import { useEffect } from 'react'
import PopupWithForm from './PopupWithForm'
import { useFormAndValidation } from '../hooks/useFormAndValidation'

export default function AddPlacePopup({
  isOpen,
  onClose,
  onAddPlaceSubmit,
  isLoading,
}) {

  const {
    values,
    handleChange,
    errors,
    isValid,
    resetForm,
  } = useFormAndValidation()

  useEffect(() => {
    resetForm()
  }, [isOpen,resetForm])

   function handleSubmit(e) {
    e.preventDefault()
    onAddPlaceSubmit({ name: values.placeName, link: values.link })
  }

  return (
    <PopupWithForm
      name="addCardPopup"
      heading="New&nbsp;place"
      submitText="Create"
      loadingText="Creating..."
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
              !errors.placeName
                ? 'popup__form-field'
                : 'popup__form-field popup__form-field_error'
            }
            placeholder="Title"
            name="placeName"
            required
            maxLength="30"
            id="title"
            value={values.placeName || ''}
            onChange={handleChange}
          />
          <span
            className={
              !errors.placeName
                ? 'popup__form-error-msg popup__form-error-msg_inactive'
                : 'popup__form-error-msg'
            }
            id="placeName"
          >
            {errors.placeName}
          </span>
        </div>
        <div className="popup__form-info-couple">
          <input
            type="url"
            className={
              !errors.link
                ? 'popup__form-field'
                : 'popup__form-field popup__form-field_error'
            }
            placeholder="Image link"
            name="link"
            required
            id="imgLink"
            value={values.link || ''}
            onChange={handleChange}
          />
          <span
            className={
              !errors.link
                ? 'popup__form-error-msg popup__form-error-msg_inactive'
                : 'popup__form-error-msg'
            }
            id="link"
          >
            {errors.link}
          </span>
        </div>
      </fieldset>
    </PopupWithForm>
  )
}
