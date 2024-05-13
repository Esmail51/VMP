import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../App.css';
import { useTranslation } from 'react-i18next';
import Img from '../assets/img/register-img.png';


const Register = () => {
  const mobileNumber = localStorage.getItem('mobileNumber');
  const [vendorData, setVendorData] = useState({
    name: '',
    address: '',
    contact_details: '',
  });
  const [isMobileNumberRegistered, setIsMobileNumberRegistered] = useState(false);
  const navigate = useNavigate();
  const [submit, setsubmit] = useState(false)
  const [failed, setFailed] = useState(false)
  const [message, setMessage] = useState('');
  const { t } = useTranslation();

  useEffect(() => {
    const checkMobileNumber = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/checkMobileNumber/${mobileNumber}`);
        if (response.data && response.data.isRegistered) {
          const { name, address } = response.data.vendor;
          setVendorData({ ...vendorData, name, address });
          setIsMobileNumberRegistered(true);
        } else {
          setVendorData({ ...vendorData, name: '', address: '' });
          setIsMobileNumberRegistered(false);
        }
      } catch (error) {
        console.error('Error checking mobile number:', error);
      }
    };

    checkMobileNumber();
  }, [mobileNumber]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Send the vendor data to the backend for update
      const response = await axios.post('http://localhost:5000/vendorUpdate', vendorData);
      setsubmit(true)
      if(response.status = 200){
        const vendorid = response.data.vendor_id;
        localStorage.setItem('local-vendor-id',vendorid)
        setTimeout(() => {
          setMessage(navigate('/product'));
        }, 2000);
      }
    } catch (error) {
      setFailed(true)
      console.error('Error updating vendor:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setVendorData({ ...vendorData, [name]: value });
  };


  return (
    <div style={{padding:'50px'}}>
      <div className="top-content">
        <img src={Img} alt='' width={250}></img>
        <p style={{fontSize:'24px', textAlign:'start'}}>Let's Get Started</p>
        <p style={{fontSize:'14px', textAlign:'start', color:'gray'}}>Register your details</p>
      </div>
      <div className='green_box' style={{ display: submit ? 'block' : 'none' }}> {submit && <p>&#10003; t{('Vendor_sucss')}</p>} </div>
      <div className='red_box' style={{ display: failed ? 'block' : 'none' }}>   {failed && <p>&#10005; t{('Vendor_Fail')}.</p>}</div>
        
      
      
        <form onSubmit={handleSubmit} style={{lineHeight:'40px', fontSize:'16px'}}>
            <label>
              {t('vendor_name')}:</label>
            <input style={{
              border: "1px solid #4361EE",
              borderRadius:'12px',
            width: "-webkit-fill-available",
            textAlign:'start'}} 
            type="text" required placeholder="Vendor Name" name="name" value={vendorData.name} onChange={handleChange} readOnly={isMobileNumberRegistered} />
        
          
            <label>{t('Address')}:</label>
            <textarea style={{
              width: "-webkit-fill-available",
              height: "12vh",
              outline: "none",
              borderRadius: "20px",
              border: "1px solid #4361EE",
              padding:'10px',
              fontSize:'16px'
            }}
              type="text" name="address" required placeholder='Enter Your Address' value={vendorData.address} onChange={handleChange} readOnly={isMobileNumberRegistered} />
          
            <label>
              {t('Contact_Details')}:</label>
            <input style={{
              width: "-webkit-fill-available",border: "1px solid #4361EE",
              borderRadius: "12px",textAlign:'start',
            }}
              type="number"
              required
              name="contact_details"
              placeholder='Phone Number'
              value={vendorData.contact_details}
              onChange={handleChange}
            />
          {!isMobileNumberRegistered && <button style={{marginTop:'30px'}}type="submit">Submit</button>}
          {isMobileNumberRegistered && <button type="submit">Next</button>}
        </form>
    </div>
  );
};

export default Register;
