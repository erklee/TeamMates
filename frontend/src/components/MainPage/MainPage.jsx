import LoginModal from "../Modals/LoginModal";
import SignUpModal from "../Modals/SignUpModal";
import EventCarousel from "../Carousel/EventCarousel";
import VideoPlayer from "./VideoPlayer";
import Footer from "../AboutUs/Footer";


function MainPage() {

  return (
    <div className="mainPageWrapper">
      {/* <video src={video} autoPlay muted loop height={500}></video> */}
      <SignUpModal  />
      <LoginModal />
      <VideoPlayer />
      
      <EventCarousel />
      <div id="spacer">

      </div>
      <Footer />
     
    </div >
  );
}

export default MainPage;



