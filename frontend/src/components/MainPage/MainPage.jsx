import LoginModal from "../Modals/LoginModal";
import SignUpModal from "../Modals/SignUpModal";
import EventCarousel from "../Carousel/EventCarousel";
import VideoPlayer from "./VideoPlayer";
import "./MainPage.css"

function MainPage() {
  return (
    <div className="mainPageWrapper">
      {/* <video src={video} autoPlay muted loop height={500}></video> */}
      <SignUpModal  />
      <LoginModal />
      <VideoPlayer />
      <EventCarousel />
    </div >
  );
}

export default MainPage;



