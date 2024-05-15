import NepalFlag from '../assets/img/nepal-flag-icon.svg'
import { useTranslation } from 'react-i18next';
import UKflag from '../assets/img/uk-flag-round-circle-icon.svg';
import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import backArrow from '../assets/img/icons8-back-arrow-50.png';


const Header = () => {

  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  let Navigate = useNavigate();

  const changeLanguage = (e) => {
    i18n.changeLanguage(e);
    toggleMenu()
  }
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };
    return (

        <div>
            <img src={backArrow} alt='' width={35} style={{ position: 'absolute', top: '2%', left: '6%' }} onClick={() => Navigate(-1)}></img>
        <div className="ellipsis-menu">

            <div className="ellipsis" onClick={toggleMenu}>
              <div></div>
              <div></div>
              <div></div>
            </div>
            {isOpen && (
              <div className="menu">
                <div className="option" onClick={() => changeLanguage('en')} value='en'><img src={UKflag} alt='Uk'></img>English</div>
                <div className="option" onClick={() => changeLanguage('es')} value='es'><img src={NepalFlag} alt='NP'></img>Nepali</div>
              </div>
            )}
          </div>
          </div>
          
          
    )
}

export default Header