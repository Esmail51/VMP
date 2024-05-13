import React, { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import logo from '../assets/img/CloudUpload.png'

const ImageUploader = ({ onImagesChange, data }) => {
  const [images, setImages] = useState([]);
  useEffect(() =>{
    const patchImage = () => {
      if (Array.isArray(data)) {
        const imageObjects = data.map((res) => ({
            name: "API-Image",
            preview: res
        }));
        setImages(imageObjects);
    }
  };
  patchImage()
  }, [data])

  const onDrop = useCallback((acceptedFiles) => {
    const imageFiles = acceptedFiles.map(file =>
      Object.assign(file, {
        preview: URL.createObjectURL(file)
      })
    );
    setImages(prevImages => [...prevImages, ...imageFiles]);
    
    onImagesChange([...images, ...imageFiles]);
  }, [images, onImagesChange]);

  const {getRootProps, getInputProps, isDragActive} = useDropzone({
    onDrop,
    multiple: true,
    accept: {
        'image/png': ['.png'],
        'image/jpeg': ['.jpeg'],
      }
  });

  const removeImage = (index) => {
    const updatedImages = [...images];
    updatedImages.splice(index, 1);
    setImages(updatedImages);
    onImagesChange(updatedImages);
  };

  return (
    <div>
      <div {...getRootProps()} className="drop-zone">
        <input {...getInputProps()}/>
        {isDragActive ?
            <p>Drop the files here ...</p> :
            <div>
            
            <img src={logo} alt='preview' style={{width:'40px', height:'30px'}}></img>
            <p style={{lineHeight:'20px'}}>Drag & drop image here,<br /><span style={{color:'red'}}>or Browse</span></p>
            </div>
        }
      </div>
      <div className="image-preview">
        {images.map((image, index) => (
          <div key={index} className="preview-item">
            <img src={image.preview} alt={`preview-${index}`} />
            <button onClick={() => removeImage(index)}>Remove</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageUploader;
