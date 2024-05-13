// VendorManagementPlatform.js
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import ImageUploader from "../components/ReactDND"
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Img from '../assets/img/productUpload-img.png';



const Container = styled.div`
  height: 100vh;
`;

const top_content = {
  marginTop: "50px",
  fontSize: "14px",
  fontWeight: "600",
  textAlign: "center",
  color:'#4361EE'
}


const FormGroup = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 5px;
`;

const Input = styled.input`
  width: 100%;
  padding: 18px;
  border: 1px solid #4361EE;
  border-radius: 12px;
  box-sizing: border-box;
`;

const TextArea = styled.textarea`
  padding: 8px;
  border: 1px solid #4361EE;
  border-radius: 12px;
  box-sizing: border-box;
`;

const Button = styled.button`
  background-color: #8761b9;
  color: white;
  border: none;
  cursor: pointer;
  height: 30px;
  width: 98px;
  border-radius: 5px;

  &:hover {
    background-color: #8761b9;
  }
`;

const VendorManagementPlatform = (props) => {
  const navigate = useNavigate()
  const location = useLocation();
  const { t } = useTranslation();
  const { data, Update } = location.state || {};
  const [productName, setProductName] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [ Change, setChange ] = useState(false)
  const [errorMessage, setErrorMessage] = useState(false);

  useEffect(() => {
    if(Update){
      setChange(true)
    }
    const patchdata = data
    if(patchdata){
      setProductName(patchdata.product_name || '')
      setProductDescription(patchdata.product_description || "")
    }
  },[])


  const handleNameChange = (event) => {
    setProductName(event.target.value);
  };
  const handleDescriptionChange = (event) => {
    setProductDescription(event.target.value);
  };

  const handleImagesChange = async (newImages) => {
    const newFiles = [];
    for(const image of newImages) {
      if (image.type === 'image/png' || image.type === 'image/jpeg') {
        newFiles.push(image);
        console.log('its an file')
      }
      else {
        // If it's an URL, convert it to a file
        await urlToImage(image.preview, (imageBlob) => {
          // Create a new File from the Blob
          console.log('blob',imageBlob)
          const imageFile = new File([imageBlob], "image.jpg", { type: "image/jpeg" });
  
          // Push the new File to the newFiles array
          newFiles.push(imageFile);
        });
      }
      
    }
    console.log('new',newFiles)
    setSelectedImage(newFiles); 
  };

  const urlToImage = (url, callback) => {
    console.log('ork-1',url)
    const img = new Image();
    // img.crossOrigin = "Anonymous"; // Enable CORS for cross-origin images
    
  
    img.onload = () => {
      console.log('ork-2')
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      console.log('ork-3')
  
      canvas.width = img.width;
      canvas.height = img.height;
  
      // Draw the image onto the canvas
      ctx.drawImage(img, 0, 0);
  
      // Convert the canvas to a data URL
      const dataURL = canvas.toDataURL("image/png");
    console.log('ork-4')

  
      // Convert data URL to Blob
      const blob = dataURLtoBlob(dataURL);
  
      // Call the callback function with the Blob
      callback(blob);
    };
    img.onerror = (error) => {
      console.error('Image loading error:', error);
      callback(null); // Call the callback with null to handle the error
    };
  
    img.src = url;
  };

  const dataURLtoBlob = (dataURL) => {
    const parts = dataURL.split(",");
    const contentType = parts[0].match(/:(.*?);/)[1];
    const b64Data = atob(parts[1]);
    let buffer = new ArrayBuffer(b64Data.length);
    let view = new Uint8Array(buffer);
    for (let i = 0; i < b64Data.length; i++) {
      view[i] = b64Data.charCodeAt(i);
    }
    console.log('ork-5')

    return new Blob([buffer], { type: contentType });
  };

  const handleSubmit = async (e) => {

    e.preventDefault();
    if(!Change){
    const formData = new FormData();
    formData.append("vendor_id", localStorage.getItem('local-vendor-id'))
    formData.append("product_name", productName);
    formData.append("product_description", productDescription);
    if (!selectedImage || selectedImage.length === 0) {
      setErrorMessage(true);
      return;
    }

    selectedImage.forEach((image, index) => {
      formData.append(`image`, image);
    });
    try {
      const Response = await axios.post('http://localhost:5000/addProduct', formData)
      console.log('reee', Response)
      if (Response.status === 200) {
        navigate('/productlist')
      }
    } catch (error) {}
  }

    if(Change){
      const UpdateFormData = new FormData();
      UpdateFormData.append("product_id",data.product_id);
      UpdateFormData.append("product_name", productName);
      UpdateFormData.append("product_description", productDescription);
      UpdateFormData.append("vendor_id", data.vendor_id)
      UpdateFormData.append("image_paths",data.image_paths)
      try {
        const UpdateResponse = await axios.post('http://localhost:5000/updateProduct',UpdateFormData)
      if(UpdateResponse.status === 200 ){
        navigate('/productlist')
      }
      } catch(error) {}
      
    }
  };

  return (
    <Container>
      <div style={top_content}>
        <img src={Img} alt='' width={350}></img>
        <p>{t('Pro_Details')}</p>
        <div className='red_box' style={{ display: errorMessage ? 'block' : 'none' }}>   {errorMessage && <p> Upload Image to continue.</p>}</div>
      </div>
      
      <form onSubmit={handleSubmit} style={{padding:'30px', lineHeight:'50px'}}>
        <FormGroup >
            <Label>{t('product_Name')}:</Label>
            <Input
              style={{
                backgroundColor: "#fff",
                textAlign:'start'
              }}
              type="text"
              placeholder="Product Name"
              value={productName}
              onChange={handleNameChange }
              required
            />
        </FormGroup>
        <FormGroup>
            <Label>{t('Product_Desc')}:</Label>
            <TextArea
              style={{
                width: "-webkit-fill-available",
                height: "12vh",
                outline: "none",
                fontSize: '20px'
              }}
              placeholder="Description"
              value={productDescription}
              onChange={handleDescriptionChange}
              required
            />
        </FormGroup>
          <FormGroup>
            <Label>{t('DnD')}</Label>
            <ImageUploader onImagesChange={handleImagesChange} data= {data ? data.image_paths : null}/>
          </FormGroup>
          <button type="submit">{ Update ? 'Update' : 'Submit'}</button>
      </form>
    </Container>
  );

};

export default VendorManagementPlatform;
