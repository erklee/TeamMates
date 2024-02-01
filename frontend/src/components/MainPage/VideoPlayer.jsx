import { useState, useEffect } from "react";
import "./VideoPlayer.css";
import video from "../../assets/videos/teammates.mp4"
import video2 from "../../assets/videos/basketball.mp4"
import video3 from "../../assets/videos/soccer2.mp4"
// import video4 from "../../assets/videos/tennis2.mp4"
// import video5 from "../../assets/videos/baseball.mp4"
// import video6 from "../../assets/videos/basketball2.mp4"


// import videos from "../../assets/videos/teammates.mp4"

const VideoPlayer = () => {
  const videos = [
    // "../../assets/videos/teammates.mp4",
    // "../../assets/videos/basketball.mp4",
    video, video2, video3
  ];

  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);

  useEffect(() => {
    const videoElement = document.getElementById('video-player');
    
    // Check if there are more videos to play
    if (currentVideoIndex < videos.length) {
      // Update the source and play the current video
      videoElement.src = videos[currentVideoIndex];
      videoElement.play();
    }
  }, [videos,currentVideoIndex]);

  const handleVideoEnded = () => {
    // When a video ends, move to the next one
    setCurrentVideoIndex((prevIndex) => (prevIndex + 1) % videos.length);
  };

  return (
    <section>
      <h1 className="videoSlogan">Make Friends, Play Sports, Stay Connected</h1>
      <video
        id="video-player"
        onEnded={handleVideoEnded}
        src={videos[currentVideoIndex]} 
        muted  
        autoPlay// controls
      >
      </video>
    </section>
  );
};

export default VideoPlayer;