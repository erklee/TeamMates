import {useState} from "react"; 
import Carousel from 'react-bootstrap/Carousel';
import image1 from '../../assets/images/image1.jpg'
import image2 from '../../assets/images/image2.jpg'
import image3 from '../../assets/images/image3.jpg'

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

function HomeCarousel() {
  const [index, setIndex] = useState(0);
  const handleSelect = (selectedIndex, e) => {
    setIndex(selectedIndex);
  };

  return (
    <Carousel activeIndex={index} onSelect={handleSelect} interval={3000} pause={false}>
      {data.map((slide, i) => {
        return (
          <Carousel.Item slide={slide} key ={i}>        
            <img
              className="d-block w-100"
              src={slide.image}
              alt="slider image"
            />
            <Carousel.Caption>
              <h3>{slide.caption}</h3>
              <p>{slide.description}</p>
            </Carousel.Caption>
          </Carousel.Item>
        );
      })}
      
    </Carousel>
  );
}
export default HomeCarousel;

