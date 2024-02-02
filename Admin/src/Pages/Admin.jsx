import React from "react";
import Sidebar from "../Components/Sidebar.jsx";
import { Routes, Route } from "react-router-dom";
import AddProduct from "../Components/AddProduct.jsx";
import ListProduct from "../Components/ListProduct.jsx";
import "../styles/admin.css";

const Admin = () => {
  return (
    <div className="admin">
      <Sidebar />
      <Routes>
        <Route path="/addproduct" element={<AddProduct />} />
        <Route path="/listproduct" element={<ListProduct />} />
      </Routes>
    </div>
  );
};

export default Admin;
