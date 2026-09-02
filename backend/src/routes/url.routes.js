import { Router } from "express";
import {
  createUrl,
  getUrlDetails,
} from "../controllers/url.controller.js";

const router = Router();

router.post("/", createUrl);
router.get("/:shortCode", getUrlDetails);

export default router;