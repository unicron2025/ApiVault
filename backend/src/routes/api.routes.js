const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth.middleware.js");

const { createApi, getApis, patchApi, deleteApi, toggleFavorite, searchApis } = require("../controllers/api.controller");

router.use(authMiddleware); 

router.post("/", createApi);
router.get("/", getApis);
router.patch("/:id", patchApi);
router.delete("/:id", deleteApi);
router.patch("/:id/favorite", toggleFavorite);

router.get("/search", searchApis); 

module.exports = router;

