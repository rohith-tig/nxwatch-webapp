import { useState, useEffect, useContext } from "react";
import ReactPlayer from "react-player";
import { formatDistanceToNow } from "date-fns";
import Cookies from "js-cookie";
import { useParams } from "react-router-dom";
import { ThreeDots } from "react-loader-spinner";
import NxtWatchContext from "../context/NxtWatchContext";
import { BiLike, BiDislike } from "react-icons/bi";
import { RiPlayListAddLine } from "react-icons/ri";
import Navbar from "../components/Navbar";
import { URL } from "../config/env";
import Sidebar from "../components/Sidebar";
import "../styles/Video.css";

interface VideoDataType {
  id: string;
  publishedAt: Date;
  thumbnail: string;
  title: string;
  views: string;
  name: string;
  profileImg: string;
  videoUrl: string;
  subscribers: String;
  description: string;
}

const apiStatusConstants = {
  initial: "INITIAL",
  success: "SUCCESS",
  failure: "FAILURE",
  inProgress: "IN_PROGRESS",
};

const VideoPlayer: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  console.log(id);
  const { darkMode, saveVideosFunc, savedVideosList } =
    useContext(NxtWatchContext);
  const HomeDarkBg = darkMode ? "home-dark-bg" : "home-light-bg";

  const [videoData, setvideoData] = useState<VideoDataType>();

  const [apiStatus, setapiStatus] = useState<string>(
    apiStatusConstants.initial
  );
  const [like, setLike] = useState<boolean>(false);
  const [disLike, setDisLke] = useState<boolean>(false);
  const VideoApiCall = async () => {
    setapiStatus(apiStatusConstants.inProgress);

    const jwtToken = Cookies.get("jwt_token");
    const url = `${URL}/video/${id}`;
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: "GET",
    };
    try {
      const response = await fetch(url, options);
      console.log(response);
      if (response.ok === true) {
        const data = await response.json();
        console.log(data);
        const videoInfo: VideoDataType = {
          id: data.video_details.id,
          publishedAt: new Date(data.video_details.published_at),
          thumbnail: data.video_details.thumbnail_url,
          title: data.video_details.title,
          views: data.video_details.view_count,
          name: data.video_details.channel.name,
          profileImg: data.video_details.channel.profile_image_url,
          videoUrl: data.video_details.video_url,
          subscribers: data.video_details.channel.subscriber_count,

          description: data.video_details.description,
        };
        console.log(videoInfo);
        setvideoData(videoInfo);
        setapiStatus(apiStatusConstants.success);
      } else {
        setapiStatus(apiStatusConstants.failure);
      }
    } catch (error) {
      console.log("home api:", error);
      setapiStatus(apiStatusConstants.failure);
    }
  };
  useEffect(() => {
    VideoApiCall();
  }, []);

  const renderLoadingView = () => (
    <div className="products-details-loader-container" data-testid="loader">
      <ThreeDots color="#0b69ff" height="50" width="50" />
    </div>
  );

  const renderSuccessView = () => {
    if (!videoData) return null;

    const onClickSave = () => {
      if (videoData) {
        saveVideosFunc(videoData);
      }
    };
    const likeFunc = () => {
      setLike((prevState) => !prevState);
      setDisLke(false);
    };
    const disLikeFunc = () => {
      setDisLke((prevState) => !prevState);
      setLike(false);
    };
    const mainPartBg = darkMode ? "main-dark-light-bg" : "main-part-light-bg";
    const titleColor = darkMode ? "dark-title" : null;
    const videoParaColor = darkMode ? "ib-hubs-dark" : "ib-hubs-light";
    const distance = formatDistanceToNow(videoData?.publishedAt);
    const isPresent = savedVideosList.find((item) => item.id === id);
    const saveCss = isPresent ? "like-css" : null;
    const likedCss = like ? "like-css" : null;
    const disLikedCss = disLike ? "dislike-css" : null;
    const likeBg = darkMode ? "darkLike" : "lightLike";
    const part = distance.split(" ");
    const num = part[1];
    console.log(num);
    return (
      <div className={`video-main-part ${mainPartBg}`}>
        <ReactPlayer width="100%" url={videoData?.videoUrl} />
        <div className="sm-devices-padding">
          <h1 className={`video-title ${titleColor}`}>{videoData?.title}</h1>
          <div className={`${videoParaColor} like-container`}>
            <div className="views">
              <p className="views-padding">{`${videoData?.views} views`}</p>
              <p className="listStyleType">{`${num} years ago`}</p>
            </div>
            <div className="likes">
              <button
                onClick={likeFunc}
                className={`${likeBg} ${likedCss}`}
                type="button"
              >
                <BiLike className="like-font-size" />
                Like
              </button>
              <button
                className={`${likeBg} ${disLikedCss}`}
                onClick={disLikeFunc}
                type="button"
              >
                <BiDislike className="like-font-size" />
                Dislike
              </button>
              <button
                onClick={onClickSave}
                className={`${likeBg} ${saveCss}`}
                type="button"
              >
                <RiPlayListAddLine className="like-font-size" />
                {isPresent ? "Saved" : "Save"}
              </button>
            </div>
          </div>
        </div>
        <hr className="horizontal" />
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <img
            alt="profile"
            className="video-profile"
            src={videoData?.profileImg}
          />
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <p className={`${titleColor}`} style={{ marginBottom: "-12px" }}>
              {videoData?.name}
            </p>
            <p className={`${videoParaColor}`} style={{ marginBottom: "-1px" }}>
              {videoData?.subscribers}
            </p>
          </div>
        </div>
        <p className={`video-title ${titleColor} sm-devices-padding`}>
          {videoData?.description}
        </p>
      </div>
    );
  };

  const renderVideoPage = () => {
    switch (apiStatus) {
      case apiStatusConstants.success:
        return renderSuccessView();

      case apiStatusConstants.inProgress:
        return renderLoadingView();
      default:
        return null;
    }
  };

  return (
    <>
      <div className={`${HomeDarkBg} video-item-arrangement`}>
        <Sidebar />
        <div className="video-nav-section">
          <Navbar />
          {renderVideoPage()}
        </div>
      </div>
    </>
  );
};

export default VideoPlayer;
