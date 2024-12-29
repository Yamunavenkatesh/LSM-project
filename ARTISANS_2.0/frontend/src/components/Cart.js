import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Cart.css';

const Cart = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch userId from localStorage or auth context (assuming user is logged in)
  const userId = localStorage.getItem('token'); // Replace with your actual user authentication logic

  useEffect(() => {
    if (userId) {
      fetchCart();
    } else {
      setError('User not authenticated');
      setLoading(false);
    }
  }, [userId]);

  const fetchCart = async () => {
    try {
      const response = await axios.post('/api/cart/view-cart', { userId });
      setCart(response.data.cart);
      setLoading(false);
    } catch (err) {
      setError('Error fetching cart');
      setLoading(false);
    }
  };

  const addToCart = async (productId, quantity) => {
    try {
      const response = await axios.post('/api/cart/add-to-cart', {
        userId,
        productId,
        quantity,
      });
      setCart(response.data.cart);
    } catch (err) {
      console.error('Error adding product to cart:', err);
    }
  };

  const removeFromCart = async (productId) => {
    try {
      const response = await axios.post('/api/cart/remove-from-cart', {
        userId,
        productId,
      });
      setCart(response.data.cart);
    } catch (err) {
      console.error('Error removing product from cart:', err);
    }
  };

  const updateQuantity = async (productId, newQuantity) => {
    if (newQuantity < 1) return; // Prevent invalid quantity
    try {
      const response = await axios.post('/api/cart/update-quantity', {
        userId,
        productId,
        quantity: newQuantity,
      });
      setCart(response.data.cart);
    } catch (err) {
      console.error('Error updating product quantity:', err);
    }
  };

  if (loading) {
    return <div className="spinner">Loading...</div>; // Add a spinner class for style
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="cart">
      <h2>Your Cart</h2>
      {cart && cart.products.length > 0 ? (
        <>
          <ul>
            {cart.products.map((item) => (
              <li key={item.productId._id}>
                <img src={item.productId.imageUrl} alt={item.productId.name} width="50" />
                <span>{item.productId.name}</span>
                <span>${item.productId.price}</span>
                <div>
                  <button onClick={() => updateQuantity(item.productId._id, item.quantity - 1)}>
                    -
                  </button>
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) =>
                      updateQuantity(item.productId._id, parseInt(e.target.value))
                    }
                  />
                  <button onClick={() => updateQuantity(item.productId._id, item.quantity + 1)}>
                    +
                  </button>
                </div>
                <button onClick={() => removeFromCart(item.productId._id)}>Remove</button>
              </li>
            ))}
          </ul>
          <div>
            <h3>Total Amount: ${cart.totalAmount}</h3>
          </div>
        </>
      ) : (
        <div>Your cart is empty</div>
      )}
    </div>
  );
};

export default Cart;
