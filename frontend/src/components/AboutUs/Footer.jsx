
import './Footer.css';
import githubIcon from '../../assets/icons/github.png'
import linkedInIcom from '../../assets/icons/linkedin.png'
export default function Footer() {

    

  return(
    <footer className='aboutUsWrapers'>
      <h2>The <span>Developers</span></h2>
      <div className="developerInfo">
        <p>Eric Lee</p>
        <div className='bioIconsWrapper'>
          <a href="https://github.com/erklee"  target="_blank" rel="noopener noreferrer">
            <img src={githubIcon}  className="githubIcon" alt="Description of the image" />
          </a>
          <a href="https://www.linkedin.com/in/eric-lee-0184aa1a2/" target="_blank" rel="noopener noreferrer">
            <img src={linkedInIcom} className="linkedInIcon" alt="Description of the image" />
          </a>
        </div>
      </div>
      <div className="developerInfo">
        <p>Mujahed Ali</p>
        <div  className='bioIconsWrapper'>
          <a href="https://github.com/mujahed-a1i"  target="_blank" rel="noopener noreferrer">
            <img src={githubIcon}  className="githubIcon" alt="Description of the image" />
          </a>
          <a href="https://www.linkedin.com/in/mujahed-ali-957276169/" target="_blank" rel="noopener noreferrer">
            <img src={linkedInIcom} className="linkedInIcon" alt="Description of the image" />
          </a>
        </div>
      </div>

      <div className="developerInfo">
        <p>Peter Nolan</p>
        <div  className='bioIconsWrapper'>
          <a href="https://github.com/PlasmaNuke"  target="_blank" rel="noopener noreferrer">
            <img src={githubIcon}  className="githubIcon" alt="Description of the image" />
          </a>
          <a href="https://www.linkedin.com/in/peter-nolan-45828b2ab/" target="_blank" rel="noopener noreferrer">
            <img src={linkedInIcom} className="linkedInIcon" alt="Description of the image" />
          </a>
        </div>
      </div>
      <div className="developerInfo">
        <p>Shaun Jhingoor</p>
        <div className='bioIconsWrapper'>
        <a href="https://github.com/ShaunJhingoor"  target="_blank" rel="noopener noreferrer">
          <img src={githubIcon}  className="githubIcon" alt="Description of the image" />
        </a>
        <a href="https://www.linkedin.com/in/shaun-jhingoor-10a50328a/" target="_blank" rel="noopener noreferrer">
          <img src={linkedInIcom} className="linkedInIcon" alt="Description of the image" />
        </a>
        </div>
      </div>
    </footer>
  );
}