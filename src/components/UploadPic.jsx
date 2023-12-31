import {
    getStorage,
    ref,
    uploadBytesResumable,
    getDownloadURL,
  } from "firebase/storage";
  import { useEffect } from "react";
  import styled from "styled-components";
  import app from "../firebase";
  import React from 'react';
  
//   const Input = styled.input`
//     width: 100%;
//     border: 1px solid #232121;
//     padding: 10px;
//     border-radius: 5px;
//     background-color: white;
//     outline: none;
//     color: ${({ theme }) => theme.text};
//   `;

const Input = styled.input`
width: 475px;
height: 100%;
padding: 8px;
border: 1px solid #ccc;
border-radius: 5px;
background-color:white;
`;
  
  const UploadPic = ({
    img,
    setImg,
    imgPerc,
    setImgUrl,
    setImgPerc,
  }) => {
    useEffect(() => {
      const uploadFile = (file) => {
        const storage = getStorage(app);
        const fileName = new Date().getTime() + file.name;
        const storageRef = ref(storage, "profileImages/" + fileName);
        const uploadTask = uploadBytesResumable(storageRef, file);
  
        // Listen for state changes, errors, and completion of the upload.
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setImgPerc(Math.round(progress));
            switch (snapshot.state) {
              case "paused":
                console.log("Upload is paused");
                break;
              case "running":
                console.log("Upload is running");
                break;
              default:
                break;
            }
          },
          (error) => {
            console.log(error);
            switch (error.code) {
              case "storage/unauthorized":
                // User doesn't have permission to access the object
                console.log(error);
                break;
              case "storage/canceled":
                // User canceled the upload
                break;
              case "storage/unknown":
                // Unknown error occurred, inspect error.serverResponse
                break;
              default:
                break;
            }
          },
          () => {
            // Upload completed successfully, now we can get the download URL
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              setImgUrl((prev) => downloadURL);
            });
          }
        );
      };
  
      img && uploadFile(img);
    }, [img, setImgPerc, setImgUrl]);
  
    return (
      <>
        <Input
          type="file"
          accept="image/*"
          onChange={(e) => setImg((prev) => e.target.files[0])}
        />
        {imgPerc > 0 && "Uploading: " + imgPerc + "%"}
      </>
    );
  };
  
  export default UploadPic;