import React, { useRef } from 'react';
import Hero from './HomeComp/Hero/Hero'
import Navbar from '../Navbar';
// import Popular from './HomeComp/Popular/Popular';
// import Offers from './HomeComp/Offers/Offers';
// import NewCollections from './HomeComp/NewCollections/NewCollections';
// import NewsLetter from './HomeComp/NewsLetter/NewsLetter';

const Home = () => {
//   const newCollectionsRef = useRef(null);

  return (
    <div>
        <Navbar/>
      <Hero />
      {/* <Popular />
      <Offers />
      <div ref={newCollectionsRef}>
        <NewCollections/>
      </div>
      <NewsLetter /> */}
    </div>
  );
};

export default Home;
