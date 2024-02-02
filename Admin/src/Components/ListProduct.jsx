import React, { useState, useEffect } from "react";
import "../styles/listproduct.css";
import { FaTimes } from "react-icons/fa";

const ListProduct = () => {
  const [allproducts, setAllProducts] = useState([]);

  const fetchInfo = async () => {
    try {
      const response = await fetch("http://localhost:5000/allproducts");
      if (response.ok) {
        const data = await response.json();
        setAllProducts(data);
      } else {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    fetchInfo();
  }, []);

   const remove_product = async (id)=>{
    await fetch ('http://localhost:5000/removeproduct',{
      method : 'POST',
      headers:{
        Accept: 'application/json',
        'Content-Type' : 'application/json',
      },
      body:JSON.stringify({id:id})
    })
   await fetchInfo();
   }

  return (
    <div className="list-product">
      <h1>All Products List</h1>
      <div className="listproduct-format-main">
        <p>Products</p>
        <p>Title</p>
        <p>Old Price</p>
        <p>New Price</p>
        <p>Category</p>
        <p>Remove</p>
      </div>
      <div className="listproduct-allproducts">
        <hr />
        {allproducts.map((product, index) => {
          return (
            <>

            <div key={index} className="listproduct-format-main listproduct-format">
              <img src={`http://localhost:5000/images/${product.image}`} alt="" className="listproduct-product-icon" />
              <p>{product.name}</p>
              <p>${product.old_price}</p>
              <p>${product.new_price}</p>
              <p>{product.category}</p>
              <FaTimes  onClick= {()=>{remove_product(product.id)}} className="listproduct-remove-icon" />
            </div>
          <hr />
          </>
          );
          
        })}
      </div>
    </div>
  );
};

export default ListProduct;
