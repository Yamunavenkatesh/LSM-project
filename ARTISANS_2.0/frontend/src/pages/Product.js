import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

function Product() {
  const [productData, setProductData] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [cart, setCart] = useState([]);
  const [showModal, setShowModal] = useState(false); // Modal state
  const [address, setAddress] = useState(''); // Address input state
  const params = useParams();
  const navigate = useNavigate();

  const amount = 500;
  const currency = 'INR';
  const receiptId = 'qwsaq1';

  const paymentHandler = async (e) => {
    const response = await fetch('/api/v1/user/order', {
      method: 'POST',
      body: JSON.stringify({
        amount,
        currency,
        receipt: receiptId,
      }),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });
    const order = await response.json();
    console.log(order);

    var options = {
      key: 'YourRazorID',
      amount,
      currency,
      name: 'Artisans',
      description: 'Test Transaction',
      image: 'https://example.com/your_logo',
      order_id: order.id,
      handler: async function (response) {
        const body = { ...response };
        const validateRes = await fetch('/api/v1/user/order/validate', {
          method: 'POST',
          body: JSON.stringify(body),
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const jsonRes = await validateRes.json();
        console.log(jsonRes);

        if (jsonRes.success) {
          setPaymentStatus('Payment Successful');
          navigate(`/order-confirmation/${jsonRes.orderId}`);
        } else {
          setPaymentStatus('Payment Failed');
        }
      },
      prefill: {
        name: 'Web Dev Matrix',
        email: 'webdevmatrix@example.com',
        contact: '9000000000',
      },
      notes: {
        address: address,
      },
      theme: {
        color: '#3399cc',
      },
    };

    var rzp1 = new window.Razorpay(options);
    rzp1.on('payment.failed', function (response) {
      alert(response.error.code);
      alert(response.error.description);
      alert(response.error.source);
      alert(response.error.step);
      alert(response.error.reason);
      alert(response.error.metadata.order_id);
      alert(response.error.metadata.payment_id);
    });
    rzp1.open();
    e.preventDefault();
  };

  const getProduct = async () => {
    try {
      const res = await axios.get(`/api/v1/user/products/${params.productId}`);
      if (res.data.success) {
        setProductData(res.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getProduct();
  }, []);

  const addToCart = () => {
    if (!productData) return;

    const existingProduct = cart.find(item => item.productId === productData.product._id);
    if (existingProduct) {
      const updatedCart = cart.map(item =>
        item.productId === productData.product._id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
      setCart(updatedCart);
    } else {
      const newProduct = {
        productId: productData.product._id,
        name: productData.product.name,
        price: productData.product.price,
        imageUrl: productData.product.imageUrl,
        quantity: 1,
      };
      setCart([...cart, newProduct]);
    }
    alert('Product added to cart!');
  };

  // Function to handle modal form submission
  const handleAddressSubmit = () => {
    if (address) {
      setShowModal(false); // Close the modal after submitting the address
      paymentHandler(); // Trigger payment handler
    } else {
      alert('Please enter a valid address');
    }
  };

  return (
    <Layout>
      <div className="pt-5">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row -mx-4">
            <div className="md:flex-1 px-4">
              <div className="h-[460px] rounded-lg bg-gray-300 dark:bg-gray-700 mb-4">
                <img
                  className="w-full h-full object-cover"
                  src={productData && productData.product.imageUrl}
                  alt="Product Image"
                />
              </div>
              <div className="flex gap-4">
                <button
                  className="inline-flex items-center px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-center text-white bg-primary-700 rounded-lg focus:ring-4 focus:ring-primary-200 dark:focus:ring-primary-900 hover:bg-primary-800"
                  onClick={() => setShowModal(true)}>
                  Buy now
                </button>
                <button
                  onClick={addToCart}
                  className="inline-flex items-center px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-center text-primary-700 bg-white rounded-lg focus:ring-4 focus:ring-primary-200 dark:focus:ring-primary-900 hover:bg-gray-200"
                >
                  Add to Cart
                </button>
              </div>
            </div>
            <div className="md:flex-1 px-4">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                {productData && productData.product.name}
              </h2>
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                {productData && `${productData.seller.firstName} ${productData.seller.lastName}`}
              </p>
              <div className="flex mb-4">
                <div className="mr-4">
                  <span className="font-bold text-gray-700 dark:text-gray-300">Price:</span>
                  <span className="text-gray-600 dark:text-gray-300">
                    {productData && productData.product.price}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Address Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h2 className="text-xl font-bold mb-4">Enter Your Address</h2>
            <textarea
              className="w-full p-2 border border-gray-300 rounded-lg mb-4"
              placeholder="Enter your address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
            {/* Displaying product name and price details */}
            <div className="border-t pt-4 mt-4 border-gray-300">
              <h3 className="font-semibold text-lg">Order Summary</h3>
              <div className="flex justify-between mt-2">
                <span className="text-gray-700">Product Name:</span>
                <span className="font-bold text-gray-800">{productData && productData.product.name}</span>
              </div>
              <div className="flex justify-between mt-2">
                <span className="text-gray-700">Price:</span>
                <span className="font-bold text-gray-800">{amount} {currency}</span>
              </div>
              <div className="flex justify-between mt-2">
                <span className="text-gray-700">Total:</span>
                <span className="font-bold text-gray-800">{amount} {currency}</span>
              </div>
            </div>
            <div className="flex justify-between mt-4">
              <button
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg"
                onClick={() => setShowModal(false)}>
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded-lg"
                onClick={handleAddressSubmit}>
                Confirm and Pay
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Display payment status */}
      {paymentStatus && <div className="text-center mt-5 text-lg font-semibold text-green"><p className='text-green-500'>Your Product will be Delivered Soon</p></div>}
    </Layout>
  );
}

export default Product;
