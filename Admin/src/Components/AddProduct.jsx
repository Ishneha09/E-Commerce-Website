import React, { useState } from "react";
import "../styles/addproduct.css";
import { FaCloudUploadAlt } from "react-icons/fa";

const AddProduct = () => {
  const [image, setImage] = useState(null);
  const [productDetails, setProductDetails] = useState({
    name: "",
    category: "skin",
    new_price: "",
    old_price: "",
  });
  const [error, setError] = useState(null);

  const imageHandler = (e) => {
    setImage(e.target.files[0]);
  };

  const changeHandler = (e) => {
    setProductDetails({ ...productDetails, [e.target.name]: e.target.value });
  };

  const addProduct = async () => {
    console.log(productDetails);

    const formData = new FormData();

    formData.append("product", image);

    formData.append("name", productDetails.name);
    formData.append("category", productDetails.category);
    formData.append("new_price", productDetails.new_price);
    formData.append("old_price", productDetails.old_price);

    try {
      const response = await fetch("http://localhost:5000/addproduct", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const responseData = await response.json();
        console.log(responseData);
        alert("ADDED PRODUCT");
        setError(null);
      } else {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
    } catch (error) {
      console.error("Error adding product:", error);
      setError("Error adding product. Please try again.");
    }
  };

  return (
    <div className="add-product">
      {error && <p style={{ color: "red" }}>{error}</p>}
      <div className="addproduct-itemfield">
        <p>Product title</p>
        <input
          value={productDetails.name}
          onChange={changeHandler}
          type="text"
          name="name"
          placeholder="Type here "
        />
      </div>
      <div className="addproduct-price">
        <div className="addproduct-itemfield">
          <p>Price</p>
          <input
            value={productDetails.old_price}
            onChange={changeHandler}
            type="text"
            name="old_price"
            placeholder="Type here"
          />
        </div>
        <div className="addproduct-itemfield">
          <p>Offer Price</p>
          <input
            value={productDetails.new_price}
            onChange={changeHandler}
            type="text"
            name="new_price"
            placeholder="Type here"
          />
        </div>
      </div>
      <div className="addproduct-itemfield">
        <p>Product Category </p>
        <select
          value={productDetails.category}
          onChange={changeHandler}
          name="category"
          className="add-product-selector"
        >
          <option value="skin">Skin</option>
          <option value="hair">Hair</option>
          <option value="makeup">Makeup</option>
        </select>
      </div>
      <div className="addproduct-itemField">
        <label htmlFor="file-input" className="thumbnail-label">
          {image ? (
            <>
              <img
                src={URL.createObjectURL(image)}
                alt="Uploaded Thumbnail"
                className="addproduct-thumbnail-img"
              />
            </>
          ) : (
            <>
              <FaCloudUploadAlt className="addproduct-thumbnail-img" />
              <p className="uploaded-text">Uploaded</p>
            </>
          )}
        </label>
        <input
          onChange={imageHandler}
          type="file"
          name="productImage"
          id="file-input"
          hidden
        />
      </div>
      <button onClick={addProduct} className="addproduct-btn">
        ADD
      </button>
    </div>
  );
};

export default AddProduct;
