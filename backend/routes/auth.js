const express = require("express");
const User = require("../models/userModel");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
const fetchuser = require("../middleware/fetchuser");

// const {
//   registerUser,
//   loginUser,
//   getMe,
// } = require("../controller/userController");
// const { protect } = require("../middleware/authMiddleware");

// router.post("/", registerUser);
// router.post("/login", loginUser);
// router.get("/me", protect, getMe);

// Create a User using POST "/api/auth/login". No login required
router.post(
  "/createuser",
  [
    body("name").isLength({ min: 3 }),
    body("email").isEmail(),
    body("password").isLength({ min: 5 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      // Check if the user exists in the database
      let user = await User.findOne({ email: req.body.email });

      if (user) {
        return res
          .status(400)
          .json({ error: "Sorry a user with this email already exists." });
      }

      // Hasing of the password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(req.body.password, salt);

      // Creating the user in the database
      user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword,
      });

      const data = {
        user: user.id,
      };
      const authToken = jwt.sign(data, process.env.JWT_SECRET);
      res.json({ authToken });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Some error occured");
    }
  }
);

// Authenticate a User using POST "/api/auth/login". No login required
router.post(
  "/login",
  [
    body("email", "Enter a valid email").isEmail(),
    body("password", "Password cannot be blank").exists(),
  ],
  async (req, res) => {
    // If there are errors, return a bad request and the error
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    try {
      let user = await User.findOne({ email });
      if (!user)
        return res
          .status(400)
          .json({ error: "Please try to login with correct credentials" });
      const passwordCompare = await bcrypt.compare(password, user.password);
      if (!passwordCompare)
        return res
          .status(400)
          .json({ error: "Please try to login with correct credentials" });
      const data = {
        user: user.id,
      };
      const authToken = jwt.sign(data, process.env.JWT_SECRET);
      res.json({ authToken });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
  }
);

router.get("/getuser", fetchuser, async (req, res) => {
  try {
    let userId = req.user;
    const user = await User.findById(userId).select("-password");
    res.send(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
