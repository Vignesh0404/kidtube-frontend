import { axiosInstance } from "../utils/axiosConfig";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { formatDistanceToNow } from "date-fns";

const Container = styled.div`
  display: flex;
  gap: 10px;
  margin: 30px 0px;
`;

const Avatar = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
`;

const Details = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  color: ${({ theme }) => theme.text};
`;
const Name = styled.span`
  font-size: 13px;
  font-weight: 500;
`;

const CommentDate = styled.span`
  font-size: 12px;
  font-weight: 400;
  color: ${({ theme }) => theme.textSoft};
  margin-left: 5px;
`;

const Text = styled.span`
  font-size: 14px;
`;

const Comment = ({ comment }) => {
  const [channel, setChannel] = useState({});

  useEffect(() => {
    const fetchComment = async () => {
      const res = await axiosInstance.get(`/users/${comment.userId}`); // find information on the user commenting
      setChannel(res.data.user)
    };
    fetchComment();
  }, [comment.userId]);

  return (
    <Container>
      { channel ?
          (<Avatar src={channel.img} alt="channel-img"/>)
          :
          (<Avatar src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png" alt="channel-img"/>)
      }
      <Details>
        <Name>
          {channel.name}  <CommentDate>{ comment && formatDistanceToNow(new Date(comment.createdAt), {
                addSuffix: true,
              })}</CommentDate>
        </Name>
        <Text>{comment.desc}</Text>
      </Details>
    </Container>
  );
};

export default Comment;