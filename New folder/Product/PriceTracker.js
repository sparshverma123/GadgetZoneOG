
import React, { Fragment, useEffect, useState } from "react";
import "./PriceTracker.css";
import { useSelector, useDispatch } from "react-redux";
import { saveShippingInfo } from "../../actions/cartAction";
import MetaData from "../layout/MetaData";
// import { clearErrors, createProduct } from "../../actions/productAction";
import { clearErrors, createOrder } from "../../actions/futureorderAction";

import TransferWithinAStationIcon from "@material-ui/icons/TransferWithinAStation";
// import { Country, State } from "country-state-city";
import { useAlert } from "react-alert";
// import CheckoutSteps from "../Cart/CheckoutSteps";
import {
    CREATE_ORDER_REQUEST,
    CREATE_ORDER_SUCCESS,
    CREATE_ORDER_FAIL,
    CLEAR_ERRORS,
  } from "../../constants/futureorderConstants";

const PriceTracker = ({ history }) => {
  const dispatch = useDispatch();
  const alert = useAlert();
  const { shippingInfo } = useSelector((state) => state.cart);

//   const [address, setAddress] = useState(shippingInfo.address);
//   const [city, setCity] = useState(shippingInfo.city);
//   const [state, setState] = useState(shippingInfo.state);
//   const [country, setCountry] = useState(shippingInfo.country);
//   const [pinCode, setPinCode] = useState(shippingInfo.pinCode);
//   const [phoneNo, setPhoneNo] = useState(shippingInfo.phoneNo);
// const { pricingInfo } = useSelector((state) => state.cart);
//   const { loading, error, success } = useSelector((state) => state.newProduct);
const { loading, error, success } = useSelector((state) => state.newOrder);

const [id, setId] = useState("");
const [name, setName] = useState("");
const [price, setPrice] = useState("");
const [newprice, setNewprice] = useState("");
// const [pinCode, setPinCode] = useState(shippingInfo.pinCode);
// const [phoneNo, setPhoneNo] = useState(shippingInfo.phoneNo);

//   const shippingSubmit = (e) => {
//     e.preventDefault();

//     // if (phoneNo.length < 10 || phoneNo.length > 10) {
//     //   alert.error("Phone Number should be 10 digits Long");
//     //   return;
//     // }
//     // dispatch(
//     //   saveShippingInfo({ address, city, state, country, pinCode, phoneNo })
//     // );
//     dispatch(
//         // saveShippingInfo({ id, name, price, newprice })
//         createOrder({ id, name, price, newprice })
//       );
//     history.push("/myFuture/order/confirm");
//   };
  
    useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }

    if (success) {
      alert.success("Order Created Successfully");
      history.push("/myFuture/order/confirm");
      dispatch({ type: CREATE_ORDER_SUCCESS });
    }
  }, [dispatch, alert, error, history, success]);

  const createProductSubmitHandler = (e) => {
    e.preventDefault();

    const myForm = new FormData();

    myForm.set("id", id);
    myForm.set("name", name);
    myForm.set("price", price);
    myForm.set("newprice", newprice);
    // myForm.set("Stock", Stock);

    // images.forEach((image) => {
    //   myForm.append("images", image);
    // });
    dispatch(createOrder(myForm));
  };

//   const createProductImagesChange = (e) => {
//     const files = Array.from(e.target.files);

//     setImages([]);
//     setImagesPreview([]);

//     files.forEach((file) => {
//       const reader = new FileReader();

//       reader.onload = () => {
//         if (reader.readyState === 2) {
//           setImagesPreview((old) => [...old, reader.result]);
//           setImages((old) => [...old, reader.result]);
//         }
//       };

//       reader.readAsDataURL(file);
//     });
//   };

  return (
    <Fragment>
      <MetaData title="Price Tracker Details" />

      {/* <CheckoutSteps activeStep={0} /> */}

      <div className="shippingContainer">
        <div className="shippingBox">
          <h2 className="shippingHeading">Pricing Details</h2>

          <form
            className="shippingForm"
            encType="multipart/form-data"
            onSubmit={createProductSubmitHandler}
          >
            <div>
              <input
                type="text"
                placeholder="Product_ID"
                required
                value={id}
                onChange={(e) => setId(e.target.value)}
              />
            </div>

            <div>
              <input
                type="text"
                placeholder="Product_Name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div>
              <input
                type="number"
                placeholder="Product_Price"
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>

            <div>
              {/* <PhoneIcon /> */}
              <input
                type="number"
                placeholder="Product_New-Price"
                required
                value={newprice}
                onChange={(e) => setNewprice(e.target.value)}
                size="10"
              />
            </div>

            <input
              type="submit"
              value="Continue"
              className="shippingBtn"
            //   disabled={state ? false : true}
            />
          </form>
        </div>
      </div>
    </Fragment>
  );
};

export default PriceTracker;












