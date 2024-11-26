import { useContext } from "react";
import { RiPlayListAddLine } from "react-icons/ri";
import { formatDistanceToNow } from "date-fns";
import { Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import NxtWatchContext from "../context/NxtWatchContext";
import { useState } from "react";
import { VideoDataType } from "../App";
import { MdDelete } from "react-icons/md";

import "../styles/trending.css";

const SavedVideo = () => {
  const { darkMode, savedVideosList, saveVideosFunc } =
    useContext(NxtWatchContext);
  const HomeDarkBg = darkMode ? "home-dark-bg" : "home-light-bg";
  console.log("saved:", savedVideosList);
  const [chika, setChika] = useState<boolean>(false);
  const [data, setData] = useState<VideoDataType | null>(null);

  const savedView = () => {
    const mainPartBg = darkMode ? "main-dark-light-bg" : "main-part-light-bg";
    const videoParaColor = darkMode ? "ib-hubs-dark" : "ib-hubs-light";
    const titleColor = darkMode ? "dark-title" : null;
    const trendingBg = darkMode ? "trending-dark-css" : "trending-light";
    const fireBg = darkMode ? "fire-dark-bg" : null;
    const del = darkMode ? "tdsl" : "tds";

    const handleMenuClick = (
      e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
      item: VideoDataType
    ) => {
      e.stopPropagation();
      e.preventDefault();
      setData(item);
      setChika(true);
    };
    const delet = () => {
      if (data) {
        saveVideosFunc(data);
        setChika(false);
      }
    };
    return (
      <>
        <div className={`trending-light-css ${trendingBg}`}>
          <RiPlayListAddLine className={`fire-light-css ${fireBg}`} />
          <h1>Saved Videos</h1>
        </div>
        <div className={`tmp ${mainPartBg}`}>
          <ul className="tuld">
            {savedVideosList.map((item) => {
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
                          <p className={`zambi tt ${titleColor}`}>
                            {item.title}
                          </p>
                          <p
                            className={`trending-title name ${videoParaColor}`}
                          >
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
                            <button
                              onClick={(e) => {
                                handleMenuClick(e, item);
                              }}
                              className={`binga ${del}`}
                            >
                              <MdDelete size={16} />
                            </button>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          handleMenuClick(e, item);
                        }}
                        className={`singa ${del}`}
                      >
                        <MdDelete size={16} />
                      </button>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
        {chika && (
          <>
            <div className="simbi">
              <div className="simbi1">
                <h3>Are you sure You want delete?</h3>
                <div className="simbi2">
                  <button
                    onClick={() => {
                      delet();
                    }}
                    className="yes-button"
                  >
                    Yes
                  </button>
                  <button
                    onClick={() => {
                      setChika(false);
                    }}
                    className="close-button"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </>
    );
  };

  const noSavedView = () => {
    const mainPartBg = darkMode ? "main-dark-light-bg" : "main-part-light-bg";

    const titleColor = darkMode ? "dark-title" : null;

    return (
      <>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}
          className={`trending-main-part ${mainPartBg}`}
        >
          <img
            alt="no-saved"
            src="https://assets.ccbp.in/frontend/react-js/nxt-watch-no-saved-videos-img.png"
            className="no-saved"
          />
          <h1 className={`${titleColor}`}>No Saved videos found</h1>
          <p className={`${titleColor}`}>
            You can save your videos while watching them
          </p>
        </div>
      </>
    );
  };

  return (
    <>
      <div className={`trending-item-arrangement ${HomeDarkBg}`}>
        <Sidebar />

        <div className="trending-nav-section">
          <Navbar />

          {/* ul div */}
          {savedVideosList.length > 0 ? savedView() : noSavedView()}
        </div>
      </div>
    </>
  );
};

export default SavedVideo;
