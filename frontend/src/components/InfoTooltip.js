import { useLocation } from "react-router-dom";

import greenCheck from '../images/sucess.svg' ;
import redX from '../images/fail.svg';
function InfoTooltip({
    isOpen,
    onClose,
    success
  }) {
    let location = useLocation();
    const succesText = 'Success! You have now been registered.';
    const failText = 'Oops, something went wrong! Please try again.';

    if(location.pathname==='/signin' && success) {
      return;
    }

    return (
      <div className={`popup ${isOpen ? "popup_active" : ""}`}>
        <button
          type="button"
          className="popup__container-close"
          aria-label="close"
          onClick={onClose}
        />
        <div className="popup__container">
        <img className="popup__tooltip-img" src={success ? greenCheck : redX} alt='success or failure' />
        <h1 className="popup__tooltip-heading">{success ? succesText : failText}</h1>
        </div>
      </div>
    );
  }
  
  export default InfoTooltip;
  