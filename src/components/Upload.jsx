import React, { useState } from "react";
import { useEffect } from "react";
import styled from "styled-components";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import app from "../firebase";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../utils/axiosConfig";
import Swal from "sweetalert2";

const Container = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  background-color: #00000096;
  display: flex;
  align-items: center;
  justify-content: center;
`;
const Wrapper = styled.div`
  width: 600px;
  height: 700px;
  background-color: #f9f9f9;
  color: ${({ theme }) => theme.text};
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 5px;
  position: relative;
  border-radius: 10px;
`;
const Close = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  cursor: pointer;
`;

const Title = styled.h1`
  text-align: center;
`;

const Input = styled.input`
  border: 1px solid ${({ theme }) => theme.textSoft};
  ${({ theme }) => theme.text};
  border-radius: 5px;
  padding: 10px;
  background-color: white;
  color: ${({ theme }) => theme.text};
`;

const Description = styled.textarea`
  border: 1px solid ${({ theme }) => theme.textSoft};
  color: ${({ theme }) => theme.text};
  border-radius: 5px;
  padding: 10px;
  background-color: white;
`;

const Button = styled.button`
  border-radius: 50px;
  padding: 10px;
  background-color: black;
  cursor: pointer;
  font-weight: 500;
  border: 1px solid ${({ theme }) => theme.textSoft};
  color: white;
`;

const Label = styled.label`
  font-size: 14px;
  margin-top: 15px;
  `;

const Form = styled.form`
  margin: 20px 0px;
`;

const Checkbox = styled.input`
`;

const Verify = styled.label`
  font-size: 14px;
  align-items: left;
`;

const Upload = ({ setOpen }) => {
  const [img, setImg] = useState(undefined);
  const [video, setVideo] = useState(undefined);
  const [imgPerc, setImgPerc] = useState(0);
  const [videoPerc, setVideoPerc] = useState(0);
  const [inputs, setInputs] = useState({});
  const [tags, setTags] = useState([]);
  const navigate = useNavigate();

  const handleTags = (e) => {
    setTags((prev) => e.target.value.split(","));
  };

  const handleChange = (e) => {
    setInputs((prev) => {
      return {
        ...prev,
        [e.target.name]: e.target.value,
      };
    });
  };

  const uploadFile = (file, fileType) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    // Listen for state changes, errors, and completion of the upload.
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        fileType === "imgUrl"
          ? setImgPerc(Math.round(progress))
          : setVideoPerc(Math.round(progress));
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
          setInputs((prev) => {
            return {
              ...prev,
              [fileType]: downloadURL,
            };
          });
        });
      }
    );
  };

  useEffect(() => {
    video && uploadFile(video, "videoUrl");
  }, [video]);

  useEffect(() => {
    img && uploadFile(img, "imgUrl");
  }, [img]);

  const handleUpload = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post(`/videos`, { ...inputs, tags },);
      Swal.fire(
        "Good job!",
        "Video has been uploaded successfully!",
        "success"
      );
      setOpen((prev) => false);
      navigate(`/`);
    } catch (error) {
      console.log(error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response.data.error || "Unable to upload video",
      });
    }
  };

  return (
    <Container>
      <Wrapper>
        <Close onClick={() => setOpen((prev) => false)}>X</Close>
        <Title>Upload a new video</Title>

          <Label><b>Video:</b></Label>
          <Input
            type="file"
            accept="video/*"
            onChange={(e) => setVideo((prev) => e.target.files[0])}
          />
          {videoPerc > 0 && "Uploading: " + videoPerc + "%"}

          <Label><b>Title:</b></Label>
          <Input
            type="text"
            placeholder="Title"
            name="title"
            onChange={handleChange}
          />

          <Label><b>Description:</b></Label>
          <Description
            placeholder="Description"
            rows={8}
            name="description"
            onChange={handleChange}
          ></Description>
        
          <Label><b>Tags:</b></Label>
          <Input
            type="text"
            placeholder="Seperate tags with commas"
            onChange={handleTags}
          />

          <Label><b>Image:</b></Label>
          <Input
            type="file"
            accept="image/*"
            onChange={(e) => setImg((prev) => e.target.files[0])}
          />
          {imgPerc > 0 && "Uploading: " + imgPerc + "%"}

          <Form>
          <Checkbox type="checkbox" required id="verify" value="Rating" />
          <Verify for="verify"> I verify that the video content is suitable for kids</Verify>
          </Form>

          <Button onClick={handleUpload}>Upload</Button>

      </Wrapper>
    </Container>
  );
};

export default Upload;
