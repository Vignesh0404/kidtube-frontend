import { axiosInstance } from "../utils/axiosConfig";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import Comment from "./Comment";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { commenting } from "../redux/videoSlice";

const Container = styled.div``;

const NewComment = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const Avatar = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
`;

const Input = styled.input`
  border: none;
  border-bottom: 1px solid ${({ theme }) => theme.soft};
  color: ${({ theme }) => theme.text};
  background-color: transparent;
  outline: none;
  padding: 5px;
  width: 100%;
`;

const Button = styled.button`
  padding: 7px 15px;
  background-color: transparent;
  border: 1px solid black;
  color: white;
  display: flex;
  align-items: center;
  gap: 5px;
  cursor: pointer;
  border-radius: 20px;
  font-weight: 500;
  background: black
`;

const Comments = ({videoId}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loggedInUser } = useSelector((state) => state.user)
  const [comments, setComments] = useState([]);
  const [desc, setDesc] = useState({}); // user's comment
  const { currentVideo, loading } = useSelector((state) => state.video);

  const navigateToSignin = () => {
    navigate('/signin');
  };

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await axiosInstance.get(`/comments/${videoId}`); // fetch all comments of a video
        setComments(res.data);
      } catch (err) {}
    };
    fetchComments();
  }, [videoId]);

  const handleComment = async (e) => {
    e.preventDefault();
    if (desc.length === 0)
      {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Comment not found!",
        });
        return;
      }
    try {
      await axiosInstance.post(`/comments`, { desc, videoId });
      dispatch(commenting(loggedInUser?._id));
      Swal.fire(
        "Good job!",
        "Comment added!",
        "success"
      );
      // window.location.reload();
      navigate(`/`);
    } catch (error) {
      console.log(error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Unable to add comment",
      });
    }
  };

  return (
    <Container>
      <NewComment>
        { loggedInUser ?
          (<Avatar src={loggedInUser.img} alt="channel-img"/>)
          :
          (<Avatar src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png" alt="channel-img"/>)
        }
        <Input type="text" 
          placeholder="Add a comment..." 
          onChange={(e) => setDesc(e.target.value)}/>
        {loggedInUser ? 
          (<Button onClick={handleComment}>Comment</Button>) // TODO: post comment if user is loggedin
          :
          (<Button onClick={navigateToSignin}>Comment</Button>)
        }
      </NewComment>
      {comments.map(comment=>(
        <Comment key={comment._id} comment={comment}/>
      ))}
    </Container>
  );
};

export default Comments;