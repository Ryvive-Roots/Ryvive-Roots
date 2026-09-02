import express from "express";
import {
  getAdminCustomerMenu,
  getUserCustomerMenu,
  saveCustomerMenuDay,
  deleteCustomerMenuDay,
} from "../controllers/customerMenuController.js";

const router = express.Router();

// Admin — full CRUD
router.get("/admin/customer-menu", getAdminCustomerMenu);
router.post("/admin/customer-menu", saveCustomerMenuDay);
router.delete("/admin/customer-menu", deleteCustomerMenuDay);

// Customer dashboard — read only
router.get("/user/customer-menu", getUserCustomerMenu);

export default router;