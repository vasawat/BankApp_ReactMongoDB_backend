const express = require("express");
const router = express.Router();
const UserModel = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const saltRounds = 10;

router.post("/register", async (req, res) => {
  const data = req.body;
  const { emailRegister, passwordRegister } = data;
  bcrypt.hash(passwordRegister, saltRounds, function (err, hash) {
    const newUser = new UserModel({
      email: emailRegister,
      password: hash,
    });
    newUser
      .save()
      .then(() => {
        res.json({ success: "user created" });
        console.log("user created");
      })
      .catch((err) => {
        res.json({ error: "error in creating user" });
        console.error(err);
        console.log("error in creating user");
      });
  });
});

router.post("/login", async (req, res) => {
  const data = req.body;
  const { email, password } = data;
  const thisUser = await UserModel.findOne({ email });
  bcrypt.compare(password, thisUser.password, function (err, result) {
    if (result) {
      const payload = {
        sub: thisUser._id,
        email: thisUser.email,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 60 * 60,
      };
      const SECRET = "haidilao";
      const token = jwt.sign(payload, SECRET);
      console.log("login success");
      const newData = { ...thisUser._doc, token };
      res.json(newData);
    } else {
      console.log("user not found");
      res.json({ error: "user not found" });
    }
  });
  console.log("user login");
});

module.exports = router;
