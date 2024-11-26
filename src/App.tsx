import React, { Component } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import NxtWatchContext from "./context/NxtWatchContext";
import Home from "./pages/Home";
import Trending from "./pages/Trending";
import Gaming from "./pages/Gaming";
import VideoPlayer from "./pages/Videoplayer";
import SavedVideo from "./pages/SavedVideos";
import ProtectedRoute from "./components/ProtectedRoute";

interface stateData {
  darkMode: boolean;
  premiumDisplay: boolean;
  savedVideosList: VideoDataType[] | [];
}

export interface VideoDataType {
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

interface Contextvalue {
  darkMode: boolean;
  premiumDisplay: boolean;
  darkModeFunc: () => void;
  closePremium: () => void;
  saveVideosFunc: (video: VideoDataType) => void;
  savedVideosList: VideoDataType[];
}

class App extends Component<{}, stateData> {
  state: stateData = {
    darkMode: false,
    premiumDisplay: true,
    savedVideosList: [],
  };

  componentDidMount() {
    const storedDarkMode = localStorage.getItem("darkMode");
    const storedSavedVideosList = localStorage.getItem("savedVideosList");

    if (storedDarkMode !== null) {
      this.setState({ darkMode: JSON.parse(storedDarkMode) });
    }

    if (storedSavedVideosList !== null) {
      this.setState({
        savedVideosList: JSON.parse(storedSavedVideosList),
      });
    }
  }

  componentDidUpdate(prevProps: any, prevState: stateData) {
    if (prevState.darkMode !== this.state.darkMode) {
      localStorage.setItem("darkMode", JSON.stringify(this.state.darkMode));
    }

    if (prevState.savedVideosList !== this.state.savedVideosList) {
      localStorage.setItem(
        "savedVideosList",
        JSON.stringify(this.state.savedVideosList)
      );
    }
  }

  darkModeFunc = () => {
    this.setState((prevState) => ({
      darkMode: !prevState.darkMode,
    }));
    console.log("entered DarkMode");
  };

  closePremium = () => {
    this.setState((prevState) => ({
      premiumDisplay: !prevState.premiumDisplay,
    }));
  };

  saveVideosFunc = (video: VideoDataType) => {
    this.setState((prevState) => {
      const isSaved = prevState.savedVideosList.find(
        (savedVideo: VideoDataType) => savedVideo.id === video.id
      );
      if (isSaved) {
        return {
          savedVideosList: prevState.savedVideosList.filter(
            (savedVideo: VideoDataType) => savedVideo.id !== video.id
          ),
        };
      }
      return {
        savedVideosList: [...prevState.savedVideosList, video],
      };
    });
  };

  render(): React.ReactNode {
    const contextvalue: Contextvalue = {
      darkMode: this.state.darkMode,
      darkModeFunc: this.darkModeFunc,
      closePremium: this.closePremium,
      saveVideosFunc: this.saveVideosFunc,
      premiumDisplay: this.state.premiumDisplay,
      savedVideosList: this.state.savedVideosList,
    };

    return (
      <BrowserRouter>
        <NxtWatchContext.Provider value={contextvalue}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<Home />} />
              <Route path="/trending" element={<Trending />} />
              <Route path="/gaming" element={<Gaming />} />
              <Route path="/videos/:id/" element={<VideoPlayer />} />
              <Route path="/saved-videos" element={<SavedVideo />} />
            </Route>
          </Routes>
        </NxtWatchContext.Provider>
      </BrowserRouter>
    );
  }
}

export default App;
