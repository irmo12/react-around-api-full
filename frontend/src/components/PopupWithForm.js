function PopupWithForm({
  isOpen,
  name,
  onClose,
  onSubmit,
  heading,
  children,
  isLoading,
  loadingText,
  submitText,
  isValid,
}) {
  return (
    <div className={`popup ${isOpen ? 'popup_active' : ''}`} id={name}>
      <button
        type="button"
        className="popup__container-close"
        aria-label="close"
        onClick={onClose}
      />
      <div className="popup__container">
        <form name={name} className="popup__form" onSubmit={onSubmit}>
          <h2 className="popup__form-heading">{heading}</h2>
          {children}
          <button 
          type="submit" 
          className="popup__form-submit"
          disabled={!isValid}
          >
            {isLoading ? loadingText : submitText}
          </button>
        </form>
      </div>
    </div>
  )
}

export default PopupWithForm
