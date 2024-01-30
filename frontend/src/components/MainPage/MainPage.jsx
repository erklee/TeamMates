import LoginModal from "../Modals/LoginModal";
import SignUpModal from "../Modals/SignUpModal";
import EventCarousel from "../Carousel/EventCarousel";

function MainPage() {
  return (
    <>
      <SignUpModal  />
      <LoginModal />
      <EventCarousel />
    </>
  );
}

export default MainPage;

