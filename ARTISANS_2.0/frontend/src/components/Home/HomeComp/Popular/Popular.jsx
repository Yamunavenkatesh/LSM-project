// import React, { useEffect, useState } from 'react'
// import './popular.css'
// import Item from '../Item/Item'
// import data_product from '../Assets/data'

// const Popular = () => {

//   const [popularProducts,setPopularProducts] = useState([])

//   useEffect(()=>{
//     // fetch('https://e-shop-v7kq.onrender.com/popularinwomen')
//     // .then((response)=>response.json())
//     // .then((data)=>setPopularProducts(data))
//     setPopularProducts(data_product)
//   },[])
  

//   return (
//     <div className='popular'>
//       <h1>Latest Products curated for You</h1>
//       <hr />
//       <div className="popular-item">
//         {popularProducts.map((item, i)=>{
//             return <Item key={i} id={item.id} name={item.name} image={item.image} new_price={item.new_price} old_price={item.old_price}/>
//         })}
//       </div>
//     </div>
//   )
// }

// export default Popular



//new

// src/components/ArtisanList.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Popular = () => {
    const [artisans, setArtisans] = useState([]);

    useEffect(() => {
        const fetchArtisans = async () => {
            const res = await axios.get('http://localhost:5000/api/artisans');
            setArtisans(res.data);
        };
        fetchArtisans();
    }, []);

    return (
        <div>
            <h1>Artisans</h1>
            <ul>
                {artisans.map((artisan) => (
                    <li key={artisan._id}>
                        <h2>{artisan.name}</h2>
                        <p>{artisan.email}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Popular;
