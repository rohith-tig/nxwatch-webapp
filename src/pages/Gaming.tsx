import Cookies from "js-cookie";
import { useContext, useState, useEffect } from "react";
import { GiConsoleController } from "react-icons/gi";
import { ThreeDots } from "react-loader-spinner";
import { Link } from "react-router-dom";
import NxtWatchContext from "../context/NxtWatchContext";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import "../styles/Gaming.css";
import { URL } from "../config/env";
const apiStatusConstants = {
  initial: "INITIAL",
  success: "SUCCESS",
  failure: "FAILURE",
  inProgress: "IN_PROGRESS",
};
interface gamingData {
  id: string;

  thumbnail: string;
  title: string;
  views: string;
}

interface rawData {
  id: string;

  thumbnail_url: string;
  title: string;
  view_count: string;
}

const Gaming = () => {
  const { darkMode, closePremium, premiumDisplay } =
    useContext(NxtWatchContext);
  const HomeDarkBg = darkMode ? "home-dark-bg" : "home-light-bg";
  const isClicked = premiumDisplay ? "flex-row" : "show-none";
  const mainPartBg = darkMode ? "main-dark-light-bg" : "main-part-light-bg";
  const videoParaColor = darkMode ? "ib-hubs-dark" : "ib-hubs-light";
  const titleColor = darkMode ? "dark-title" : null;
  const trendingBg = darkMode ? "trending-dark-css" : "trending-light";
  const fireBg = darkMode ? "fire-dark-bg" : null;

  const [gamingData, setGamingData] = useState<gamingData[]>([]);

  const [apiStatus, setapiStatus] = useState<string>(
    apiStatusConstants.initial
  );
  const gameApiCall = async () => {
    setapiStatus(apiStatusConstants.inProgress);

    const jwtToken = Cookies.get("jwt_token");
    const url = `${URL}/gaming`;
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
        const videoInfo = data.videos.map((item: rawData) => ({
          id: item.id,

          thumbnail: item.thumbnail_url,
          title: item.title,
          views: item.view_count,
        }));
        setGamingData(videoInfo);
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
    gameApiCall();
  }, []);

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

  const renderSuccessView = () => {
    return (
      <div className={`game-main-part ${mainPartBg}`}>
        <ul className="gaming-ul-divs">
          {gamingData.map((video) => (
            <li className="gaming-list-container" key={video.id}>
              <Link to={`/videos/${video.id}`} className="link-decoration">
                <img
                  alt="thumbnail"
                  className="gaming-thumbnail"
                  src={video.thumbnail}
                />
                <div className="videod">
                  <div className="gaming-video-flex-para">
                    <p className={`title ${titleColor}`}>{video.title}</p>

                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      <p
                        className={`title name ${videoParaColor}`}
                      >{`${video.views} views`}</p>
                      <p className={`title name ${videoParaColor}`}>
                        Worldwide
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    );
  };

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
    <div className={`game-item-arrangement ${HomeDarkBg}`}>
      <Sidebar />

      <div className="game-nav-section">
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
        <div className={`trending-light-css ${trendingBg}`}>
          <GiConsoleController className={`fire-light-css ${fireBg}`} />
          <h1>Gaming</h1>
        </div>
        {renderNxtWatchPage()}

        {/* ul div */}
      </div>
    </div>
  );
};

export default Gaming;
