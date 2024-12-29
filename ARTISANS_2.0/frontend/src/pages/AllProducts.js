import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import axios from 'axios';
import { Link } from "react-router-dom";

const AllProducts = () => {
  const [products, setProducts] = useState([]);
  const getAllProducts = async () => {
    try {
      const res = await axios.get('/api/v1/user/get-all-products');
      if (res.data.success) {
        setProducts(res.data.products);
      }
    }
    catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getAllProducts();
  }, [])

  return (
    <Layout >
      <>
      <h1 className="text-center font-semibold text-3xl text-emerald-200">All Products</h1>

      <div className="flex flex-wrap gap-6 justify-center mt-9 pt-2">
        {
          products.map((product) =>
          (<Link to={`/products/${product._id}`} key={product._id} className="w-full sm:w-80 max-w-xs bg-white border border-gray-200 rounded-xl shadow-md hover:shadow-lg transform hover:scale-105 transition duration-300">
              <img className="w-full h-56 object-cover rounded-t-xl" src={product.imageUrl} alt="product image" />
            <div className="px-6 py-4">
                <h5 className="text-lg font-semibold tracking-tight text-gray-900 dark:text-white">{product.name}</h5>
              <div className="flex items-center mt-2.5 mb-3">
                <div className="flex items-center space-x-1 rtl:space-x-reverse">
                  {
                    Array.from({ length: product.rating }).map((star, index) => (
                      <svg key={index} className="w-5 h-5 text-yellow-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 20">
                        <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                      </svg>))
                  }
                  {
                    Array.from({ length: 5 - product.rating }).map((blackStar, index) => (
                      <svg key={index} className="w-5 h-5 text-gray-300" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 20">
                        <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                      </svg>))
                  }
                </div>
                <span className="bg-blue-500 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded dark:bg-blue-200 dark:text-blue-800 ms-3">{product.rating}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-semibold text-gray-900 dark:text-black">₹ {product.price}</span>
              </div>
            </div>
          </Link>))
        }
      </div>
      </>
    </Layout>
  );
};

export default AllProducts;
