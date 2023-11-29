import React from "react";
import styled from "styled-components";
import ytLogo from "../img/icon.png";
import HomeIcon from "@mui/icons-material/Home";
import ExploreOutlinedIcon from "@mui/icons-material/ExploreOutlined";
import SubscriptionsOutlinedIcon from "@mui/icons-material/SubscriptionsOutlined";
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import VideoLibraryOutlinedIcon from "@mui/icons-material/VideoLibraryOutlined";
import HistoryOutlinedIcon from "@mui/icons-material/HistoryOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import SettingsBrightnessOutlinedIcon from "@mui/icons-material/SettingsBrightnessOutlined";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const Container = styled.div`
  flex: 1.4;
  background-color: white;
  height: 100vh;
  color: black;
  font-size: 14px;
  overflow-y: scroll;
  overflow-x: hidden;
  position: sticky;
  top: 0;
`;

const Wrapper = styled.div`
  /* padding: 1.2rem 2rem; */
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 700;
  font-size: 17px;
  margin-bottom: 20px;
  padding-left: 2rem;
  padding-bottom: 0;
  color: white;
  background-color: #FF8E26;
  height: 56px;
  alt: "logo"
`;

const Item = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  cursor: pointer;
  padding: 0.5rem 2rem;
  border-radius: 8px;

  &:hover {
    background-color: #FF8E26;
    color: white;
    margin: 0 0.5rem;
  }
`;

const Img = styled.img`
  height: 25px;
`;

const Hr = styled.hr`
  margin: 1rem 0;
  border: 5px black};
`;

const Login = styled.div`
  font-size: 12px;
  padding: 0.8rem 2rem;
`;

const Button = styled.button`
  padding: 5px 15px;
  background-color: black;
  border: 1px solid #3ea6ff;
  color: #3ea6ff;
  display: flex;
  align-items: center;
  gap: 5px;
  cursor: pointer;
  border-radius: 3px;
  font-weight: 500;
  margin-top: 10px;
`;

const Sidebar = ({ darkMode, setDarkMode }) => {
  const { loggedInUser } = useSelector((state) => state.user);
  return (
    <Container>
      <Wrapper>
        <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
          <Logo>
            <Img src={ytLogo} alt="KidTube Logo"/>
            KidTube
          </Logo>
        </Link>
        <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
          <Item>
            <HomeIcon />
            Home
          </Item>
        </Link>
        <Link
          to="/trending"
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <Item>
            <ExploreOutlinedIcon />
            Explore
          </Item>
        </Link>

        <Link
          to="/subscriptions"
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <Item>
            <FavoriteBorderIcon />
            Favorites
          </Item>
        </Link>
        {/* <Hr /> */}
        {/* <Item>
          <VideoLibraryOutlinedIcon />
          Library
        </Item>
        <Item>
          <HistoryOutlinedIcon />
          History
        </Item> */}
        
        <Link
          to="/settings"
          style={{ textDecoration: "none", color: "inherit" }}>
          <Item>
            <SettingsOutlinedIcon />
            Settings
          </Item>
        </Link>
        {/* <Item onClick={(e) => setDarkMode((prev) => !prev)}>
          <SettingsBrightnessOutlinedIcon />
          {darkMode ? "Light" : "Dark"} Mode
        </Item> */}
      </Wrapper>
    </Container>
  );
};

export default Sidebar;
