import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import '../App.css';
import { useNavigate } from 'react-router-dom';
import Img from '../assets/img/login.png'
import NepalFlag from '../assets/img/nepal-flag-icon.svg'
import { useTranslation } from 'react-i18next';
import UKflag from '../assets/img/uk-flag-round-circle-icon.svg';
import backArrow from '../assets/img/icons8-back-arrow-50.png';
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";



function Login() {
  const { t } = useTranslation();
  const { i18n } = useTranslation();
  const [phoneNumber, setPhoneNumber] = useState(''); //+977841306857
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [otpSent, setOtpSent] = useState(false);
  const [error, setError] = useState('');
  const otpFields = useRef([]);
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => { localStorage.clear() })

  const handlePhoneNumberChange = (e) => {
    setPhoneNumber(e.target.value);
  };
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };
  const EllipsesMenu = () => {
    return (
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
    )
  }

  const handleOtpChange = (index, event) => {
    const newBoxes = [...otp]; // Create a copy of the state
    newBoxes[index] = event.target.value.slice(0, 1); // Limit input to 1 character
    setOtp(newBoxes); // Update the state with the new value

    if (event.target.value !== '' && index < otp.length - 1) {
      otpFields.current[index + 1].focus();
    }

    const isLastBox = index === otp.length - 1;

    // Move focus based on user action
    if (event.target.value && !event.isComposing) { // Input entered (excluding composition)
      if (!isLastBox) {
        otpFields.current[index + 1].focus();
      }
    } else { // Input deleted or backspace pressed
      if (index > 0) {
        otpFields.current[index - 1].focus();
      }
    }
  };

  const isValidNepalPhoneNumber = (phoneNumber) => {
    // Regular expression to match Nepal phone number pattern
    const nepalPhoneNumberRegex = /^(?:\+?977|0)\d{9}$/;
    return nepalPhoneNumberRegex.test(phoneNumber);
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!isValidNepalPhoneNumber(phoneNumber)) {
      setError('Please enter a valid Nepal phone number.');
      return;
    }

    try {
      await axios.post('http://localhost:5000/send-otp', {
        phone_number: phoneNumber
      });
      setOtpSent(prevOtpSent => {
        console.log('OTP Sent:', !prevOtpSent);
        return !prevOtpSent;
      });
      setError('');
    } catch (error) {
      toast.error('Failed to send OTP. Please try again later!', {
        position: "top-center"
      });
      console.log('err',error)
      setError('Failed to send OTP. Please try again later.');
    }
  };

  const resendOTP = async() => {
    try{
      await axios.post('http://localhost:5000/send-otp', {
        phone_number: phoneNumber
      });
    } catch (err) {
      setError('Failed to send OTP. Please try again later.');
    }
  }

  const handleBack = () => {
    setOtpSent(false)
  }

  const handleVerifyOtp = async () => {
    const payload = {
      phone_number: phoneNumber,
      otp: otp.join('') // convert array to String
    }
    try {
      const OTPResponse = await axios.post('http://localhost:5000/verify-otp', payload);
      localStorage.setItem('mobileNumber', phoneNumber); // Save mobile number to local storage
      setError('');
      // Set logged in state to true

      if (OTPResponse.status === 200) {
        const Response = await axios.get(`http://localhost:5000//checkMobileNumber/${phoneNumber}`)
        console.log('response', Response)
        if (Response.data.isRegistered) {
          const vendorid = String(Response.data.vendor._id);
          localStorage.setItem('local-vendor-id', vendorid)
          navigate('/productlist');
        } else {
          navigate('/Home');
        }
      }
      localStorage.setItem('loggedIn', true);
    } catch (error) {
      setError(error.response.data.error || 'Invalid OTP');
    }
  };
  const changeLanguage = (e) => {
    console.log(e)
    i18n.changeLanguage(e);
    toggleMenu()
  }
  
  const handleBackButton = (e) => {
    e.preventDefault();
    if(otpSent){
      setOtpSent(false)
    }else {
      navigate('/')
    }
  }

  return (
    <div className="App">
      <div className="container">
        <EllipsesMenu />
        <img src={backArrow} alt='' width={35} style={{ position: 'absolute', top: '2%', left: '9%' }} onClick={(e) => handleBackButton(e)}></img>
        <img src={Img} alt="Logo" style={{ paddingTop: '50px', width:'100%' }} />
        <div className="input-container">
          <p style={{ fontSize: '4vw', fontWeight: '600', color:'#4361EE'}}>{t('OTP_Verification')}</p>
          <div>
            {otpSent ? (<p style={{fontSize:'3vw',color:'#000000', fontWeight:'500'}}>{t('OTP')}</p>) : <>
            <p style={{color:'#8a8686'}}>{t('home')} <span style={{color:"#000000",fontWeight:'600'}}>{t('OTP')}</span>
            <br />
            {t('sub_head')}</p>
          </>}
          </div>
          <div className='input-content'>
            {!otpSent && (
              <>
                <div className='l-h'>
                  <p>{t('Mobo_label')}</p>
                  <input
                    type="number"
                    value={phoneNumber}
                    onChange={handlePhoneNumberChange}
                  />
                  <br />
                  <span className="error-message">{error}</span><br />
                </div>
                <button style={{marginTop:'20px'}}onClick={handleSendOtp}>{t('get_OTP')}</button>
              </>
            )}

            {otpSent && (
              <>
                <div className="six-box-input">
                  {otp.map((otpChar, index) => (
                    <input
                      key={index}
                      type="text"
                      value={otpChar}
                      maxLength="1"
                      onChange={(e) => handleOtpChange(index, e)}
                      ref={(el) => (otpFields.current[index] = el)}
                      onKeyDown={(e) => {
                        if (e.key === 'Backspace' && !otpChar) {
                          handleOtpChange(index, e);
                        }
                      }}
                      className="box"
                    />
                  ))}
                </div>
                <span className='error'>{error}</span>
                <p>Don't recieve the OTP?<span style={{color:'red', fontWeight:'500'}} onClick={(e) => resendOTP(e)}>RESEND OTP</span></p>
                <br />
                <button onClick={handleVerifyOtp}>VERIFY & PROCEED</button>
                <br />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login