import React, { useState } from "react";
import styled from "styled-components";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import VideoCallOutlinedIcon from "@mui/icons-material/VideoCallOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Upload from "./Upload";
import UserMenu from "./UserMenu";

const Container = styled.div`
  position: sticky;
  top: 0;
  background-color: #FF8E26;
  height: 56px;
`;
const Wrapper = styled.div`
  display: flex;
  align-items: center;
  height: 100%;
  padding: 0 20px;
  justify-content: flex-end;
  position: relative;
`;
// const Search = styled.div`
const SearchForm = styled.form`
  position: absolute;
  width: 40%;
  left: 0;
  right: 0;
  margin: auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 5px;
  border: 10px solid #00000;
  border-radius: 30px;
  color: black;
  background: white;
  flex: 1;
  padding: 6px;
  border: 1px solid #ccc;
  border-radius: 40px;
  font-size: 14px;
  outline: none;
  padding-left: 20px;
  padding-right: 10px;
`;
const Input = styled.input`
  border: none;
  outline: none;
  width: 100%;
  background-color: white;
  font-weight: 300;
  font-size: 1rem;
  color: black;
`;

const Button = styled.button`
  padding: 5px 15px;
  background-color: fffff;
  border: none;
  color: white;
  display: flex;
  border-radius: 50px; 
  align-items: center;
  gap: 5px;
  cursor: pointer;
  font-weight: 500;
  background: black;
`;

const NavItems = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  color: black;
  cursor: pointer;
`;

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { loggedInUser } = useSelector((state) => state.user);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    navigate(`/search?q=${searchQuery}`);
  };

  return (
    <>
      <Container>
        <Wrapper>
        <SearchForm onSubmit={handleSearchSubmit}>
          <label htmlFor="searchInput"> </label>
            <Input
              type="text"
              placeholder="Search"
              id="searchInput"
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <SearchOutlinedIcon type="submit" 
              onClick={(e) => navigate(`/search?q=${searchQuery}`)}
            ></SearchOutlinedIcon>
          </SearchForm>
          {loggedInUser ? (
            <NavItems>
              <VideoCallOutlinedIcon
                onClick={() => setOpen((prev) => true)}
              ></VideoCallOutlinedIcon>
              {/* <NotificationsOutlinedIcon /> */}
              <UserMenu loggedInUser={loggedInUser} />
            </NavItems>
          ) : (
            <Link
              to="signin"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <Button>
                <AccountCircleOutlinedIcon />
                SIGN IN
              </Button>
            </Link>
          )}
        </Wrapper>
      </Container>
      {open && <Upload setOpen={setOpen} />}
    </>
  );
};

export default Navbar;
