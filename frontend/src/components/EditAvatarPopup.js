import React, { useEffect } from 'react'
import PopupWithForm from './PopupWithForm'
import { useFormAndValidation } from '../hooks/useFormAndValidation'

export default function EditAvatarPopup({
  isOpen,
  onClose,
  onUpdateAvatar,
  isLoading,
}) {
  const {
    values,
    handleChange,
    errors,
    isValid,
    resetForm,
  } = useFormAndValidation()

  function handleSubmit(e) {
    e.preventDefault()
    onUpdateAvatar({
      avatar: values.imageLink,
    })
  }

  useEffect(() => {
    resetForm()
  }, [isOpen,resetForm])

  return (
    <PopupWithForm
      name="avatar"
      heading="Change&nbsp;profile&nbsp;picture"
      submitText="Save"
      loadingText="Saving..."
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      isLoading={isLoading}
      isValid={isValid}
    >
      <fieldset className={'popup__form-inputs'}>
        <div className="popup__form-info-couple">
          <input
            type="url"
            className={
              !errors.imageLink
                ? 'popup__form-field'
                : 'popup__form-field popup__form-field_error'
            }
            placeholder="Image link"
            name="imageLink"
            required
            id="avatarLink"
            value={values.imageLink || ''}
            onChange={handleChange}
          />
          <span
            className={
              !errors.imageLink
                ? 'popup__form-error-msg popup__form-error-msg_inactive'
                : 'popup__form-error-msg'
            }
            id="imageLink"
          >{errors.imageLink}</span>
        </div>
      </fieldset>
    </PopupWithForm>
  )
}
