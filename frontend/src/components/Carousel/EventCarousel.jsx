import {useState, useEffect} from "react";
import {useDispatch, useSelector} from 'react-redux';
import { fetchEvents } from "../../store/events";
import Carousel from 'react-bootstrap/Carousel';
import image1 from '../../assets/images/image1.jpg';
import image2 from '../../assets/images/image2.jpg';
import image3 from '../../assets/images/image3.jpg';
import allSports from '../../assets/images/allSports.jpeg'
import "./EventCarousel.css"




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
  const [index, setIndex] = useState(0);
  const events = Object.values(useSelector(state => state.events.all)).slice(0,4)
  console.log(events)
  const dispatch = useDispatch();
  const handleSelect = (selectedIndex, e) => {
    setIndex(selectedIndex);
  };

  useEffect(() => {
    dispatch(fetchEvents());
  }, [dispatch]);

  

  return (
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
  );
}
export default EventCarousel;

