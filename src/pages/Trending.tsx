import { useContext, useState, useEffect } from "react";
import NxtWatchContext from "../context/NxtWatchContext";
import Cookies from "js-cookie";

import { ThreeDots } from "react-loader-spinner";
import { Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { FaFire } from "react-icons/fa";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import "../styles/trending.css";
import { URL } from "../config/env";
const apiStatusConstants = {
  initial: "INITIAL",
  success: "SUCCESS",
  failure: "FAILURE",
  inProgress: "IN_PROGRESS",
};

interface trendingData {
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

const Trending = () => {
  const { darkMode, closePremium, premiumDisplay } =
    useContext(NxtWatchContext);
  const HomeDarkBg = darkMode ? "home-dark-bg" : "home-light-bg";
  const isClicked = premiumDisplay ? "flex-row" : "show-none";
  const trendingBg = darkMode ? "trending-dark-css" : "trending-light";
  const fireBg = darkMode ? "fire-dark-bg" : null;

  const [trendingData, settrendingData] = useState<trendingData[]>([]);

  const [apiConstant, setApiConstant] = useState<string>(
    apiStatusConstants.initial
  );

  const trendingApicall = async () => {
    setApiConstant(apiStatusConstants.inProgress);

    const jwtToken = Cookies.get("jwt_token");

    const url = `${URL}/trending`;
    const options = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${jwtToken}`,
        "Content-Type": "application/json",
      },
    };

    try {
      const response = await fetch(url, options);

      if (response.ok) {
        const data = await response.json();

        // Check if videos exist in data
        if (data.videos) {
          const videoInfo = data.videos.map((item: rawData) => ({
            id: item.id,
            publishedAt: new Date(item.published_at),
            thumbnail: item.thumbnail_url,
            title: item.title,
            views: item.view_count,
            name: item.channel.name,
            profileImg: item.channel.profile_image_url,
          }));
          settrendingData(videoInfo);
          setApiConstant(apiStatusConstants.success);
        } else {
          console.error("No videos found in response:", data);
          setApiConstant(apiStatusConstants.failure);
        }
      } else {
        const errorData = await response.json();
        console.error("Error response:", errorData);
        if (errorData.status_code === 401) {
          console.error("Invalid AccessToken");
        }
        setApiConstant(apiStatusConstants.failure);
      }
    } catch (error) {
      setApiConstant(apiStatusConstants.failure);
      console.error("trending api error:", error);
    }
  };

  useEffect(() => {
    trendingApicall();
  }, []);

  const retryFunc = () => {
    trendingApicall();
  };

  const renderLoadingView = () => {
    return (
      <div className="products-details-loader-container" data-testid="loader">
        <ThreeDots color="#0b69ff" height="50" width="50" />
      </div>
    );
  };

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
        <button onClick={retryFunc} type="button">
          Retry
        </button>
      </div>
    </>
  );

  const renderSuccessView = () => {
    const mainPartBg = darkMode ? "main-dark-light-bg" : "main-part-light-bg";
    const videoParaColor = darkMode ? "ib-hubs-dark" : "ib-hubs-light";
    const titleColor = darkMode ? "dark-title" : null;
    return (
      <div className={`tmp ${mainPartBg}`}>
        <ul className="tuld">
          {trendingData.map((item) => {
            const distance = formatDistanceToNow(new Date(item.publishedAt));
            const part = distance.split(" ");
            const num = part[1];
            const namePart = item.title.slice(0, 20);
            return (
              <li key={item.id}>
                <Link
                  className="link-decoration"
                  aria-disabled
                  to={`/videos/${item.id}`}
                >
                  <div className="tlc">
                    <img className="tim" src={item.thumbnail} />

                    <div className="tvd">
                      <img className="tp" src={item.profileImg} />
                      <div className="tvfp">
                        <p className={`zingi tt ${titleColor}`}>
                          {namePart}...
                        </p>
                        <p className={`zambi tt ${titleColor}`}>{item.title}</p>
                        <p className={`trending-title name ${videoParaColor}`}>
                          {item.name}
                        </p>
                        <div className="chinagr">
                          <p
                            className={`trending-title name ${videoParaColor}`}
                          >
                            {`${item.views} views`}
                          </p>
                          <p
                            className={`trending-title name li-st ${videoParaColor}`}
                          >
                            {num} Years ago
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    );
  };

  const renderNxtWatchPage = () => {
    switch (apiConstant) {
      case apiStatusConstants.success:
        return renderSuccessView();
      case apiStatusConstants.inProgress:
        return renderLoadingView();
      case apiStatusConstants.failure:
        return renderFailureView();

      default:
        return null;
    }
  };

  return (
    <>
      <div className={`trending-item-arrangement ${HomeDarkBg}`}>
        <Sidebar />

        <div className="trending-nav-section">
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
            <FaFire className={`fire-light-css ${fireBg}`} />
            <h1>Trending</h1>
          </div>
          {/* ul div */}
          {renderNxtWatchPage()}
        </div>
      </div>
    </>
  );
};

export default Trending;