// import React, { Fragment, useEffect, useState } from "react";
// import "./newProduct.css";
// import { useSelector, useDispatch } from "react-redux";
// import { clearErrors, createProduct } from "../../actions/productAction";
// import { useAlert } from "react-alert";
// import { Button } from "@material-ui/core";
// import MetaData from "../layout/MetaData";
// import AccountTreeIcon from "@material-ui/icons/AccountTree";
// import DescriptionIcon from "@material-ui/icons/Description";
// import StorageIcon from "@material-ui/icons/Storage";
// import SpellcheckIcon from "@material-ui/icons/Spellcheck";
// import AttachMoneyIcon from "@material-ui/icons/AttachMoney";
// import SideBar from "./Sidebar";
// import { NEW_PRODUCT_RESET } from "../../constants/productConstants";

// const NewProduct = ({ history }) => {
//   const dispatch = useDispatch();
//   const alert = useAlert();

//   const { loading, error, success } = useSelector((state) => state.newProduct);

//   const [name, setName] = useState("");
//   const [price, setPrice] = useState(0);
//   const [description, setDescription] = useState("");
//   const [category, setCategory] = useState("");
//   const [Stock, setStock] = useState(0);
//   const [images, setImages] = useState([]);
//   const [imagesPreview, setImagesPreview] = useState([]);

//   const categories = [
//     "Laptop",
//     "Footwear",
//     "Bottom",
//     "Tops",
//     "Attire",
//     "Camera",
//     "SmartPhones",
//   ];

//   useEffect(() => {
//     if (error) {
//       alert.error(error);
//       dispatch(clearErrors());
//     }

//     if (success) {
//       alert.success("Product Created Successfully");
//       history.push("/admin/dashboard");
//       dispatch({ type: NEW_PRODUCT_RESET });
//     }
//   }, [dispatch, alert, error, history, success]);

//   const createProductSubmitHandler = (e) => {
//     e.preventDefault();

//     const myForm = new FormData();

//     myForm.set("name", name);
//     myForm.set("price", price);
//     myForm.set("description", description);
//     myForm.set("category", category);
//     myForm.set("Stock", Stock);

//     images.forEach((image) => {
//       myForm.append("images", image);
//     });
//     dispatch(createProduct(myForm));
//   };

//   const createProductImagesChange = (e) => {
//     const files = Array.from(e.target.files);

//     setImages([]);
//     setImagesPreview([]);

//     files.forEach((file) => {
//       const reader = new FileReader();

//       reader.onload = () => {
//         if (reader.readyState === 2) {
//           setImagesPreview((old) => [...old, reader.result]);
//           setImages((old) => [...old, reader.result]);
//         }
//       };

//       reader.readAsDataURL(file);
//     });
//   };

//   return (
//     <Fragment>
//       <MetaData title="Create Product" />
//       <div className="dashboard">
//         <SideBar />
//         <div className="newProductContainer">
//           <form
//             className="createProductForm"
//             encType="multipart/form-data"
//             onSubmit={createProductSubmitHandler}
//           >
//             <h1>Create Product</h1>

//             <div>
//               <SpellcheckIcon />
//               <input
//                 type="text"
//                 placeholder="Product Name"
//                 required
//                 value={name}
//                 onChange={(e) => setName(e.target.value)}
//               />
//             </div>
//             <div>
//               <AttachMoneyIcon />
//               <input
//                 type="number"
//                 placeholder="Price"
//                 required
//                 onChange={(e) => setPrice(e.target.value)}
//               />
//             </div>

//             <div>
//               <DescriptionIcon />

//               <textarea
//                 placeholder="Product Description"
//                 value={description}
//                 onChange={(e) => setDescription(e.target.value)}
//                 cols="30"
//                 rows="1"
//               ></textarea>
//             </div>

//             <div>
//               <AccountTreeIcon />
//               <select onChange={(e) => setCategory(e.target.value)}>
//                 <option value="">Choose Category</option>
//                 {categories.map((cate) => (
//                   <option key={cate} value={cate}>
//                     {cate}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             <div>
//               <StorageIcon />
//               <input
//                 type="number"
//                 placeholder="Stock"
//                 required
//                 onChange={(e) => setStock(e.target.value)}
//               />
//             </div>

//             <div id="createProductFormFile">
//               <input
//                 type="file"
//                 name="avatar"
//                 accept="image/*"
//                 onChange={createProductImagesChange}
//                 multiple
//               />
//             </div>

//             <div id="createProductFormImage">
//               {imagesPreview.map((image, index) => (
//                 <img key={index} src={image} alt="Product Preview" />
//               ))}
//             </div>

//             <Button
//               id="createProductBtn"
//               type="submit"
//               disabled={loading ? true : false}
//             >
//               Create
//             </Button>
//           </form>
//         </div>
//       </div>
//     </Fragment>
//   );
// };

// export default NewProduct;


