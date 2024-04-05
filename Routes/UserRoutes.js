const express = require("express");
const router = express.Router();
const usercontroller = require("../Controllers/user-controller");
const { verifyToken } = require("../middleware/verifyToken");


router.route("/register").post(usercontroller.userRegister);
router.route("/adminlogin").post(usercontroller.adminLogin);
router.route("/login").post(usercontroller.userLogin);
router.route("/logout").get(usercontroller.logout);
router.route("/getAllUsers").get(usercontroller.getAllUser);
router.route("/deleteuser/:id").delete(verifyToken,usercontroller.deleteUser);
router.route("/getuserprofile").get(verifyToken, usercontroller.getUserProfile);
router.route("/updateuser/:id").put(verifyToken, usercontroller.updateUserProfile);


module.exports = router;