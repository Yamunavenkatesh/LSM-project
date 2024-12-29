import React from 'react';
import './hero.css';
// import hand_icon from '../Assets/hand_icon.png';
// import arrow_icon from '../Assets/arrow.png';


const Hero = () => {
  const scrollToNewCollections = () => {
    // newCollectionsRef.current.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className='hero'>
      <div className="hero-left">
        <h2>Discover Unique Treasures, Made with Love</h2>
        <div>
          <div className="hero-hand-icon">
            <p>Shop handmade crafts from talented artisans around the world. </p>
            {/* <img src={hand_icon} alt='Hand Icon' /> */}
          </div>
        </div>
        <div className="hero-latest-btn" onClick={scrollToNewCollections}>
          <div>Latest Collection</div>
          {/* <img src={arrow_icon} alt='Arrow Icon' /> */}
        </div>
      </div>
      <div className="hero-right">
        {/* <img src={hero_image} alt='' /> */}
      </div>
    </div>
  );
};

export default Hero;
