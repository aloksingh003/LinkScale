import { Router } from "express";
import {
  createUrl,
  getUrlDetails,
  getUrls,
  updateUrl,
  deactivateUrl,
} from "../controllers/url.controller.js";

const router = Router();

router
  .route("/")
  .post(createUrl)
  .get(getUrls);

router
  .route("/:shortCode")
  .get(getUrlDetails)
  .patch(updateUrl)
  .delete(deactivateUrl);

export default router;