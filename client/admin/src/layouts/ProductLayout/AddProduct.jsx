import React, { useState, useEffect } from "react";
import { TextField } from "@mui/material";
import axios from "axios";
import { Select } from "antd";
const { Option } = Select;
import { useNavigate } from "react-router-dom";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const AddProduct = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [productName, setProductName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [inStock, setInStock] = useState("");
  const [category, setCategory] = useState("");
  const [photo, setPhoto] = useState("");
  const [errors, setErrors] = useState("");
  const [openError, setOpenError] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState("");
  const [openSuccess, setOpenSuccess] = React.useState(false); // Add a state for success Snackbar
  const [successMessage, setSuccessMessage] = React.useState("");

  const getAllCategory = async () => {
    try {
      const { data } = await axios.get(
        "http://localhost:8080/category/get-category"
      );
      if (data.success) {
        setCategories(data.category);
      }
    } catch (error) {
      console.log(error);
      alert("Something went wrong in getting category");
    }
  };

  useEffect(() => {
    getAllCategory();
  }, []);

  const minStock = 10;
  const minimumPrice = 1000;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!productName) {
      setErrors("Please provide a product name");
      return;
    }
    if (!price || price <= minimumPrice) {
      setErrors("Please provide a product price greater than 1000");
      return;
    }
    if (!inStock || inStock < minStock) {
      setErrors(`Please provide available stock details between ${minStock} `);
      return;
    }
    if (!photo) {
      setErrors("Please provide product image");
      return;
    }
    if (!category) {
      setErrors("Please provide product category");
      return;
    }
    try {
      const productData = new FormData();
      productData.append("productName", productName);
      productData.append("description", description);
      productData.append("price", price);
      productData.append("inStock", inStock);
      productData.append("photo", photo);
      productData.append("category", category);
      const { data } = await axios.post(
        "http://localhost:8080/product/create-product",
        productData
      );
      if (data?.success) {
        setSuccessMessage("The product successfully added.");
        setOpenSuccess(true);
        window.location.replace("/product/view-product");
      } else {
        alert(data?.message);
      }
    } catch (error) {
      console.log(error);
      setErrorMessage("An error occurred while adding the product.");
      setOpenError(true);
    }
  };

  const handleCloseError = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenError(false);
  };

  const handleCloseSuccess = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSuccess(false);
  };
  const handleDemoButtonClick = () => {
    setProductName("Luxe Glasses");
    setDescription(
      "Luxe Prescription glasses are a perfect fit for your everyday needs."
    );
    setPrice(3000);
    setInStock(20);

    setErrors("");
    setOpenError(false);
    setErrorMessage("");
    setOpenSuccess(false);
    setSuccessMessage("");
  };

  return (
    <>
      <div className="flex flex-col align-items w-full min-h-[85vh]">
        <div className="px-[20px] h-[64px] font-bold text-xl w-full flex justify-center items-center gap-[20px]">
          Add Product
        </div>
        <button
          type="button"
          onClick={handleDemoButtonClick}
          className="bg-transparent text-cyan-600 border-cyan-600 hover:bg-cyan-600 hover:text-white font-semibold  py-2 px-4 border border-blue-500 hover:border-transparent rounded"
        >
          Demo
        </button>
        <form onSubmit={handleSubmit}>
          <div className="flex justify-center grid grid-cols-2 gap-4 p-10">
            <div className="col-span-2 p-4">
              <Select
                bordered={false}
                placeholder="Select a category"
                size="large"
                showSearch
                className="w-full p-2 border rounded"
                onChange={(value) => {
                  setCategory(value);
                }}
              >
                {categories.map((c) => (
                  <Option key={c._id} value={c._id}>
                    {c.categoryName}
                  </Option>
                ))}
              </Select>
            </div>
            <div className="col-span-2 p-4">
              <label className="w-full p-2 border rounded cursor-pointer">
                {photo ? photo.name : "Upload product image"}
                <input
                  type="file"
                  id="uploadImages"
                  name="photo"
                  accept="image/*"
                  onChange={(e) => setPhoto(e.target.files[0])}
                  style={{ display: "none" }}
                />
              </label>
            </div>
            <div className="col-span-2 p-4">
              {photo && (
                <div className="text-center">
                  <img
                    src={URL.createObjectURL(photo)}
                    alt="product_photo"
                    height={"200px"}
                    width={"200px"}
                    className="img-img-responsive"
                  ></img>
                </div>
              )}
            </div>
            <div className="col-span-2 p-4">
              <TextField
                label="Product Name"
                variant="outlined"
                style={{ width: "100%" }}
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
              />
            </div>
            <div className="col-span-2 p-4">
              <TextField
                label="Product Description"
                variant="outlined"
                style={{ width: "100%" }}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div className="p-4 flex justify-center">
              <TextField
                label="Price"
                type="Number"
                variant="outlined"
                style={{ width: "100%" }}
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>
            <div className="p-4 flex justify-center">
              <TextField
                label="Product Quantity"
                type="Number"
                variant="outlined"
                style={{ width: "100%" }}
                value={inStock}
                onChange={(e) => setInStock(e.target.value)}
              />
            </div>
            {errors ? (
              <div className="w-full justify-center text-center px-[20px] py-[10px] border-2 border-red-700 bg-red-100 text-red-700 rounded text-xs">
                {errors ? errors : ""}
              </div>
            ) : (
              <></>
            )}
            <div className="col-span-2 flex justify-center pt-5">
              <button
                type="submit"
                className="bg-transparent text-cyan-600 border-cyan-600 hover:bg-cyan-600 hover:text-white font-semibold  py-2 px-4 border border-blue-500 hover:border-transparent rounded"
              >
                Add Product
              </button>
            </div>
          </div>
        </form>
      </div>
      <Snackbar
        open={openError}
        autoHideDuration={6000}
        onClose={handleCloseError}
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        <Alert onClose={handleCloseError} severity="error">
          {errorMessage}
        </Alert>
      </Snackbar>
      <Snackbar
        open={openSuccess}
        autoHideDuration={6000}
        onClose={handleCloseSuccess}
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        <Alert onClose={handleCloseSuccess} severity="success">
          {successMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default AddProduct;
