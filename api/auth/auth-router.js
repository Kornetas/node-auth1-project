const router = require("express").Router();
const model = require("../users/users-model");
const bcrypt = require("bcryptjs");
const {
  checkPasswordLength,
  checkUsernameExists,
  checkUsernameFree,
} = require("../auth/auth-middleware");
// Require `checkUsernameFree`, `checkUsernameExists` and `checkPasswordLength`
// middleware functions from `auth-middleware.js`. You will need them here!

/**
  1 [POST] /api/auth/register { "username": "sue", "password": "1234" }

  response:
  status 200
  {
    "user_id": 2,
    "username": "sue"
  }

  response on username taken:
  status 422
  {
    "message": "Username taken"
  }

  response on password three chars or less:
  status 422
  {
    "message": "Password must be longer than 3 chars"
  }
 */
router.post(
  "/register",
  checkUsernameFree,
  checkPasswordLength,
  (req, res, next) => {
    const password = bcrypt.hashSync(req.body.password, 8);
    req.body.password = password;
    model
      .add(req.body)
      .then((user) => {
        res.status(200).json(user);
      })
      .catch(next);
  }
);

/**
  2 [POST] /api/auth/login { "username": "sue", "password": "1234" }

  response:
  status 200
  {
    "message": "Welcome sue!"
  }

  response on invalid credentials:
  status 401
  {
    "message": "Invalid credentials"
  }
 */
router.post("/login", checkUsernameExists, (req, res, next) => {
  const { username, password } = req.body;
  const matchPass = bcrypt.compareSync(password, req.user.password);
  if (matchPass) {
    req.session.user = req.user;
    res.status(200).json({
      message: `Welcome ${username}!`,
    });
  } else {
    res.status(401).json({
      message: "Invalid credentials",
    });
  }
});

/**
  3 [GET] /api/auth/logout

  response for logged-in users:
  status 200
  {
    "message": "logged out"
  }

  response for not-logged-in users:
  status 200
  {
    "message": "no session"
  }
 */
router.get("/logout", (req, res, next) => {
  if (req.session.user) {
    req.session.destroy((err) => {
      if (err) {
        res.status(200).json({
          message: "no session",
        });
      } else {
        res.status(200).json({
          message: "Logged out",
        });
      }
    });
  } else {
    res.status(200).json({
      message: "no session",
    });
  }
});

// Don't forget to add the router to the `exports` object so it can be required in other modules
module.exports = router;
