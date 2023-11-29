import React, { useEffect, useState } from "react";
import styled from "styled-components";
import ThumbUpOutlinedIcon from "@mui/icons-material/ThumbUpOutlined";
import ThumbDownOffAltOutlinedIcon from "@mui/icons-material/ThumbDownOffAltOutlined";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import AddTaskOutlinedIcon from "@mui/icons-material/AddTaskOutlined";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  dislike,
  fetchVideoError,
  fetchVideoStart,
  fetchVideoSuccess,
  like,
} from "../redux/videoSlice";
import { formatDistanceToNow } from "date-fns";
import { subscription } from "../redux/userSlice";
import Recommendations from "../components/Recommendations";
import { axiosInstance } from "../utils/axiosConfig";
import Swal from "sweetalert2";
import Loader from "../components/Loader";
import Comments from "../components/Comments";

const Container = styled.div`
  display: flex;
  gap: 24px;
`;

const Content = styled.div`
  flex: 7;
`;

const VideoWrapper = styled.div`
  background-color: transparent;
`;

const Title = styled.h1`
  font-size: 18px;
  font-weight: 400;
  margin-top: 20px;
  margin-bottom: 10px;
  color: ${({ theme }) => theme.text};
`;

const Details = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Info = styled.span`
  color: ${({ theme }) => theme.textSoft};
`;

const Buttons = styled.div`
  display: flex;
  gap: 20px;
  color: ${({ theme }) => theme.text};
`;

const Button = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  cursor: pointer;
`;

const Hr = styled.hr`
  margin: 15px 0px;
  border: 0.5px solid ${({ theme }) => theme.softHr};
`;

const Channel = styled.div`
  display: flex;
  justify-content: space-between;
`;

const ChannelInfo = styled.div`
  display: flex;
  gap: 20px;
`;

const ChannelImg = styled.img`
  width: 65px;
  height: 65px;
  border-radius: 50%;
  background-color: #999;
`;

const ChannelDetail = styled.div`
  flex: 11;
  display: flex;
  flex-direction: column;
  color: ${({ theme }) => theme.text};
`;

const ChannelName = styled.span`
  font-weight: 500;
`;

const ChannelCounter = styled.span`
  font-size: 14px;
  margin-top: 5px;
  margin-bottom: 15px;
  color: ${({ theme }) => theme.textSoft};
`;

const VideoDescription = styled.p`
  font-size: 14px;
`;

const SubscribeButton = styled.button`
  background-color: ${(props) =>
    props.isSub ? "#FFDCD2" : "#FFA096"};
  font-weight: 500;
  font-size: 13px;
  color: ${(props) =>
    props.isSub ? "#283246" : "white"};
  height: max-content;
  width: max-content;
  border: none;
  border-radius: 50px;
  padding: 10px 20px;
  cursor: pointer;
`;

const Badge = styled.button`
  margin-left: 5px;
  margin-right:5px;
  align-items: center;
  border: none;
  height: 25px;
  width: 25px;
  border-radius: 50%;
  background-color: green;
  color: white;
  gap: 5px;
