const express = require("express");
const router = new express.Router(); // This is done to create the API
const userdb = require("../models/userSchema");
const bcrypt = require("bcryptjs");
const authenticate = require("../middleware/authenticate");

// for user registration
// created register API
router.post("/register", async (req, res) => {
  console.log(req.body); // Log the received data to the server console
  const { fname, email, password, cpassword } = req.body;
  if (!fname || !email || !password || !cpassword) {
    res.status(422).json({ error: "Fill all the required fields" });
  }

  try {
    const preuser = await userdb.findOne({ email: email });

    if (preuser) {
      res.status(422).json({ error: "This email already exist" });
    } else if (password != cpassword) {
      res.status(422).json({ error: "Passwords dosent match" });
    } else {
      //Just set
      const finalUser = new userdb({
        fname,
        email,
        password,
        cpassword,
      });

      //Now Hashmap the password and the save into the main database

      const storeData = await finalUser.save();

      // console.log(storeData);
      //this response will be sent to the browser console
      res.status(201).json({ status: 201, storeData });
    }
  } catch (error) {
    res.status(422).json(error);
    console.log("Catch block error" + error);
  }
});

// user Login

router.post("/login", async (req, res) => {
  // console.log(req.body);
  const { fname, email, password, cpassword } = req.body;
  if (!email || !password) {
    res.status(422).json({ error: "Fill all the required fields" });
  }

  try {
    const userValid = await userdb.findOne({ email: email });

    if (userValid) {
      const isMatch = await bcrypt.compare(password, userValid.password);

      if (!isMatch) {
        res.status(422).json({ error: "Invalid Details" });
      } else {
        //Token Generate
        const token = await userValid.generateAuthtoken();

        // console.log(token);
        // Generate Cookie
        res.cookie("usercookie", token, {
          expires: new Date(Date.now() + 9000000),
          httpOnly: true,
        });

        const result = {
          userValid,
          token,
        };

        res.status(201).json({ status: 201, result });
      }
    }
  } catch (error) {}
});

// user valid
router.get("/validuser", authenticate, async (req, res) => {
  // console.log("Done!");
  try {
    const ValidUserOne = await userdb.findOne({ _id: req.userId });
    res.status(201).json({ status: 201, ValidUserOne });
  } catch (error) {
    res.status(401).json({ status: 401, error });
  }
});

//User Logout

router.get("/logout", authenticate, async (req, res) => {
  try {
    req.rootUser.tokens = req.rootUser.tokens.filter((curelem) => {
      return curelem.token !== req.token;
    });

    res.clearCookie("usercookie", { path: "/" });

    req.rootUser.save();

    res.status(201).json({status : 201});
  } catch (error) {
    res.status(201).json({ status: 401, error });
  }
});

module.exports = router;

//Encrypt and decrypt
// 2 way connection

//hashing
// 1 way connection
//compare password
