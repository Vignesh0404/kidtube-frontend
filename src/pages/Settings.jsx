import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import DoneIcon from '@mui/icons-material/Done';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { useDispatch, useSelector } from "react-redux";
import { updateError, updateStart, updateSuccess } from "../redux/userSlice";
import { Link, useNavigate } from "react-router-dom";
import UploadPic from "../components/UploadPic";
import { axiosInstance } from "../utils/axiosConfig";
import Swal from "sweetalert2";
import Loader from "../components/Loader";

const SettingsContainer = styled.div`
  max-width: 500px;
  margin: auto;
  margin-left: 0;
  padding: 2px;
  align-items: left;
  align-items: flex-start;
`;
const Break = styled.div`
  height: 50px;
`;

const Wrapper = styled.div`
  width: 100%;
  padding: 25px;
  background-color: white;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: #f9f9f9;
`;


const SectionTitle = styled.h2`
  margin-bottom: 36px;
`;

const FormGroup = styled.div`
  margin-bottom: 32px;
  align-items: left;
  justify-content: left;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
`;

const Input = styled.input`
  width: 475px;
  height: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const FileInput = styled.input`
  display: none;
`;

const CircleIcon = styled.label`
  display: inline-block;
  width: 50px;
  height: 50px;
  background-color: black;
  color: white;
  border: 1px solid black;
  border-radius: 50px;
  cursor: pointer;
  text-align: center;
  line-height: 50px; /* Center text vertically */
  transition: background-color 0.3s ease;

  input {
    display: none;
  }

  &:hover {
    background-color: white;
    color: black;
  }
`;

const Button = styled.button`
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 500;  
  padding: 10px 15px;
  background-color: black;
  color: #fff;
  border: none;
  border-radius: 40px;
  cursor: pointer;
`;

const ChildButton = styled.button`
  display: flex;
  align-items: center;
  padding: 5px 10px;
  background-color: black;
  color: #fff;
  border: none;
  border-radius: 25px;
  cursor: pointer;
`;

const ImagePreview = styled.img`
  width: 100px;
  max-height: 100px;
  margin-top: 10px;
  border-radius: 500px;
  border: 1px solid black;
`;

const Item = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  border-radius: 8px;
  margin-bottom: 15px;
  width: 475px;
  height: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  background-color: white;
`;

// Define the Settings component
const Settings = () => {
  const { loggedInUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [imgUrl, setImgUrl] = useState("");
  const [img, setImg] = useState(undefined);
  const [imgPerc, setImgPerc] = useState(0);
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.user);
  // const [name, setName] = useState('');
  // const [password, setPassword] = useState('');
  // const [profilePicture, setProfilePicture] = useState('');
  // const [previewImage, setPreviewImage] = useState(null);
  // const [pictureUploaded, setPictureUploaded] = useState(false);

  // const fileInputRef = useRef(null);

  // const handleSaveChanges = () => {
  //   // Implement logic to save changes (e.g., send data to the server)
  //   console.log('Changes saved!');
  // };

  // const handleFileChange = (e) => {
  //   if (pictureUploaded) {
  //     // Picture already uploaded, do nothing
  //     return;
  //   }

  //   const file = e.target.files[0];

  //   if (file) {
  //     setProfilePicture(file);
  //     setPreviewImage(URL.createObjectURL(file));
  //     setPictureUploaded(true);
  //   }
  // };

  // const handlePencilClick = () => {
  //   if (!pictureUploaded) {
  //     fileInputRef.current.click();
  //   }
  // };

  // const handleEditButtonClick = () => {
  //   // Clear the profile picture when edit is clicked
  //   setProfilePicture('');
  //   setPreviewImage(null);
  //   setPictureUploaded(false);
  // };
  
  const handleUpdate = async (e) => {
    e.preventDefault();
    if (
      name.length === 0 ||
      password.length === 0 ||
      !img
    ) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Please provide name, password & profile image to update account",
      });
    }
    dispatch(updateStart());
    try {
      const res = await axiosInstance.put(`/users/${loggedInUser?._id}`, {
        name,
        password,
        img: imgUrl,
      });
      dispatch(updateSuccess(res.data.user));
      Swal.fire(
        "Profile Update Successful!",
        "Please login with updated credentials",
        "success"
      );
    } catch (error) {
      console.log(error);
      dispatch(updateError());
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response.data.error || "Please fill in missing fields",
      });
    }
  };

  return (
    <SettingsContainer>
      <Wrapper>
        <SectionTitle>Account Settings</SectionTitle>

        <FormGroup>
          <Label><b>Email address:</b><p>{loggedInUser?.email}</p></Label>
        </FormGroup>

        <FormGroup>
          <Label><b>Profile Picture:</b></Label>
          <UploadPic
            img={img}
            setImg={setImg}
            imgPerc={imgPerc}
            setImgUrl={setImgUrl}
            setImgPerc={setImgPerc}
          />
          {/* <FileInput
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            ref={fileInputRef}
            id="profilePictureInput"
            disabled={pictureUploaded}
          />
          {previewImage ? (
            <>
              <ImagePreview src={previewImage} alt="Profile Preview" />
              <CircleIcon htmlFor="profilePictureInput" role="img" aria-label="pencil icon" onClick={handleEditButtonClick}>
                ✏️
              </CircleIcon>
            </>
          ) : (
            <CircleIcon htmlFor="profilePictureInput" role="img" aria-label="pencil icon" onClick={handlePencilClick}>
              ✏️
            </CircleIcon>
          )} */}
        </FormGroup>

        <FormGroup>
          <Label><b>Name:</b></Label>
          <Input
            type="text"
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
          />
        </FormGroup>

        <FormGroup>
          <Label><b>Password:</b></Label>
          <Input
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
          />
        </FormGroup>

        <Button onClick={handleUpdate}><DoneIcon/>Update Profile</Button>
      </Wrapper>

      <Break></Break>
      
      <Wrapper>
        <SectionTitle>Add New Child</SectionTitle>
        <FormGroup>
          <Label><b>Name:</b></Label>
          <Input
            type="text"
            placeholder="Child's Name"
          />
        </FormGroup>
        <FormGroup>
          <Label><b>Birthday:</b></Label>
          <Input
            type="date"
          />
        </FormGroup>
        <Button><AddCircleOutlineIcon/>Add Child</Button>
      </Wrapper>

      <Break></Break>
      <Wrapper>  
        <SectionTitle>Child Users</SectionTitle>
        {/* script to fetch child names from logged in user, else display "no child users found" */}
        <Item>
          <ChildButton><DeleteForeverIcon alt="Delete"></DeleteForeverIcon></ChildButton>
          Anna
        </Item>
        <Item>
          <ChildButton><DeleteForeverIcon alt="Delete"></DeleteForeverIcon></ChildButton>
          Mikhael
        </Item>
      </Wrapper>

    </SettingsContainer>

  );
};

export { Settings };