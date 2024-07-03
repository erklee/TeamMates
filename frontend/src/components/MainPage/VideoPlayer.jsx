import { useState, useMemo } from "react";
import "./VideoPlayer.css";
import video from "../../assets/videos/teammates.mp4"
import video2 from "../../assets/videos/basketball.mp4"
import video3 from "../../assets/videos/soccer2.mp4"
import video4 from "../../assets/videos/tennis.mp4"
import video5 from "../../assets/videos/baseball.mp4"
import video6 from "../../assets/videos/basketball2.mp4"
import home from "../../assets/images/homeSports.jpg"



// import videos from "../../assets/videos/teammates.mp4"

const VideoPlayer = () => {
  const videos = useMemo(() => [
   video, video2, video3, video4, video5, video6],[])

  const [currentVideoIndex, setCurrentVideoIndex] = useState(Math.floor(Math.random() * 6));


  const handleVideoEnded = async() => {
    const nextVideoIndex = (currentVideoIndex + 1) % videos.length ;
    setCurrentVideoIndex(nextVideoIndex);

    const videoElement = document.getElementById('video-player');
    videoElement.src = videos[nextVideoIndex];
    videoElement.muted = true;
    if(videoElement.src === videos[nextVideoIndex]) await videoElement.play();
  };


  return (
    <section id="video-player-wrapper">
      {window.innerWidth > 600 ?(
            <>
            <h1 className="videoSlogan">Make Friends, Play Sports, Stay Connected</h1>
            <video
              id="video-player"
              onEnded={handleVideoEnded}
              src={videos[currentVideoIndex]}
              preload="auto"
              muted
              autoPlay
              playsInline
            />
          </>
        ) : (
          <>
            <h1 className="videoSlogan">Make Friends, Play Sports, Stay Connected</h1>
            <img src={home} alt="home" id="video-player" />
          </>
        )}
      </section>
  );
};

export default VideoPlayer;