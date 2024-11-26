import { useContext, useState, useEffect, ChangeEventHandler } from "react";
import NxtWatchContext from "../context/NxtWatchContext";
import Cookies from "js-cookie";
import { FaSearch } from "react-icons/fa";
import { formatDistanceToNow } from "date-fns";
import { Link } from "react-router-dom";
import { ThreeDots } from "react-loader-spinner";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import "../styles/Home.css";
import { URL } from "../config/env";
import { url } from "inspector";

const apiStatusConstants = {
  initial: "INITIAL",
  success: "SUCCESS",
  failure: "FAILURE",
  inProgress: "IN_PROGRESS",
};
interface homeData {
  id: string;
  publishedAt: Date;
  thumbnail: string;
  title: string;
  views: string;
  name: string;
  profileImg: string;
}

interface rawData {
  id: string;
  published_at: string;
  thumbnail_url: string;
  title: string;
  view_count: string;
  channel: {
    name: string;
    profile_image_url: string;
  };
}

const Home = () => {
  const { darkMode, closePremium, premiumDisplay } =
    useContext(NxtWatchContext);
  const HomeDarkBg = darkMode ? "home-dark-bg" : "home-light-bg";
  const isClicked = premiumDisplay ? "flex-row" : "show-none";

  const [homeData, setHomeData] = useState<homeData[]>([]);
  const [searched, setSearched] = useState<string>("");
  const [apiStatus, setapiStatus] = useState<string>(
    apiStatusConstants.initial
  );
  console.log("url", URL);
  const HomeApiCall = async () => {
    setapiStatus(apiStatusConstants.inProgress);

    const jwtToken = Cookies.get("jwt_token");

    const url = `${URL}/home?searched=${encodeURIComponent(searched)}`;
    const options = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${jwtToken}`,
        "Content-Type": "application/json",
      },
    };
    try {
      const response = await fetch(url, options);
      console.log(response);
      if (response.ok === true) {
        const data = await response.json();
        console.log(data);
        const videoInfo = data.videos.map((item: rawData) => ({
          id: item.id,
          publishedAt: new Date(item.published_at),
          thumbnail: item.thumbnail_url,
          title: item.title,
          views: item.view_count,
          name: item.channel.name,
          profileImg: item.channel.profile_image_url,
        }));
        setHomeData(videoInfo);
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
    HomeApiCall();
  }, []);

  const searchCapture: ChangeEventHandler<HTMLInputElement> = (event) => {
    setSearched(event.target?.value);
  };

  const searchFunc: () => void = () => {
    HomeApiCall();
  };

  const retryFunc = () => {
    HomeApiCall();
  };

  const renderSuccessView = () => {
    const zeroListLength = homeData.length === 0;
    const mainPartBg = darkMode ? "main-dark-light-bg" : "main-part-light-bg";
    const videoParaColor = darkMode ? "ib-hubs-dark" : "ib-hubs-light";
    const titleColor = darkMode ? "dark-title" : null;
    return (
      <div className={`main-part ${mainPartBg}`}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginTop: "22px",
            marginLeft: "30px",
            marginBottom: "5px",
          }}
        >
          <input
            onChange={searchCapture}
            placeholder="search"
            value={searched}
            className={
              darkMode ? "input-css dark-input" : "input-css light-input"
            }
            type="search"
          />
          <button
            className={
              darkMode ? "search-btn dark-search-button" : "search-btn"
            }
            aria-label="search"
            type="button"
            onClick={searchFunc}
          >
            <FaSearch />
          </button>
        </div>

        {zeroListLength ? (
          <div className="random-search">
            <img
              src="https://assets.ccbp.in/frontend/react-js/nxt-watch-no-search-results-img.png"
              alt="no-search-results-img"
              className="no-search-img"
            />
            <h1 className={darkMode ? "no-search-dark" : "no-search-light"}>
              No Search results found
            </h1>
            <p className={darkMode ? "no-search-dark" : "no-search-light"}>
              Try different Key words or remove search filter
            </p>
            <button
              className={darkMode ? "retry-dark " : "retry-light "}
              type="button"
              onClick={retryFunc}
            >
              Retry
            </button>
          </div>
        ) : (
          <ul className="ul-divs">
            {homeData.map((video) => {
              const distance = formatDistanceToNow(video.publishedAt);
              const part = distance.split(" ");
              const num = part[1];
              const namePart = video.title.slice(0, 28);
              return (
                <li className="list-container" key={video.id}>
                  <Link to={`/videos/${video.id}`} className="link-decoration">
                    <img
                      alt="thumbnail"
                      className="thumbnail"
                      src={video.thumbnail}
                    />
                    <div className="video-details">
                      <img
                        alt="profile"
                        className="profile"
                        src={video.profileImg}
                      />
                      <div className="video-flex-para">
                        <p className={`title sm-display ${titleColor}`}>
                          {video.title}
                        </p>
                        <p
                          className={`title lg-display ${titleColor}`}
                        >{`${namePart}.....`}</p>
                        <p className={`title name ${videoParaColor}`}>
                          {video.name}
                        </p>
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "row",
                          }}
                        >
                          <p
                            className={`title name ${videoParaColor}`}
                          >{`${video.views} views`}</p>
                          <p className={`title name li-st ${videoParaColor}`}>
                            {`${num} years ago`}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    );
  };

  const renderLoadingView = () => (
    <div className="products-details-loader-container" data-testid="loader">
      <ThreeDots color="#0b69ff" height="50" width="50" />
    </div>
  );

  const renderFailureView = () => (
    <>
      <div className="main-part random-search">
        <img
          className="no-search-img"
          alt="failure"
          src="https://assets.ccbp.in/frontend/react-js/nxt-watch-failure-view-light-theme-img.png"
        />
        <h1>Oops!Something Went Wrong</h1>
        <p>
          We are having some trouble to complete your request.Please try again
        </p>
        <button type="button">Retry</button>
      </div>
    </>
  );

  const renderNxtWatchPage = () => {
    switch (apiStatus) {
      case apiStatusConstants.success:
        return renderSuccessView();
      case apiStatusConstants.failure:
        return renderFailureView();
      case apiStatusConstants.inProgress:
        return renderLoadingView();
      default:
        return null;
    }
  };

  return (
    <div className={`home-item-arrangement ${HomeDarkBg}`}>
      <Sidebar />

      <div className="home-nav-section">
        <Navbar />
        <div className={`${isClicked}`}>
          <div className="banner">
            <img
              height="40px"
              width="150px"
              src="https://assets.ccbp.in/frontend/react-js/nxt-watch-logo-light-theme-img.png"
              alt="website logo"
            />
            <p>Buy Nxt Watch Premium prepaid plains with upi</p>
            <button type="button" className="get">
              GET IT NOW
            </button>
          </div>
          <div className="x">
            <button onClick={closePremium} className="btnn" type="button">
              X
            </button>
          </div>
        </div>
        {renderNxtWatchPage()}
      </div>
    </div>
  );
};

export default Home;
