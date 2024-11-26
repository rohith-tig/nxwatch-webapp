import { useState, useContext, ChangeEventHandler } from "react";
import NxtwatchContext from "../context/NxtWatchContext";
import { FaAlignJustify, FaMoon } from "react-icons/fa";
import { IoIosLogOut } from "react-icons/io";
import { IoSunnyOutline } from "react-icons/io5";
import Cookies from "js-cookie";
import { NavigateFunction, Link, NavLink } from "react-router-dom";
import { withRouter } from "../components/withRouter";
import "../styles/Navbar.css";
import { FiLogOut } from "react-icons/fi";

interface NavbarProps {
  navigate: NavigateFunction;
}

const Navbar = (props: NavbarProps) => {
  const { darkModeFunc, darkMode } = useContext(NxtwatchContext);
  const [menu, setMenu] = useState<boolean>(false);

  const menuFunc = () => {
    setMenu((prevState) => !prevState);
  };

  const logoutFunc = () => {
    Cookies.remove("jwt_token");
    props.navigate("/login");
    localStorage.removeItem("savedVideosList");
  };
  const closeFunc = () => {
    setMenu(false);
  };

  const sidebarBg = darkMode ? "sidebar-dark-bg" : "sidebar-light-bg";
  const buttonsBg = darkMode ? "button-dark-bg" : "button-light-bg";
  const logoutBg = darkMode ? "darkLogout" : "logout";
  const closeBg = darkMode ? "darkClose" : "close";
  const menuBg = darkMode
    ? "menuStyle sidebar-dark-bg"
    : "menuStyle sidebar-light-bg";
  const linkColor = darkMode ? "link-dark-color" : "link-light-color";

  return (
    <>
      <div className={`navbar ${sidebarBg}`}>
        <button
          type="button"
          className={`sm-logout ${buttonsBg}`}
          onClick={darkModeFunc}
          aria-label="dark-mode-btn"
        >
          {darkMode ? (
            <IoSunnyOutline className="sun" />
          ) : (
            <FaMoon className="moon" />
          )}
        </button>

        <img
          className="profile-img"
          src="https://assets.ccbp.in/frontend/react-js/nxt-watch-profile-img.png"
          alt="profile"
        />
        <button
          onClick={logoutFunc}
          aria-label="logout"
          type="button"
          className={`sm-logout ${buttonsBg}`}
        >
          <IoIosLogOut className={darkMode ? "sunny" : "moony"} />
        </button>
      </div>
      {/* SMALL DEVICES NAVBAR */}
      <div className={`sm-navbar ${sidebarBg}`}>
        <img
          className="nxtWatch-sm-logo"
          src="https://assets.ccbp.in/frontend/react-js/nxt-watch-logo-light-theme-img.png"
          alt="website logo"
        />
        <div>
          <button
            type="button"
            aria-label="theme-Changer"
            className={`sm-logout ${buttonsBg}`}
            onClick={darkModeFunc}
          >
            {darkMode ? (
              <IoSunnyOutline className="sunny" />
            ) : (
              <FaMoon className="moonny" />
            )}
          </button>
          <button
            type="button"
            aria-label="menu"
            className={`sm-logout ${buttonsBg}`}
            onClick={menuFunc}
          >
            <FaAlignJustify className={darkMode ? "sunny" : "moonny"} />
          </button>

          <button
            onClick={logoutFunc}
            aria-label="logout"
            type="button"
            className={`sm-logout ${buttonsBg}`}
          >
            <IoIosLogOut className={darkMode ? "sunny" : "moonny"} />
          </button>
          {
            <div className={`${menu ? menuBg + " open" : menuBg}`}>
              <ul className="listStyle">
                <li>
                  <NavLink
                    to="/"
                    className={({ isActive }) =>
                      isActive
                        ? `linkStyle ${linkColor} active`
                        : ` linkStyle ${linkColor}`
                    }
                  >
                    Home
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/trending"
                    className={({ isActive }) =>
                      isActive
                        ? `linkStyle ${linkColor} active`
                        : ` linkStyle ${linkColor}`
                    }
                  >
                    Trending
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/gaming"
                    className={({ isActive }) =>
                      isActive
                        ? `linkStyle ${linkColor} active`
                        : ` linkStyle ${linkColor}`
                    }
                  >
                    Gaming
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/saved-videos"
                    className={({ isActive }) =>
                      isActive
                        ? `linkStyle ${linkColor} active`
                        : ` linkStyle ${linkColor}`
                    }
                  >
                    Saved Videos
                  </NavLink>
                </li>
                <button
                  onClick={closeFunc}
                  aria-label="close"
                  className={`ada ${closeBg}`}
                >
                  close
                </button>
              </ul>
            </div>
          }
        </div>
      </div>
    </>
  );
};

export default withRouter(Navbar);