`;

const Video = () => {
  const dispatch = useDispatch();
  const videoId = useLocation().pathname.split("/")[2];
  const { currentVideo, loading } = useSelector((state) => state.video);
  const { loggedInUser } = useSelector((state) => state.user);
  const [channel, setChannel] = useState({});
  const { videos } = useSelector((state) => state.videos);

  const handleCopyToClipboard = () => {
    const videoUrl = window.location.href;

    navigator.clipboard.writeText(videoUrl).then(
      () => {
        Swal.fire({
          icon: 'success',
          title: 'URL Copied to Clipboard!',
          showConfirmButton: false,
          timer: 1500,
        });
      },
      (err) => {
        console.error('Unable to copy to clipboard', err);
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Failed to copy URL to clipboard',
        });
      }
    );
  };

  useEffect(() => {
    const addView = async () => {
      try {
        await axiosInstance.put(`/videos/view/${videoId}`);
      } catch (error) {
        console.log(error);
      }
    };

    const fetchVideo = async () => {
      dispatch(fetchVideoStart());
      try {
        let videoIndex = videos.findIndex((video) => video._id === videoId);
        if (videoIndex !== -1) {
          let video = videos[videoIndex];
          dispatch(fetchVideoSuccess(video));
          addView();
        } else {
          dispatch(fetchVideoSuccess(null));
        }
      } catch (error) {
        dispatch(fetchVideoError());
        console.log(error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text:
            error.response.data.error || "Error occured while fetching video",
        });
      }
    };

    fetchVideo();
  }, [dispatch, videoId, videos]);

  useEffect(() => {
    const fetchChannel = async () => {
      try {
        const res = await axiosInstance.get(`/users/${currentVideo?.userId}`);
        setChannel((prev) => res.data.user);
      } catch (error) {
        console.log(error);
      }
    };

    if (currentVideo) {
      fetchChannel();
    }
  }, [currentVideo]);

  const handleLike = async () => {
    if (!loggedInUser) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Sign In required!",
      });
      return;
    }
    try {
      await axiosInstance.put(`/users/like/${currentVideo?._id}`);
      dispatch(like(loggedInUser?._id));
    } catch (error) {
      console.log(error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text:
          error.response.data.error ||
          "Error occured while handling likes of the video",
      });
    }
  };

  const handleDislike = async () => {
    if (!loggedInUser) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Sign In required!",
      });
      return;
    }
    try {
      await axiosInstance.put(`/users/dislike/${currentVideo?._id}`);
      dispatch(dislike(loggedInUser?._id));
    } catch (error) {
      console.log(error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text:
          error.response.data.error ||
          "Error occured while handling dislikes of the video",
      });
    }
  };

  const handleSubscription = async () => {
    if (!loggedInUser) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Sign In required!",
      });
      return;
    }
    try {
      loggedInUser.subscribedUsers.includes(channel?._id)
        ? await axiosInstance.put(`/users/unsub/${channel?._id}`)
        : await axiosInstance.put(`/users/sub/${channel?._id}`);
      dispatch(subscription(channel?._id));
    } catch (error) {
      console.log(error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text:
          error.response.data.error ||
          "Error occured while handling subscriptions of the user",
      });
    }
  };

  if (loading || !currentVideo) {
    return <Loader />;
  }

  return (
    <Container>
      <Content>
      <VideoWrapper>
        <iframe 
          allowtransparency="true"
          width="100%"
          height="720" 
          src={currentVideo?.videoUrl}
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          ></iframe>
        </VideoWrapper>
        <Title>{currentVideo && currentVideo.title}</Title>
        <Details>
          <Info>
          Rated <Badge>G</Badge> •{" "}
            {currentVideo && currentVideo.views + 1} views •{" "}
            {currentVideo &&
              formatDistanceToNow(new Date(currentVideo.createdAt), {
                addSuffix: true,
              })}
          </Info>
          <Buttons>
            <Button onClick={handleLike}>
              {currentVideo &&
              currentVideo.likes?.includes(loggedInUser?._id) ? (
                <ThumbUpIcon />
              ) : (
                <ThumbUpOutlinedIcon />
              )}{" "}
              {currentVideo && currentVideo.likes?.length}
            </Button>
            <Button onClick={handleDislike}>
              {currentVideo &&
              currentVideo.dislikes?.includes(loggedInUser?._id) ? (
                <ThumbDownIcon />
              ) : (
                <ThumbDownOffAltOutlinedIcon />
              )}
              Dislike
            </Button>
            <div>
              <Button onClick={handleCopyToClipboard}>
                <ShareOutlinedIcon /> Share
              </Button>
            </div>
            {/* <Button>
              <AddTaskOutlinedIcon /> Save
            </Button> */}
          </Buttons>
        </Details>
        <Hr />
        <Channel>
          <ChannelInfo>
            <ChannelImg src={channel?.img} alt="channel-img" />
            <ChannelDetail>
              <ChannelName>{channel?.name}</ChannelName>
              <ChannelCounter>
                Favorited by {channel?.subscribers} users
              </ChannelCounter>
              <VideoDescription>
                {currentVideo && currentVideo.description}
              </VideoDescription>
            </ChannelDetail>
          </ChannelInfo>
          <SubscribeButton
            onClick={handleSubscription}
            isSub={
              loggedInUser &&
              loggedInUser.subscribedUsers?.includes(channel?._id)
                ? true
                : false
            }
          >
            {loggedInUser &&
            loggedInUser.subscribedUsers?.includes(channel?._id)
              ? "REMOVE FROM FAVORITES"
              : "ADD TO FAVORITES"}
          </SubscribeButton>
        </Channel>
        <Hr />
        <Comments videoId={currentVideo._id} />
      </Content>
      {/* {currentVideo && <Recommendations tags={currentVideo.tags} />} */}
    </Container>
  );
};

export default Video;