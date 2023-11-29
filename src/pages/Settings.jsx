import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { useSelector } from "react-redux";

const SettingsContainer = styled.div`
  max-width: 500px;
  margin: auto;
  margin-left: 0;
  padding: 2px;
  align-items: left;
  align-items: flex-start;
`;
const Break = styled.div`
  height: 100px;
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
  width: 100%;
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
  width: 100%;
  height: 100%;
  padding: 8px;
  border: 1px solid #ccc;
`;

// Define the Settings component
const Settings = () => {
  const { loggedInUser } = useSelector((state) => state.user);
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [profilePicture, setProfilePicture] = useState('');
  const [previewImage, setPreviewImage] = useState(null);
  const [pictureUploaded, setPictureUploaded] = useState(false);

  const fileInputRef = useRef(null);

  const handleSaveChanges = () => {
    // Implement logic to save changes (e.g., send data to the server)
    console.log('Changes saved!');
  };

  const handleFileChange = (e) => {
    if (pictureUploaded) {
      // Picture already uploaded, do nothing
      return;
    }

    const file = e.target.files[0];

    if (file) {
      setProfilePicture(file);
      setPreviewImage(URL.createObjectURL(file));
      setPictureUploaded(true);
    }
  };

  const handlePencilClick = () => {
    if (!pictureUploaded) {
      fileInputRef.current.click();
    }
  };

  const handleEditButtonClick = () => {
    // Clear the profile picture when edit is clicked
    setProfilePicture('');
    setPreviewImage(null);
    setPictureUploaded(false);
  };

  return (
    <SettingsContainer>
      <SectionTitle>Account Settings</SectionTitle>
      <FormGroup>
        <Label><b>Profile Picture:</b></Label>
        <FileInput
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
        )}
      </FormGroup>

      <FormGroup>
        <Label><b>Email address:</b><p>{loggedInUser?.email}</p></Label>
      </FormGroup>

      <FormGroup>
        <Label><b>Name:</b></Label>
        <Input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="name"
        />
      </FormGroup>

      <FormGroup>
        <Label><b>Password:</b></Label>
        <Input
          type="text"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="password"
        />
      </FormGroup>

      <Button onClick={handleSaveChanges}><SaveAltIcon/>Save Changes</Button>

      <Break></Break>
      
      <SectionTitle>Add New Child</SectionTitle>
      <FormGroup>
        <Label><b>Name:</b></Label>
        <Input
          type="text"
          placeholder="child name"
        />
      </FormGroup>
      <FormGroup>
        <Label><b>Birthday:</b></Label>
        <Input
          type="text"
          placeholder="MM/DD/YYYY"
        />
      </FormGroup>
      <Button><AddCircleOutlineIcon/>Add Child</Button>

      <Break></Break>
      
      <SectionTitle>Child Users</SectionTitle>
      {/* script to fetch child names from logged in user, else display "no child users found" */}
      <Item>
        <DeleteForeverIcon alt="Delete"></DeleteForeverIcon>
        Anna
      </Item>
      <Item>
        <DeleteForeverIcon alt="Delete"></DeleteForeverIcon>
        Mikhael
      </Item>

    </SettingsContainer>

  );
};

export { Settings };