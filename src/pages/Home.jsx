import React from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import Card from "../components/Card";
import { axiosInstance } from "../utils/axiosConfig";
import Swal from "sweetalert2";
import {
  fetchVideosError,
  fetchVideosStart,
  fetchVideosSuccess,
} from "../redux/videosSlice";
import Loader from "../components/Loader";

const Container = styled.div`
  display: flex;
  ${'' /* justify-content: space-between; */}
  flex-wrap: wrap;
  overflow-x: auto;
  gap: 50px;
  padding: 10px;
`;

const Home = ({ type }) => {
  const dispatch = useDispatch();
  const { videos, loading } = useSelector((state) => state.videos);

  useEffect(() => {
    const fetchVideos = async () => {
      dispatch(fetchVideosStart());
      try {
        const res = await axiosInstance.get(`/videos/${type}`);
        dispatch(fetchVideosSuccess(res.data.videos));
      } catch (error) {
        console.log(error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: error.response.data.error || "Error fetching videos",
        });
        dispatch(fetchVideosError());
      }
    };

    fetchVideos();
  }, [dispatch, type]);

  if (loading) {
    return <Loader />;
  }

  return (
    <Container>
      {videos.length > 0 &&
        videos.map((video) => <Card key={video._id} video={video} />)}
    </Container>
  );
};

export default Home;
