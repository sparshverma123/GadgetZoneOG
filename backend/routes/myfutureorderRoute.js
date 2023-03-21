const express = require("express");
const {
  newOrder,
  getSingleOrder,
  myOrders,
  getAllOrders,
  updateOrder,
  deleteOrder,
} = require("../controllers/myfutureorderController");
const router = express.Router();

const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");

router.route("/myFuture/order/new").post(isAuthenticatedUser, newOrder);

router.route("/myFuture/order/:id").get(isAuthenticatedUser, getSingleOrder);

router.route("/myFuture/orders/me").get(isAuthenticatedUser, myOrders);

// router.route("/orders/myFutureOrders").get(isAuthenticatedUser, myFutureOrders);

router
  .route("/admin/myFuture/orders")
  .get(isAuthenticatedUser, authorizeRoles("admin"), getAllOrders);

router
  .route("/admin/myFuture/order/:id")
  .put(isAuthenticatedUser, authorizeRoles("admin"), updateOrder)
  .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteOrder);

module.exports = router;