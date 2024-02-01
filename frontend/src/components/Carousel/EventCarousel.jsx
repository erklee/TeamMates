import {useNavigate} from 'react-router-dom';
import './EventCarousel.css';
import {useState, useEffect} from "react";
import {useDispatch, useSelector} from 'react-redux';
import { fetchEvents } from "../../store/events";
import Carousel from 'react-bootstrap/Carousel';
import image1 from '../../assets/images/image1.jpg';
import image2 from '../../assets/images/image2.jpg';
import image3 from '../../assets/images/image3.jpg';
import allSports from '../../assets/images/allSports.jpeg';
import basketball from "../../assets/icons/sports/basketball.png";
import tennis from "../../assets/icons/sports/tennis.png";
import baseball from "../../assets/icons/sports/baseball.png";
import hockey from "../../assets/icons/sports/hockey.png";
import football from "../../assets/icons/sports/football.png";
import soccer from "../../assets/icons/sports/soccer.png";





const data = [
  {
    image:image1,
    caption:"Caption",
    description:"Description Here1",
  },
  {
    image:image2,
    caption:"Caption",
    description:"Description Here2",
  },
  {
    image:image3,
    caption:"Caption",
    description:"Description Here3",
  }, 
];

function EventCarousel() {
  const navigate = useNavigate();
  const [index, setIndex] = useState(0);
  const events = Object.values(useSelector(state => state.events.all)).slice(0,4);
  const dispatch = useDispatch();
  const handleSelect = (selectedIndex, e) => {
    setIndex(selectedIndex);
  };

  useEffect(() => {
    dispatch(fetchEvents());
  }, [dispatch]);

  const handleIcons = e => {
    e.preventDefault();
    const sport = e.target.alt;
    navigate('/events', { state: { sport }});
  };

  return (
    <section className="carouselWrapper">
      <h1>Events</h1>
      <div className="sportsIconContainer">
        <div className='sportsIconInfoContainer'>
          <img src={basketball} onClick={handleIcons} alt="basketball" />
          <p>Basketball</p>
        </div>
      
        <div className='sportsIconInfoContainer'>
          <img src={football} onClick={handleIcons} alt="football" />
          <p>Football</p>
        </div>
        
        <div className='sportsIconInfoContainer'>
          <img src={baseball} onClick={handleIcons} alt="baseball" />
          <p>Baseball</p>
        </div>
        <div className='sportsIconInfoContainer'>
          <img src={soccer} onClick={handleIcons} alt="soccer" />
          <p>Soccer</p>
        </div>

        <div className='sportsIconInfoContainer'>
          <img src={hockey} onClick={handleIcons} alt="hockey" />
          <p>Hockey</p>
        </div>

        <div className='sportsIconInfoContainer'>
          <img src={tennis} onClick={handleIcons} alt="tennis" />
          <p>Tennis</p>
        </div>
      </div>
      <Carousel className='carouselContainer' activeIndex={index} onSelect={handleSelect} interval={3000} pause={false}>
        {events.map((slide, i) => {
          return (
            <Carousel.Item slide={slide} key ={i}>        
              <img
                className="slideImage"
                src={slide.image || allSports}
                alt="slider image"
              />
              <Carousel.Caption>
                <h3>{slide.category[0].toUpperCase() + slide.category.slice(1)}</h3>
                <p>{slide.description[0].toUpperCase() + slide.description.slice(1)}</p>
              </Carousel.Caption>
            </Carousel.Item>
          );
        })}
        
      </Carousel>
    </section>
  );
}
export default EventCarousel;

