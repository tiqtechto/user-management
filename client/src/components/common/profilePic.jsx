import React, { useState, useEffect } from 'react';
import { publicURL, isObjEmpty } from '../../Helper';
import Loader from './loader';

import useAPI from './useAPI';


export default function ProfilePic(props) {
  /* props */
  let fieldName = props.name;
  let size = props.size;
  let required = props.required;
  let regex = props.regex;
  let message = props.message;
  /* props */

  const [image, setImage] = useState(`${publicURL()}/images/noimage.png`);
  const [showUploadButton, setShowUploadButton] = useState(false);
  const [ferror, setError] = useState('');

  /* api */
  let [btnDisable, setBTNDisable] = useState(false);

  const {response, error, isLoading, execute} = useAPI();
  /* api */

  const handleImageUpload = (e) => {
    /* validation */
    const file = e.target.files[0];
    if(typeof file != 'undefined' && file != null && file != ''){
      const maxSizeMB = size;
      const fileSizeMB = file.size / (1024 * 1024);
      if (fileSizeMB > maxSizeMB) {
        setError(`File size should be less than ${maxSizeMB}MB.`);
        return;
      }
    

      if (!file && required) {
        setError('No file selected.')
        return;
      }
      
      if (!regex.test(file.type)) {
        setError(message);
        return;
      }
    
      /* validation */

      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState === 2) {
          setImage(reader.result);

          /* save image */
          execute('/profile-pic', 'post', {imageBase64 : reader.result});

          if(isLoading){
              return(<Loader/>);
          }
          /* save image */
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    } else {
      setError('');
    }
  };

  useEffect(()=>{
        if(error !== null){
            if(error.message.length > 0){
                setBTNDisable(false);
            }
        } else {
            if(response !== null){
                if(response.status === 200){
                    setBTNDisable(true);
                } else {
                    setBTNDisable(false);
                }
            }
        }
  },[error, response]);

  const handleClick = () => {
    const fileInput = document.getElementById('file-upload');
    fileInput.click();
  };

  useEffect(()=>{
    let imageSrc = props.image; 
    if(imageSrc !== '' && imageSrc !== null && imageSrc != 'undefined,undefined'){
      setImage(imageSrc);
    }
  },[props.image]);

  return (
    <div className="d-flex flex-column align-items-center justify-content-center">
      <input
        id="file-upload"
        type="file"
        name={fieldName}
        accept="image/*"
        onChange={handleImageUpload}
        className="d-none"
        disabled={btnDisable}
      />

      <img
        src={image}
        alt="Profile Picture"
        className={`${props.width} ${props.height} rounded-circle mt-4 cursor-pointer`}
        onClick={handleClick}
        onMouseEnter={() => setShowUploadButton(true)}
        onMouseLeave={() => setShowUploadButton(false)}
      />

      {ferror !== '' && <p className='error-text text-danger text-center me-1'>{ferror}</p>}

      {showUploadButton && (
        <button
          onClick={handleClick}
          className="mt-2 bg-transparent border-0 fw-bold text-black-50" disabled={btnDisable}
        >
          Upload Image
        </button>
      )}


        <style jsx="true">
        {`
            .w-32 {
                width: 8rem;
            }
            .h-32 {
                height: 8rem;
            }
        `}
        </style>
    </div>
  );
}