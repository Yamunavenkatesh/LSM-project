import React from 'react'
import './offers.css'
import exclusive_imgage from '../Assets_2.0/exclusive_image.png'
const Offers = () => {
  return (
    <div className='offers'>
      <div className="offers-left">
      <h1>Exclusive</h1>
      <h1>Offers </h1>
      <p>ON BEST SELLING PRODUCTS</p>
      <button>Check Now</button>
      </div>
      
      <div className="offers-right">
        <img src={exclusive_imgage} alt=''/>
      </div>
    </div>
  )
}

export default Offers
