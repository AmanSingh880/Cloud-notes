const express = require('express');
const router = express.Router();
const User = require('../models/user');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fetchuser = require('../middleware/fetchuser');
const JWT_SECRET = 'Amanisagood$boy';
// route 1 : create a user using POST "/api/auth/createUser". Doesn't requred Auth
router.post('/createUser', [
  body('email', 'Enter a valid email').isEmail(),
  body('password', 'Password length should be > 5').isLength({ min: 5 }),
  body('name', 'Enter a Valid name').isLength({ min: 5 }),
], async (req, res) => {
  //if there are errors return an error
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    // cheack wether exist email
    let user = await User.findOne({ email: req.body.email });
    if (user) {
      return res.status(400).json({ errors: "sorry email already exists" });
    }
    const salt = await bcrypt.genSalt(10);

    const secPass = await bcrypt.hash(req.body.password, salt);
    user = await User.create({
      name: req.body.name,
      password: secPass,
      email: req.body.email,
    })
    const data = {
      user: {
        id: user.id
      }
    }

    const authtoken = jwt.sign(data, JWT_SECRET);

    res.json({ authtoken });
  }
  catch (error) {
    res.status(500).json({ errors: "some error occur" });
  }
})

// route 2 : create a user using POST "/api/auth/login". Doesn't requred Auth
router.post('/login', [
  body('email', 'Enter a valid email').isEmail(),
  body('password', 'Password length should be > 5').exists(),
], async (req, res) => {


  //if there are errors return an error
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ errors: "Invalid email or password" });
    }
    const passwordCompare = await bcrypt.compare(password, user.password);
    if (!passwordCompare) {
      return res.status(400).json({ errors: "Invalid email or password" });
    }
    const data = {
      user: {
        id: user.id
      }
    }

    const authtoken = jwt.sign(data, JWT_SECRET);

    res.json({ authtoken });
  }
  catch (error) {
    res.status(401).json({ errors: "internal some error occur" });
  }
});


// route 3 : get user

router.post('/getuser',fetchuser, async (req, res) => {
  try {
    const userId = req.user.Id;
    const user = await User.findOne(userId).select("-password");
    res.send(user);
  } catch (error) {
    res.status(500).json({ errors: "internal some error occur" });
  }
});



module.exports = router
