import React from "react";

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

interface NxtWatchContextType {
  darkMode: boolean;
  premiumDisplay: boolean;
  darkModeFunc: () => void;
  closePremium: () => void;
  saveVideosFunc: (video: VideoDataType) => void;
  savedVideosList: VideoDataType[];
}

const NxtWatchContext = React.createContext<NxtWatchContextType>({
  darkMode: false,
  premiumDisplay: true,
  darkModeFunc: () => {},
  closePremium: () => {},
  saveVideosFunc: () => {},
  savedVideosList: [],
});

export default NxtWatchContext;
