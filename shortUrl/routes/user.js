const express = require ('express');
const { handleUserSignup, handleUserLogin, handleUserLogout, handleGetAllUsers } = require("../controllers/user");
const router = express.Router();

router.post('/', handleUserSignup);
router.post("/login", handleUserLogin);
router.get("/logout", handleUserLogout); // GET request for logout
router.get('/', handleGetAllUsers); // GET /user to see all users

module.exports = router;