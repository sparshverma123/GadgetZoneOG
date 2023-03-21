import React from "react";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import "./PriceSuccess.css";
import { Typography } from "@material-ui/core";
import { Link } from "react-router-dom";

const PriceSuccess = () => {
  return (
    <div className="orderSuccess">
      <CheckCircleIcon />

      <Typography>Your New-Price has been set successfully in the Price Tracker</Typography>
      <Link to="/myFuture/order/new">View your Prices</Link>
    </div>
  );
};

export default PriceSuccess;
